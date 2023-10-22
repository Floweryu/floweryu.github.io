---
title: JVM垃圾回收基础
categories: [Java]
tags: [后端, JVM]
date: 2023-10-21 23:00:00
---

# 如何判断对象需要回收？
## 引用计数算法

给对象添加一个引用计数器，当对象增加一个引用时计数器加1，引用失效时计数器减1。引用计数为0的对象可被回收。

**缺点：**两个对象出现循环引用的情况下，此时引用计数器永远不为0，导致无法对它们进行回收。

```java
public class ReferenceCountingGC {
    public Object instance = null;

    public static void main(String[] args) {
        ReferenceCountingGC objectA = new ReferenceCountingGC();
        ReferenceCountingGC objectB = new ReferenceCountingGC();
        objectA.instance = objectB;
        objectB.instance = objectA;
    }
}
```
因为循环引用的存在，所以 Java 虚拟机不适用引用计数算法。

## 可达性分析算法

通过一系列的称为`GC Roots`的对象作为起点，从这些节点开始向下搜索，节点所走过的路径称为引用链，当一个对象到`GC Roots`没有任何引用链相连的话，则证明此对象不可用。即能到达的对象视为存活，不能到达的对象视为失活。

> 对象object 5、object 6、object 7虽然互有关联，但是它们到GC Roots是不可达的， 因此它们将会被判定为可回收的对象。

![image-20231021225232901](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202310212252917.png)
可作为`GC Roots`的对象包括以下几种：

- **虚拟机栈中引用的对象**。譬如各个线程被调用的方法堆栈中使用到的 参数、局部变量、临时变量等
- **本地方法栈中引用的对象（Native)方法**。
- **方法区中，类静态属性引用的对象**。譬如Java类的引用类型静态变量。
- **方法区中，常量引用的对象**。譬如字符串常量池（String Table）里的引用。
- **Java虚拟机内部的引用**，如基本数据类型对应的Class对象，一些常驻的异常对象（比如 NullPointExcepiton、OutOfMemoryError）等，还有系统类加载器。
- 所有被同步锁（synchronized关键字）持有的对象。

## 引用类型

无论是通过引用计算算法判断对象的引用数量，还是通过可达性分析算法判断对象的引用链是否可达，判定对象是否可被回收都与引用有关。

Java 具有四种强度不同的引用类型。

###  强引用

`被强引用关联的对象不会被垃圾收集器回收。`
创建方法：使用`new`一个新对象的方式来创建强引用。

```java
Object obj = new Object();
```
### 软引用

`被软引用（Soft Reference）关联的对象，只有在内存不够的情况下才会被回收。`

创建方法：使用 `SoftReference` 类来创建软引用。

```java
Object obj = new Object();
SoftReference<Object> sf = new SoftReference<Object>(obj);
obj = null; // 使对象只被软引用关联
```
### 弱引用

`被弱引用（Weak Reference）关联的对象一定会被垃圾收集器回收，也就是说它只能存活到下一次垃圾收集发生之前。`

创建方法：使用 `WeakReference` 类来实现弱引用。

```java
Object obj = new Object();
WeakReference<Object> wf = new WeakReference<Object>(obj);
obj = null;
```
`WeakHashMap` 的 `Entry` 继承自 `WeakReference`，主要用来实现缓存。

```java
private static class Entry<K,V> extends WeakReference<Object> implements Map.Entry<K,V>
```
### 虚引用

又称为幽灵引用或者幻影引用。一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用取得一个对象实例。

为一个对象设置虚引用关联的唯一目的就是`能在这个对象被收集器回收时收到一个系统通知。`

创建方法：使用 `PhantomReference` 来实现虚引用。

```java
Object obj = new Object();
PhantomReference<Object> pf = new PhantomReference<Object>(obj);
obj = null;
```
虚引⽤必须和引⽤队列（ReferenceQueue）联合使⽤。当垃圾回收器准备回收⼀个对象时，如果发现它还有虚引⽤，就会在回收对象的内存之前，把这个虚引⽤加⼊到与之关联的引⽤队列中。程序可以通过判断引⽤队列中是 否已经加⼊了虚引⽤，来了解被引⽤的对象是否将要被垃圾回收。程序如果发现某个虚引⽤已经被加⼊到引⽤队列，那么就可以在所引⽤的对象的内存被回收之前采取必要的⾏动。

### 1.4 方法区的回收
因为方法区主要存放永久代对象，而永久代对象的回收率比年轻代差很多，因此在方法区上进行回收性价比不高。

**主要是对常量池的回收和对类的卸载。**

类的卸载条件很多，需要满足以下三个条件，并且满足了也不一定会被卸载：

 - 该类所有的实例都已经被回收，也就是 Java 堆中不存在该类的任何实例。
 - 加载该类的 `ClassLoader` 已经被回收
 - 该类对应的 `java.lang.Class` 对象没有在任何地方被引用，也就无法在任何地方通过反射访问该类方法。

可以通过 `-Xnoclassgc` 参数来控制是否对类进行卸载。

