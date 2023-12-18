---
title: MySQL锁那些事
category: [MySQL]
tag: [数据库, 原理]
date: 2023-12-17 20:15:00
---

## MySQL锁的类型

### 全局锁

使用全局锁：

```mysql
flush tables with read lock
```

执行后，**整个数据库就处于只读状态了**，这时其他线程执行以下操作，都会被阻塞：

- 对数据的增删改操作，比如 `insert、delete、update`等语句。
- 对表结构的更改操作，比如 `alter table、drop table` 等语句。

如果要释放全局锁，则要执行这条命令：

```mysql
unlock tables
```

【应用场景】

**全库逻辑备份**。这样在备份数据库期间，不会因为数据或表结构的更新，而出现备份文件的数据与预期的不一样。

【缺点】

全局锁意味着整个数据库都是**只读状态**。业务只能读数据，而不能更新数据，这样会造成业务停滞。

> 既然备份数据库数据的时候，使用全局锁会影响业务，那有什么其他方式可以避免？
>
> 在备份数据库之前先开启事务，会先创建 Read View，然后整个事务执行期间都在用这个 Read View，而且由于 MVCC 的支持，备份期间业务依然可以对数据进行更新操作。
>
> 备份数据库的工具是 mysqldump，在使用 mysqldump 时加上 `–single-transaction` 参数的时候，就会在备份数据库之前先开启事务。这种方法只适用于支持「可重复读隔离级别的事务」的存储引擎。



### 行锁与表锁

- 行锁就是锁定某行
- 表锁就是对整张表进行加锁

各引擎对锁的支持情况如下：

|        | 行锁 | 表锁 | 页锁 |
| :----: | :--: | :--: | :--: |
| MyISAM |      |  √   |      |
| InnoDB |  √   |  √   |      |
|  BDB   |      |  √   |  √   |

### 行级锁

通过二级索引查询数据时，加锁流程示意图：

![1614350-20201115221104598-1160606998](./assets/YPQXyAuKqF1kOWa.png)

接下来以两条SQL的执行为例，讲解一下InnoDB对于单行数据的加锁原理：

```mysql
update user set age = 10 where id = 49;
update user set age = 10 where name = 'Tom';
```

第一条SQL使用主键查询，只需要在 id = 49 这个主键索引上加上锁。第二条 SQL 使用二级索引来查询，那么首先在 name = Tom 这个索引上加写锁，然后由于使用 InnoDB 二级索引还需再次根据主键索引查询，所以还需要在 id = 49 这个主键索引上加锁。

也就是说使用主键索引需要加一把锁，使用二级索引需要在二级索引和主键索引上各加一把锁。

根据索引对单行数据进行更新的加锁原理了解了，那如果更新操作涉及多个行呢，比如下面 SQL 的执行场景。

```sql
update user set age = 10 where id > 49;
```

上述 SQL 的执行过程如下图所示。MySQL Server 会根据 WHERE 条件读取第一条满足条件的记录，然后 InnoDB 引擎会将第一条记录返回并加锁，接着 MySQL Server 发起更新改行记录的 UPDATE 请求，更新这条记录。一条记录操作完成，再读取下一条记录，直至没有匹配的记录为止。



![1614350-20201115221131283-1993522185](./assets/BP1luwCT3jNZ7Xd.png)

行级锁的类型主要有三类：

- **Record Lock**：记录锁，也就是仅仅把一条记录锁上。
- **Gap Lock**：间隙锁，锁定一个范围，但是不包含记录本身。
- **Next-Key Lock**：Record Lock + Gap Lock 的组合，锁定一个范围，并且锁定记录本身。

#### 记录锁 Record Lock

InnoDB实现了以下两种类型的行锁：

- **共享锁（S）**：加了锁的记录，所有事务都能去读取但不能修改，同时阻止其他事务获得相同数据集的「排他锁」。
- **排他锁（X）**：允许已经获得排他锁的事务去更新数据，阻止其他事务取得相同数据集的「共享锁」和「排他锁」。

【**`select for update`**】

在执行这个 select 查询语句的时候，会将对应的索引访问条目加上排他锁（X锁），也就是说这个语句对应的锁就相当于update带来的效果。

