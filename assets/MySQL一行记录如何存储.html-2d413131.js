import{_ as e}from"./plugin-vue_export-helper-c27b6911.js";import{o as a,c as i,a as n}from"./app-4aac4727.js";const s="/assets/image-20231206193828613-4e7d69a2.png",o="/assets/image-20231206200201156-b6f875df.png",t="/assets/image-20231206201032170-1cda784d.png",r="/assets/image-20231206201329543-0c74e57e.png",d="/assets/image-20231206201423213-6866a5a7.png",c="/assets/image-20231206201641640-298735d2.png",p="/assets/image-20231206203749468-153e0be8.png",l="/assets/image-20231206203825029-efbfb35f.png",g="/assets/image-20231206203903695-ea2999f1.png",m="/assets/image-20231206203950260-65643340.png",h="/assets/image-20231206204118754-c8faaa1d.png",L={},u=n('<h2 id="mysql-数据文件存储在哪个文件" tabindex="-1"><a class="header-anchor" href="#mysql-数据文件存储在哪个文件" aria-hidden="true">#</a> MySQL 数据文件存储在哪个文件</h2><p>每创建一个数据库都会在「/var/lib/mysql/ 」 目录里面创建一个以该数据库为名的目录，然后保存表结构和表数据的文件都会存放在这个目录里。</p><ul><li><strong>db.opt</strong>：存储当前数据库的默认字符集和字符校验规则。</li><li><strong>表名.frm</strong>：存储表结构信息。</li><li><strong>表名.ibd</strong>：存储表数据。</li></ul><h2 id="表空间文件结构" tabindex="-1"><a class="header-anchor" href="#表空间文件结构" aria-hidden="true">#</a> 表空间文件结构</h2><p><strong>表空间由段「segment」、区「extent」、页「page」、行「row」组成</strong>，InnoDB存储引擎的逻辑存储结构大致如下图：</p><img src="'+s+'" alt="image-20231206193828613" style="zoom:50%;"><h3 id="行" tabindex="-1"><a class="header-anchor" href="#行" aria-hidden="true">#</a> 行</h3><p>数据库表中的记录都是按「行」进行存放的，每行记录根据不同的行格式，有不同的存储结构。</p><h3 id="页" tabindex="-1"><a class="header-anchor" href="#页" aria-hidden="true">#</a> 页</h3><p>记录是按照行来存储的，但是数据库的读取并不以「行」为单位，否则一次读取（也就是一次 I/O 操作）只能处理一行数据，效率会非常低。</p><p>因此，<strong>InnoDB 的数据是按「页」为单位来读写的</strong>，也就是说，当需要读一条记录的时候，并不是将这个行记录从磁盘读出来，而是以页为单位，将其整体读入内存。</p><p><strong>默认每个页的大小为 16KB</strong>，也就是最多能保证 16KB 的连续存储空间。</p><p>页是 InnoDB 存储引擎磁盘管理的最小单元，意味着数据库每次读写都是以 16KB 为单位的，一次最少从磁盘中读取 16KB 的内容到内存中，一次最少把内存中的 16KB 内容刷新到磁盘中。</p><h3 id="区" tabindex="-1"><a class="header-anchor" href="#区" aria-hidden="true">#</a> 区</h3><p>B+ 树中每一层都是通过双向链表连接起来的，如果是以页为单位来分配存储空间，那么链表中相邻的两个页之间的物理位置并不是连续的，可能离得非常远，那么磁盘查询时就会有大量的随机 I/O，随机 I/O 是非常慢的。</p><p>【<strong>怎么解决呢？</strong>】</p><p>在表中数据量大的时候，为某个索引分配空间的时候就不再按照页为单位分配了，而是按照「区」为单位分配。每个区的大小为 1MB，对于 16KB 的页来说，连续的 64 个页会被划为一个区，这样就使得链表中相邻的页的物理位置也相邻，就能使用顺序 I/O 了。</p><h3 id="段" tabindex="-1"><a class="header-anchor" href="#段" aria-hidden="true">#</a> 段</h3><p>表空间是由各个段组成的，段是由多个区组成的。段一般分为「数据段」、「索引段」和「回滚段」等。</p><ul><li>索引段：存放 B + 树的非叶子节点的区的集合。</li><li>数据段：存放 B + 树的叶子节点的区的集合。</li><li>回滚段：存放的是回滚数据的区的集合，MVCC 利用了回滚段实现了多版本查询数据。</li></ul><h2 id="innodb-行格式" tabindex="-1"><a class="header-anchor" href="#innodb-行格式" aria-hidden="true">#</a> InnoDB 行格式</h2><p>有下面 4 种行格式：</p><ul><li><strong>Redundant</strong>：MySQL 5.0 版本之前用的行格式，不紧凑。</li><li><strong>Compact</strong>：MySQL 5.1 版本之后，行格式默认设置成 Compact。一种紧凑的行格式，可以让一页存储更多行记录。</li><li><strong>Dynamic</strong> 和 <strong>Compressed</strong>：从 MySQL5.7 版本之后，默认使用 Dynamic 行格式。 两个都是紧凑的行格式，它们的行格式都和 Compact 差不多，都是基于 Compact 改进一点东西。</li></ul><h3 id="compact-行格式" tabindex="-1"><a class="header-anchor" href="#compact-行格式" aria-hidden="true">#</a> COMPACT 行格式</h3><figure><img src="'+o+'" alt="image-20231206200201156" tabindex="0" loading="lazy"><figcaption>image-20231206200201156</figcaption></figure><h4 id="记录的额外信息" tabindex="-1"><a class="header-anchor" href="#记录的额外信息" aria-hidden="true">#</a> 记录的额外信息</h4><h5 id="_1-变长字段长度列表" tabindex="-1"><a class="header-anchor" href="#_1-变长字段长度列表" aria-hidden="true">#</a> 1. 变长字段长度列表</h5><blockquote><p><code>varchar(n)</code> 和 <code>char(n)</code> 的区别：<code>char </code>是定长的，<code>varchar </code>是变长的，变长字段实际存储的数据的长度（大小）不固定的。</p></blockquote><p>在存储数据的时候，要把数据占用的大小存起来，存到「变长字段长度列表」里面，读取数据的时候才能根据这个「变长字段长度列表」去读取对应长度的数据。其他 TEXT、BLOB 等变长字段也是这么实现的。</p><p>【示例】创建下面表进行演示：</p><div class="language-mysql line-numbers-mode" data-ext="mysql"><pre class="language-mysql"><code>CREATE TABLE `t_user` (\n  `id` int(11) NOT NULL,\n  `name` VARCHAR(20) DEFAULT NULL,\n  `phone` VARCHAR(20) DEFAULT NULL,\n  `age` int(11) DEFAULT NULL,\n  PRIMARY KEY (`id`) USING BTREE\n) ENGINE = InnoDB DEFAULT CHARACTER SET = ascii ROW_FORMAT = COMPACT;\n</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>假设有下面三条记录：</p><img src="'+t+'" alt="image-20231206201032170" style="zoom:50%;"><p>第一条记录「只看变长字段」：</p><ul><li><code>name</code>字段值为 <code>a</code>，占 1 字节。</li><li><code>phone</code> 字段值为 <code>123</code>，占 3 字节。</li></ul><p>这些变长字段的真实数据占用的字节数会按照列的顺序 <strong>逆序存放</strong>，所以「变长字段长度列表」里的内容是「 03 01」，而不是 「01 03」。</p><figure><img src="'+r+'" alt="image-20231206201329543" tabindex="0" loading="lazy"><figcaption>image-20231206201329543</figcaption></figure><p>同理，第二天记录：</p><figure><img src="'+d+'" alt="image-20231206201423213" tabindex="0" loading="lazy"><figcaption>image-20231206201423213</figcaption></figure><p><strong>第三条记录</strong> 中 <code>phone </code>列的值是 NULL，<strong>NULL 是不会存放在行格式中记录的真实数据部分里的</strong>，所以「变长字段长度列表」里不需要保存值为 NULL 的变长字段的长度。</p><figure><img src="'+c+'" alt="image-20231206201641640" tabindex="0" loading="lazy"><figcaption>image-20231206201641640</figcaption></figure><hr><p>【为什么「变长字段长度列表」的信息要按照逆序存放】</p><p>因为「记录头信息」中指向下一个记录的指针，指向的是下一条记录的「记录头信息」和「真实数据」之间的位置，这样的好处是向左读就是记录头信息，向右读就是真实数据，比较方便。</p><p>「变长字段长度列表」中的信息之所以要逆序存放，是因为这样可以<strong>使得位置靠前的记录的真实数据和数据对应的字段长度信息可以同时在一个 CPU Cache Line 中，这样就可以提高 CPU Cache 的命中率</strong>。</p><p><strong>当数据表没有变长字段的时候，比如全部都是 int 类型的字段，这时候表里的行格式就不会有「变长字段长度列表」了</strong>，因为没必要，不如去掉以节省空间。</p><p>所以「变长字段长度列表」只出现在数据表有变长字段的时候。</p><h5 id="_2-null-值列表" tabindex="-1"><a class="header-anchor" href="#_2-null-值列表" aria-hidden="true">#</a> 2. NULL 值列表</h5><p>表中的某些列可能会存储 NULL 值，如果把这些 NULL 值都放到记录的真实数据中会比较浪费空间，所以 Compact 行格式把这些值为 NULL 的列存储到 NULL 值列表中。</p><p>如果存在允许 NULL 值的列，则每个列对应一个二进制位（bit），二进制位按照列的顺序逆序排列。</p><ul><li>二进制位的值为<code>1</code>时，代表该列的值为 NULL。</li><li>二进制位的值为<code>0</code>时，代表该列的值不为 NULL。</li></ul><p>另外，NULL 值列表必须用整数个字节的位表示（1字节8位），如果使用的二进制位个数不足整数个字节，则在字节的高位补 <code>0</code>。</p><p>当一条记录有 9 个字段值都是 NULL，那么就会创建 2 字节空间的「NULL 值列表」，以此类推。</p><p><strong>当数据表的字段都定义成 NOT NULL 的时候，这时候表里的行格式就不会有 NULL 值列表了</strong>。</p><blockquote><p>💡所以在设计数据库表的时候，通常都是建议将字段设置为 NOT NULL，这样可以至少节省 1 字节的空间（NULL 值列表至少占用 1 字节空间）。</p></blockquote><hr><p>【举例】以上面表举例：</p><img src="'+p+'" alt="image-20231206203749468" style="zoom:50%;"><p>第一条记录：</p><img src="'+l+'" alt="image-20231206203825029" style="zoom:25%;"><p>但是 InnoDB 是用整数字节的二进制位来表示 NULL 值列表的，现在不足 8 位，所以要在高位补 0，最终用二进制来表示：</p><img src="'+g+'" alt="image-20231206203903695" style="zoom:33%;"><p>第二天记录：</p><img src="'+m+'" alt="image-20231206203950260" style="zoom:33%;"><p>将三条记录的 NULL 值列表填充完毕后，行格式为下面这样：</p><img src="'+h+'" alt="image-20231206204118754" style="zoom:50%;"><h5 id="_3-记录头信息" tabindex="-1"><a class="header-anchor" href="#_3-记录头信息" aria-hidden="true">#</a> 3. 记录头信息</h5><p>列举比较重要的几个：</p><ul><li></li></ul>',69),_=[u];function f(b,N){return a(),i("div",null,_)}const v=e(L,[["render",f],["__file","MySQL一行记录如何存储.html.vue"]]);export{v as default};