### 1.5  `finalize()`
`finalize()` 类似 C++ 的析构函数，用来做关闭外部资源等工作。但是 `try-finally` 等方式可以做的更好，并且该方法运行代价高昂，不确定性大，无法保证各个对象的调用顺序，因此最好不要使用` finalize()`。

当一个对象可被回收时，如果需要执行该对象的 `finalize()` 方法，那么就有可能通过在该方法中让对象重新被引用，从而实现自救。

# 垃圾回收算法

## 垃圾收集性能

垃圾收集器的性能指标主要有两点：
 - **停顿时间**：停顿时间是因为 `GC` 而导致程序不能工作的时间长度。
 - **吞吐量**：吞吐量关注在特定的时间周期内一个应用的工作量的最大值。对关注吞吐量的应用来说长暂停时间是可以接受的。由于高吞吐量的应用关注的基准在更长周期时间上，所以快速响应时间不在考虑之内。

## 标记 - 清除（Mark-Sweep）算法

将需要回收的对象进行标记，然后清理掉被标记的对象。

**缺点**：
 - 标记和清除过程效率都不高；
 - 会产生大量不连续的内存碎片，导致无法给大对象分配内存。

## 标记 - 整理（Mark-Compact）算法

让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存。

**不足**：这种做法能够解决内存碎片化的问题，但代价是压缩算法的性能开销。

## 复制（Copying）算法

将内存划分为大小相等的两块，每次只使用其中一块，当这一块内存用完了就将还存活的对象复制到另一块上面，然后再把使用过的内存空间进行一次清理。

**不足**：主要不足是只使用了内存的一半。

> 现在的商业虚拟机都采用这种收集算法来回收年轻代，但是并不是将内存划分为大小相等的两块，而是分为一块较大的 Eden 空间和两块较小的 Survior 空间。每次使用 Eden 空间和其中一块 Survivor。在回收时，将 Eden 和 Survivor 中还存活着的对象一次性复制到另一块 Survivor 空间上，最后清理 Eden 和使用过的那一块 Survivor。

## 分代收集

它根据对象存活周期将内存划分为几块，不同块采用适当的收集算法。

一般将 Java 堆分为年轻代和老年代。
- 年轻代使用：**复制** 算法
- 老年代使用：**标记 - 清理** 或者 **标记 - 整理** 算法

![image-20231021231002355](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202310212310673.png)

Java 8 JVM 的内存结构主要由三大块组成：堆内存、元空间和栈，Java 堆是内存空间占据最大的一块区域。

![image-20231022124750244](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202310221247489.png)

### 新生代（Young generation）

新生代是大部分对象创建和销毁的区域，在通常的 Java 应用中，绝大部分对象生命周期都是很短暂的。

其内部又分为 `Eden` 区域，作为对象初始分配的区域；两个 `Survivor`，有时候也叫 `from、to `区域，被用来放置从 `Minor GC `中保留下来的对象。

新生成的对象会被分配在`Eden`区域（如果对象太大会直接分配在老年代中），第一次GC会随机选取一个`survivor`作为`to`区域，另一个区域就是`from`区，将`Eden`区域存活的对象复制到`to`区域。第二次GC时，`from`和`to`区职责互换，这时会将`Eden`区和上一次的`to`区域中存活的对象复制到`from`区域。

JVM 会随意选取一个 `Survivor` 区域作为 `to`，然后会在 GC 过程中进行区域间拷贝，也就是将 `Eden` 中存活下来的对象和 `from` 区域的对象，拷贝到这个to区域。这种设计主要是为了防止内存的碎片化，并进一步清理无用对象。

Java 虚拟机会记录 `Survivor` 区中的对象一共被来回复制了几次。如果一个对象被复制的次数为 15（对应虚拟机参数 `-XX:+MaxTenuringThreshold`），那么该对象将被晋升（promote）至老年代。另外，如果单个 `Survivor` 区已经被占用了 50%（对应虚拟机参数 `-XX:TargetSurvivorRatio`），那么较高复制次数的对象也会被晋升至老年代。

### 老年代（Old generation）

放置长生命周期的对象，通常都是从 `Survivor` 区域拷贝过来的对象。当然，也有特殊情况，**如果对象较大**，JVM 会试图直接分配在 Eden 其他位置上；**如果对象太大**，完全无法在新生代找到足够长的连续空闲空间，JVM 就会直接分配到老年代。

### 永久代（Permanent generation）

这部分就是早期 Hotspot JVM 的方法区实现方式了，储存 Java 类元数据、常量池、Intern 字符串缓存。在 JDK 8 之后就不存在永久代这块儿了。

Java8 之前使用永久代（Permanent Generation，简称 PermGen）实现方法区，而 **Java8 之后使用元空间（Metaspace）**实现。

JDK8 之前可以通过` -XX:PermSize `和` -XX:MaxPermSize` 来设置永久代大小，JDK8 之后，使用元空间替换了永久代，改为通过` -XX:MetaspaceSize` 和 `-XX:MaxMetaspaceSize` 来设置元空间大小。

#### 永久代问题

**1. 内存溢出**

永久代的空间是有限制的，可以通过 `-XX:PermSize` 设置永久代初始容量，通过`-XX:MaxPermSize` 设置永久代最大容量。