**使用场景**：为了让确保自己查找到的数据一定是最新数据，并且查找到后的数据值允许自己来修改，此时就需要用到select for update语句。

**性能分析**：`select for update`语句相当于一个`update`语句。在业务繁忙的情况下，如果事务没有及时地`commit`或者`rollback`可能会造成事务长时间的等待，从而影响数据库的并发使用效率。

【**`select lock in share mode`**】

`in share mode` 子句的作用就是将查找的数据加上一个share锁，这个就是表示其他的事务只能对这些数据进行简单的 select 操作，而不能进行 DML 操作。

**使用场景**：为了确保自己查询的数据不会被其他事务正在修改，也就是确保自己查询到的数据是最新的数据，并且不允许其他事务来修改数据。与`select for update`不同的是，本事务在查找完之后不一定能去更新数据，因为有可能其他事务也对同数据集使用了` in share mode` 的方式加上了S锁；

**性能分析**：`select lock in share mode` 语句是一个给查找的数据上一个共享锁（S 锁）的功能，它允许其他的事务也对该数据上S锁，但是不能够允许对该数据进行修改。如果不及时的`commit `或者`rollback `也可能会造成大量的事务等待。

#### 间隙锁 Gap Lock

Gap Lock 称为间隙锁，只存在于可重复读隔离级别，目的是为了解决可重复读隔离级别下「」的现象。

上面这段话表明间隙锁是可以共存的，共享间隙锁与独占间隙锁之间是没有区别的，两者之间并不冲突。其存在的目的都是防止其他事务往间隙中插入新的纪录，故而一个事务所采取的间隙锁是不会去阻止另外一个事务在同一个间隙中加锁的。

### 表级锁

MySQL 里面表级别的锁有这几种：

- 表锁。
- 元数据锁（MDL）。
- 意向锁。
- AUTO-INC 锁。

#### 表锁

在会话开始的地方使用 `lock `命令将后续需要用到的表都加上锁，在表释放前，只能访问这些加锁的表，不能访问其他表，直到最后通过 `unlock tables` 释放所有表锁。

除了使用 `unlock tables` 显示释放锁之外，会话持有其他表锁时执行`lock table` 语句会释放会话之前持有的锁；会话持有其他表锁时执行 `start transaction` 或者 `begin `开启事务时，也会释放之前持有的锁。

表锁由 MySQL Server 实现，行锁则是存储引擎实现，不同的引擎实现的不同。在 MySQL 的常用引擎中 InnoDB 支持行锁，而 MyISAM 则只能使用 MySQL Server 提供的表锁。

#### 元数据锁

对数据库表进行操作时，会自动给这个表加上 MDL：

- 对一张表进行 CRUD 操作时，加的是 **MDL 读锁**。
- 对一张表做结构变更操作的时候，加的是 **MDL 写锁**。

MDL 是为了保证当用户对表执行 CRUD 操作时，防止其他线程对这个表结构做了变更。

申请 MDL 锁的操作会形成一个队列，队列中**写锁获取优先级高于读锁**，一旦出现 MDL 写锁等待，会阻塞后续该表的所有 CRUD 操作。

#### 意向锁

- 在使用 InnoDB 引擎的表里对某些记录加上「共享锁」之前，需要先在表级别加上一个「意向共享锁」；
- 在使用 InnoDB 引擎的表里对某些纪录加上「独占锁」之前，需要先在表级别加上一个「意向独占锁」；

也就是，当执行插入、更新、删除操作，需要先对表加上「意向独占锁」，然后对该记录加独占锁。

而普通的 select 是不会加行级锁的，普通的 select 语句是利用 MVCC 实现一致性读，是无锁的。

不过，select 也是可以对记录加共享锁和独占锁的，具体方式如下：

```sql
//先在表上加上意向共享锁，然后对读取的记录加共享锁
select ... lock in share mode;

//先表上加上意向独占锁，然后对读取的记录加独占锁
select ... for update;
```

**意向共享锁和意向独占锁是表级锁，不会和行级的共享锁和独占锁发生冲突，而且意向锁之间也不会发生冲突，只会和共享表锁（`lock tables ... read`）和独占表锁（`lock tables ... write`）发生冲突。**

【为什么要有意向锁呢？】