但是当加载过多的类或者常量的时候，就可能导致永久代的空间不足，抛出 java.lang.OutOfMemoryError: PermGen space 异常。

**2. 垃圾回收效率低下**

永久代中的类信息一般是在应用程序运行期间不会发生变化的，因此，如果开启了永久代的垃圾回收，就会造成大量的垃圾回收操作，导致垃圾回收效率低下，甚至会引起应用程序的暂停。

此外，由于永久代主要存放 JVM 加载的类信息等永久存在的数据，这使得它在垃圾回收过程中的回收效率相对较低。在某些情况下，频繁触发的 Full GC 不仅无法有效回收永久代空间，还会严重影响 JVM 的性能。

**3. 无法动态调整大小**

永久代的大小一旦被设置，就无法动态调整，如果预估错误，就可能导致浪费内存或内存不足的问题。

**4. 无法回收常量池中的内存**

在永久代中，常量池是一个非常重要的部分，但是其中的常量无法被回收，即使这些常量已经不再被使用，也无法被垃圾回收器回收，这会浪费内存。

### 元空间（Metaspace）

> 元空间（Metaspace）是 Java8 中引入的一个新概念，用来替代原来的永久代。与永久代不同，元空间并不在虚拟机中，而是存储在本地内存（Native Memory）。

在 Java8 中彻底移除了永久代，把将**类的元数据信息、运行时常量、类常量、静态变量、即时编译器编译后的代码**从永久代中移到了元空间中，**字符串常量由永久代转移到堆中**。

**【优点】**

1. **突破内存限制，减少OOM**。 由于元空间使用的是本地内存，而不是 JVM 内存，因此理论上，其大小只受限于操作系统的实际可用内存。这大大减少了内存溢出的可能性。相较于永久代在 JVM 堆中预分配的有限空间，元空间的引入提供了更大的空间来存储类元数据。
2. **提高 Full GC 的效率**。 在永久代中，Full GC 的触发比较频繁，而且效率较低。因为永久代中存放了很多 JVM 需要的类信息，这些数据大多数是不会被清理的，所以 Full GC 往往无法回收多少空间。但在元空间模型中，由于字符串常量池已移至堆中，静态变量也移至 Java 堆或者本地内存，因此可以更有效地进行垃圾回收，避免了因频繁的 Full GC 导致的性能影响。
3. **满足不同的类加载需求和动态类加载的情况**。 在一些大型的、模块化的应用中，可能需要加载大量的类，这就需要大量的元数据存储空间。元空间可以动态地调整大小，能更好地满足这种需求。
4. **避免永久代调优和大小设置的复杂性**。 在 Java8 之前的版本中，通常需要手动设置永久代的大小，以避免内存溢出的错误。这增加了应用的配置和管理的复杂性。而元空间使用本地内存，根据实际需求动态调整，大大简化了内存管理的复杂性。

#  JVM参数

JVM 允许对堆空间大小、各代空间大小进行设置，以调整 JVM GC。
|配置|默认值|  描述|
|--|--|--|
| -Xss |  | 虚拟机栈大小 |
|-Xms|物理内存的1/64(<1GB)|堆空间初始值|
|-Xmx|物理内存的1/4(<1GB)|堆空间最大值|
|-Xmn||新生代空间大小|
|-XX:NewSize||新生代空间初始值|
|-XX:MaxNewSize||新生代空间最大值|
|-XX:NewRatio|2|新生代(包括Eden和两个Survivor区)与年老代的比例|
|-XX:SurvivorRatio|8|新生代中调整 eden 区与 survivor 区的比例，默认为 8。即 eden 区为 80% 的大小，两个 survivor 分别为 10% 的大小|
|-XX:PermSize||永久代空间的初始值|
|MaxTenuringThreshold|15|垃圾最大年龄|
|PretenureSizeThreshold|0|超过这个值直接在old区分配，默认值是0，意思是不管多大都是先在eden中分配|
|MetaspaceSize|这个值大小根据不同的平台在12M到20M浮动。使用java -XX:+PrintFlagsInitial命令查看本机的初始化参数|初始化的Metaspace大小，控制元空间发生GC的阈值。GC后，动态增加或降低MetaspaceSize|
|MaxMetaspaceSize|默认值为4294967295B（大约4096MB）|限制Metaspace增长的上限，防止因为某些情况导致Metaspace无限的使用本地内存，影响到其他程序|
|MinMetaspaceFreeRatio|默认值为40，也就是40%|当进行过Metaspace GC之后，会计算当前Metaspace的空闲空间比，如果空闲比小于这个参数（即实际非空闲占比过大，内存不够用），那么虚拟机将增长Metaspace的大小|
|MaxMetasaceFreeRatio|默认值为70，也就是70%|当进行过Metaspace GC之后， 会计算当前Metaspace的空闲空间比，如果空闲比大于这个参数，那么虚拟机会释放Metaspace的部分空间|
|MaxMetaspaceExpansion|默认值为5452592B（大约为5MB）|Metaspace增长时的最大幅度|
|MinMetaspaceExpansion|默认值为340784B（大约330KB为）。|Metaspace增长时的最小幅度|