如果没有「意向锁」，那么加「独占表锁」时，就需要遍历表里所有记录，查看是否有记录存在独占锁，这样效率会很慢。

那么有了「意向锁」，由于在对记录加独占锁前，先会加上表级别的意向独占锁，那么在加「独占表锁」时，直接查该表是否有意向独占锁，如果有就意味着表里已经有记录被加了独占锁，这样就不用去遍历表里的记录。

所以，**意向锁的目的是为了快速判断表里是否有记录被加锁**。

#### AUTO-INC 锁

表里的主键通常都会设置成自增的，这是通过对主键字段声明 `AUTO_INCREMENT` 属性实现的。

之后可以在插入数据时，可以不指定主键的值，数据库会自动给主键赋值递增的值，这主要是通过 **AUTO-INC 锁**实现的。

AUTO-INC 锁是特殊的表锁机制，锁**不是再一个事务提交后才释放，而是再执行完插入语句后就会立即释放**。

**在插入数据时，会加一个表级别的 AUTO-INC 锁**，然后为被 `AUTO_INCREMENT` 修饰的字段赋值递增的值，等插入语句执行完成后，才会把 AUTO-INC 锁释放掉。

所以，一个事务在持有 AUTO-INC 锁的过程中，其他事务的如果要向该表插入语句都会被阻塞，从而保证插入数据时，被 `AUTO_INCREMENT` 修饰的字段的值是连续递增的。

但是， AUTO-INC 锁再对大量数据进行插入的时候，会影响插入性能，因为另一个事务中的插入会被阻塞。

因此， 在 MySQL 5.1.22 版本开始，InnoDB 存储引擎提供了一种**轻量级的锁**来实现自增。

在插入数据的时候，会为被 `AUTO_INCREMENT` 修饰的字段加上轻量级锁，**然后给该字段赋值一个自增的值，就把这个轻量级锁释放了，而不需要等待整个插入语句执行完后才释放锁**。

InnoDB 存储引擎提供了个 `innodb_autoinc_lock_mode` 的系统变量，是用来控制选择用 AUTO-INC 锁，还是轻量级的锁。

- 当 `innodb_autoinc_lock_mode = 0`：就采用 AUTO-INC 锁，语句执行结束后才释放锁。
- 当 `innodb_autoinc_lock_mode = 2`：就采用轻量级锁，申请自增主键后就释放锁，并不需要等语句执行后才释放。
- 当 `innodb_autoinc_lock_mode = 1`：
  - 普通 `insert` 语句，自增锁在申请之后就马上释放。
  - 类似 `insert … select` 这样的批量插入数据的语句，自增锁还是要等语句结束后才被释放。



### 两种锁比较

表锁：加锁过程的开销小，加锁的速度快；不会出现死锁的情况；锁定的粒度大，发生锁冲突的几率大，并发度低。

- 一般在执行DDL语句时会对整个表进行加锁，比如说 ALTER TABLE 等操作；
- 如果对InnoDB的表使用行锁，被锁定字段不是主键，也没有针对它建立索引的话，那么将会锁整张表；
- 表级锁更适合于以查询为主，并发用户少，只有少量按索引条件更新数据的应用，如Web 应用。

行锁：加锁过程的开销大，加锁的速度慢；会出现死锁；锁定粒度最小，发生锁冲突的概率最低，并发度也最高；

- 最大程度的支持并发，同时也带来了最大的锁开销。
- 在 InnoDB 中，除单个 SQL 组成的事务外，锁是逐步获得的，这就决定了在 InnoDB 中发生死锁是可能的。
- 行级锁只在存储引擎层实现，而 MySQL 服务器层没有实现。 行级锁更适合于有大量按索引条件并发更新少量不同数据，同时又有并发查询的应用，如一些在线事务处理（OLTP）系统。

## 2.3 InnoDB的加锁方法

- 意向锁是 InnoDB 自动加的，不需要用户干预；
- 对于`UPDATE`、`DELETE`和`INSERT`语句，`InnoDB`会自动给涉及的数据集加上排他锁；
- 对于普通的SELECT语句，InnoDB不会加任何锁；事务可以通过以下语句显示给记录集添加共享锁或排他锁：
  - 共享锁（S）：`select * from table_name where ... lock in share mode`。此时其他 session 仍然可以查询记录，并也可以对该记录加 `share mode` 的共享锁。但是如果当前事务需要对该记录进行更新操作，则很有可能造成死锁。
  - 排他锁（X）：`select * from table_name where ... for update`。其他session可以查询记录，但是不能对该记录加共享锁或排他锁，只能等待锁释放后在加锁。



## 2.4 InnoDB的锁争用情况

可以通过检查 InnoDB_row_lock 状态变量来分析系统上的行锁的争夺情况：

```mysql
mysql> show status like 'innodb_row_lock%';
+-------------------------------+-------+
| Variable_name                 | Value |
+-------------------------------+-------+
| Innodb_row_lock_current_waits | 0     |
| Innodb_row_lock_time          | 85677 |
| Innodb_row_lock_time_avg      | 42838 |
| Innodb_row_lock_time_max      | 49289 |
| Innodb_row_lock_waits         | 2     |
+-------------------------------+-------+
5 rows in set (0.52 sec)
```

# 3. MyISAM表锁

## 3.1 MyISAM表级锁模式

- 表共享读锁（Table Read Lock）：不会阻塞其他线程对同一个表的读操作请求，但会阻塞其他线程的写操作请求；
- 表独占写锁（Table Write Lock）：一旦表被加上独占写锁，那么无论其他线程是读操作还是写操作，都会被阻塞；

默认情况下，写锁比读锁具有更高的优先级；当一个锁释放后，那么它会优先相应写锁等待队列中的锁请求，然后再是读锁中等待的获取锁的请求。

> This ensures that updates to a table are not “starved” even when there is heavy SELECT activity for the table. However, if there are many updates for a table, SELECT statements wait until there are no more updates.

这种设定也是MyISAM表不适合于有大量更新操作和查询操作的原因。大量更新操作可能会造成查询操作很难以获取读锁，从而过长的阻塞。同时一些需要长时间运行的查询操作，也会使得线程“饿死”，应用中应尽量避免出现长时间运行的查询操作（在可能的情况下可以通过使用中间表等措施对SQL语句做一定的“分解”，使每一步查询都能在较短的时间内完成，从而减少锁冲突。如果复杂查询不可避免，应尽量安排在数据库空闲时段执行，比如一些定期统计可以安排在夜间执行。）

可以通过一些设置来调节MyISAM的调度行为：

- 通过指定启动参数`low-priority-updates`，使MyISAM引擎默认给予读请求以优先的权利；
- 通过执行命令`SET LOW_PRIORITY_UPDATES=1`，使该连接发出的更新请求优先级降低；
- 通过指定INSERT、UPDATE、DELETE语句的`LOW_PRIORITY`属性，降低该语句的优先级；
- 给系统参数`max_write_lock_count`设置一个合适的值，当一个表的读锁达到这个值后，MySQL就暂时将写请求的优先级降低，给读进程一定获得锁的机会。

## 3.2 MyISAM对表加锁分析

MyISAM在执行查询语句（SELECT）前，会自动给涉及的所有表加读锁，在执行更新操作（UPDATE、DELETE、INSERT等）前，会自动给涉及的表加写锁，这个过程并不需要用户干预，因此用户一般不需要直接用 LOCK TABLE 命令给 MyISAM 表显式加锁。在自动加锁的情况下，MyISAM 总是一次获得 SQL 语句所需要的全部锁，这也正是 MyISAM 表不会出现死锁（Deadlock Free）的原因。

MyISAM存储引擎支持并发插入，以减少给定表的读操作和写操作之间的争用：

如果MyISAM表在数据文件中没有空闲块（由于删除或更新导致的空行），则行始终插入数据文件的末尾。在这种情况下，你可以自由混合并发使用MyISAM表的 INSERT 和 SELECT 语句而不需要加锁（你可以在其他线程进行读操作的情况下，同时将行插入到MyISAM表中）。如果文件中有空闲块，则并发插入会被禁止，但当所有的空闲块重新填充有新数据时，它又会自动启用。 要控制此行为，可以使用MySQL的concurrent_insert系统变量。

- 当concurrent_insert=0时，不允许并发插入功能。
- 当concurrent_insert=1时，允许对没有空闲块的表使用并发插入，新数据位于数据文件结尾（缺省）。
- 当concurrent_insert=2时，不管表有没有空想快，都允许在数据文件结尾并发插入。

## 3.3 显式加表锁的应用

上面已经提及了表锁的加锁方式，一般表锁都是隐式加锁的，不需要我们去主动声明，但是也有需要显式加锁的情况，这里简单做下介绍：

给MyISAM表显式加锁，一般是为了一定程度模拟事务操作，实现对某一时间点多个表的一致性读取。例如，有一个订单表orders，其中记录有订单的总金额total，同时还有一个订单明细表 order_detail，其中记录有订单每一产品的金额小计 subtotal，假设我们需要检查这两个表的金额合计是否相等，可能就需要执行如下两条SQL：

```sql
CopySELECT SUM(total) FROM orders;
SELECT SUM(subtotal) FROM order_detail;
```

这时，如果不先给这两个表加锁，就可能产生错误的结果，因为第一条语句执行过程中，order_detail表可能已经发生了改变。因此，正确的方法应该是：

```sql
CopyLOCK tables orders read local,order_detail read local;
SELECT SUM(total) FROM orders;
SELECT SUM(subtotal) FROM order_detail;
Unlock tables;
```

## 3.4 查看表锁争用情况

可以通过检查 table_locks_waited 和 table_locks_immediate 状态变量来分析系统上的表锁的争夺，如果 Table_locks_waited 的值比较高，则说明存在着较严重的表级锁争用情况：

```sql
Copymysql> SHOW STATUS LIKE 'Table%';
+-----------------------+---------+
| Variable_name | Value |
+-----------------------+---------+
| Table_locks_immediate | 1151552 |
| Table_locks_waited | 15324 |
+-----------------------+---------+
```

# 4. 行锁的类型

根据锁的粒度将锁分为了行锁与表锁，根据使用场景的不同，又可以将行锁进行进一步的划分：`Next-Key Lock`、`Gap Lock`、`Record Lock`以及`插入意向GAP锁`。

不同的锁锁定的位置是不同的，比如说记录锁只锁定对应的记录，而间隙锁锁住记录和记录之间的间隙，`Next-key Lock`则锁住所属记录之间的间隙。不同的锁类型锁定的范围大致如图所示：

![1614350-20201115221250844-767865625](./assets/Q934aj28IrNkueD.png)

## 4.1 记录锁（Record Lock）

记录锁最简单的一种行锁形式，行锁是加在索引上的，如果当你的查询语句不走索引的话，那么它就会升级到表锁，最终造成效率低下。

## 4.2 间隙锁（Gap Lock）

> A gap lock is a lock on a gap between index records, or a lock on the gap before the first or after the last index record。

当我们使用范围条件而不是相等条件去检索，并请求锁时，InnoDB就会给符合条件的记录的索引项加上锁；而对于键值在条件范围内但并不存在（参考上面所说的空闲块）的记录，就叫做间隙，InnoDB在此时也会对间隙加锁，这种记录锁+间隙锁的机制叫`Next-Key Lock`。

可以表明间隙锁是所在两个存在的索引之间，是一个开区间，像最开始的那张索引图，15和18之间，是有（16，17）这个间隙存在的。

> Gap locks in InnoDB are “purely inhibitive”, which means that their only purpose is to prevent other transactions from inserting to the gap. Gap locks can co-exist. A gap lock taken by one transaction does not prevent another transaction from taking a gap lock on the same gap. There is no difference between shared and exclusive gap locks. They do not conflict with each other, and they perform the same function.

上面这段话表明间隙锁是可以共存的，共享间隙锁与独占间隙锁之间是没有区别的，两者之间并不冲突。其存在的目的都是防止其他事务往间隙中插入新的纪录，故而一个事务所采取的间隙锁是不会去阻止另外一个事务在同一个间隙中加锁的。

> Gap locking can be disabled explicitly. This occurs if you change the transaction isolation level to READ COMMITTED. Under these circumstances, gap locking is disabled for searches and index scans and is used only for foreign-key constraint checking and duplicate-key checking.

这段话表明，在 RU 和 RC 两种隔离级别下，即使你使用 `select in share mode `或 `select for update`，也无法防止**幻读**（读后写的场景）。因为这两种隔离级别下只会有**行锁**，而不会有**间隙锁**。而如果是 RR 隔离级别的话，就会在间隙上加上间隙锁。

## 4.3 临键锁（Next-key Lock）

> A next-key lock is a combination of a record lock on the index record and a gap lock on the gap before the index record.

临键锁是记录锁与与间隙锁的结合，所以临键锁与间隙锁是一个同时存在的概念，并且临键锁是个左开右闭的却比如(16, 18]。

关于临键锁与幻读，官方文档有这么一条说明：

> By default, InnoDB operates in REPEATABLE READ transaction isolation level. In this case, InnoDB uses next-key locks for searches and index scans, which prevents phantom rows.

就是说 MySQL 默认隔离级别是RR，在这种级别下，如果你使用 select in share mode 或者 select for update 语句，那么InnoDB会使用临键锁（记录锁 + 间隙锁），因而可以防止幻读；

但是我也在网上看到相关描述：即使你的隔离级别是 RR，如果你这是使用普通的select语句，那么此时 InnoDB 引擎将是使用快照读，而不会使用任何锁，因而还是无法防止幻读。（其实普通读应该是快照读没错，但是快照读有些幻读问题通过MVVC解决，但解决不彻底）。

## 4.4 插入意向锁（Insert Intention Lock）

> An insert intention lock is a type of gap lock set by INSERT operations prior to row insertion. This lock signals the intent to insert in such a way that multiple transactions inserting into the same index gap need not wait for each other if they are not inserting at the same position within the gap. Suppose that there are index records with values of 4 and 7. Separate transactions that attempt to insert values of 5 and 6, respectively, each lock the gap between 4 and 7 with insert intention locks prior to obtaining the exclusive lock on the inserted row, but do not block each other because the rows are nonconflicting.

官方文档已经解释得很清楚了，这里我做个翻译机：

插入意图锁是一种间隙锁，在行执行 INSERT 之前的插入操作设置。如果多个事务 INSERT 到同一个索引间隙之间，但没有在同一位置上插入，则不会产生任何的冲突。假设有值为4和7的索引记录，现在有两事务分别尝试插入值为 5 和 6 的记录，在获得插入行的排他锁之前，都使用插入意向锁锁住 4 和 7 之间的间隙，但两者之间并不会相互阻塞，因为这两行并不冲突。

插入意向锁只会和 间隙或者 Next-key 锁冲突，正如上面所说，间隙锁作用就是防止其他事务插入记录造成幻读，正是由于在执行 INSERT 语句时需要加插入意向锁，而插入意向锁和间隙锁冲突，从而阻止了插入操作的执行。

## 4.5 不同类型锁之间的兼容

不同类型的锁之间的兼容如下表所示：

|          | RECORED | GAP  | NEXT-KEY | II GAP（插入意向锁） |
| -------- | ------- | ---- | -------- | -------------------- |
| RECORED  |         | 兼容 |          | 兼容                 |
| GAP      | 兼容    | 兼容 | 兼容     | 兼容                 |
| NEXT-KEY |         | 兼容 |          | 兼容                 |
| II GAP   | 兼容    |      |          | 兼容                 |

（其中行表示已有的锁，列表示意图加上的锁）

其中，第一行表示已有的锁，第一列表示要加的锁。插入意向锁较为特殊，所以我们先对插入意向锁做个总结，如下：

- 插入意向锁不影响其他事务加其他任何锁。也就是说，一个事务已经获取了插入意向锁，对其他事务是没有任何影响的；
- 插入意向锁与间隙锁和 Next-key 锁冲突。也就是说，一个事务想要获取插入意向锁，如果有其他事务已经加了间隙锁或 Next-key 锁，则会阻塞。

其他类型的锁的规则较为简单：

- 间隙锁不和其他锁（不包括插入意向锁）冲突；
- 记录锁和记录锁冲突，Next-key 锁和 Next-key 锁冲突，记录锁和 Next-key 锁冲突；

# 5. 参考资料

- https://juejin.cn/post/6844903799534911496

- https://www.cnblogs.com/jojop/p/13982679.html#1383854867