---
title: JVM垃圾回收基础
categories: [Java]
tags: [后端, JVM]
date: 2023-10-21 23:00:00
---

## 如何判断对象需要回收？

### 引用计数算法

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

### 可达性分析算法

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

### 引用类型

无论是通过引用计算算法判断对象的引用数量，还是通过可达性分析算法判断对象的引用链是否可达，判定对象是否可被回收都与引用有关。

Java 具有四种强度不同的引用类型。

####  强引用

`被强引用关联的对象不会被垃圾收集器回收。`
创建方法：使用`new`一个新对象的方式来创建强引用。

```java
Object obj = new Object();
```
#### 软引用

`被软引用（Soft Reference）关联的对象，只有在内存不够的情况下才会被回收。`

创建方法：使用 `SoftReference` 类来创建软引用。

```java
Object obj = new Object();
SoftReference<Object> sf = new SoftReference<Object>(obj);
obj = null; // 使对象只被软引用关联
```
#### 弱引用

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
#### 虚引用

又称为幽灵引用或者幻影引用。一个对象是否有虚引用的存在，完全不会对其生存时间构成影响，也无法通过虚引用取得一个对象实例。

为一个对象设置虚引用关联的唯一目的就是`能在这个对象被收集器回收时收到一个系统通知。`

创建方法：使用 `PhantomReference` 来实现虚引用。

```java
Object obj = new Object();
PhantomReference<Object> pf = new PhantomReference<Object>(obj);
obj = null;
```
虚引⽤必须和引⽤队列（ReferenceQueue）联合使⽤。当垃圾回收器准备回收⼀个对象时，如果发现它还有虚引⽤，就会在回收对象的内存之前，把这个虚引⽤加⼊到与之关联的引⽤队列中。程序可以通过判断引⽤队列中是 否已经加⼊了虚引⽤，来了解被引⽤的对象是否将要被垃圾回收。程序如果发现某个虚引⽤已经被加⼊到引⽤队列，那么就可以在所引⽤的对象的内存被回收之前采取必要的⾏动。

#### 1.4 方法区的回收

因为方法区主要存放永久代对象，而永久代对象的回收率比年轻代差很多，因此在方法区上进行回收性价比不高。

**主要是对常量池的回收和对类的卸载。**

类的卸载条件很多，需要满足以下三个条件，并且满足了也不一定会被卸载：

 - 该类所有的实例都已经被回收，也就是 Java 堆中不存在该类的任何实例。
 - 加载该类的 `ClassLoader` 已经被回收
 - 该类对应的 `java.lang.Class` 对象没有在任何地方被引用，也就无法在任何地方通过反射访问该类方法。

可以通过 `-Xnoclassgc` 参数来控制是否对类进行卸载。

#### 1.5  `finalize()`

`finalize()` 类似 C++ 的析构函数，用来做关闭外部资源等工作。但是 `try-finally` 等方式可以做的更好，并且该方法运行代价高昂，不确定性大，无法保证各个对象的调用顺序，因此最好不要使用` finalize()`。

当一个对象可被回收时，如果需要执行该对象的 `finalize()` 方法，那么就有可能通过在该方法中让对象重新被引用，从而实现自救。

## 垃圾回收算法

### 垃圾收集性能

垃圾收集器的性能指标主要有两点：
 - **停顿时间**：停顿时间是因为 `GC` 而导致程序不能工作的时间长度。
 - **吞吐量**：吞吐量关注在特定的时间周期内一个应用的工作量的最大值。对关注吞吐量的应用来说长暂停时间是可以接受的。由于高吞吐量的应用关注的基准在更长周期时间上，所以快速响应时间不在考虑之内。

### 标记 - 清除（Mark-Sweep）算法

将需要回收的对象进行标记，然后清理掉被标记的对象。

**缺点**：
 - 标记和清除过程效率都不高；
 - 会产生大量不连续的内存碎片，导致无法给大对象分配内存。

### 标记 - 整理（Mark-Compact）算法

让所有存活的对象都向一端移动，然后直接清理掉端边界以外的内存。

**不足**：这种做法能够解决内存碎片化的问题，但代价是压缩算法的性能开销。

### 复制（Copying）算法

将内存划分为大小相等的两块，每次只使用其中一块，当这一块内存用完了就将还存活的对象复制到另一块上面，然后再把使用过的内存空间进行一次清理。

**不足**：主要不足是只使用了内存的一半。

> 现在的商业虚拟机都采用这种收集算法来回收年轻代，但是并不是将内存划分为大小相等的两块，而是分为一块较大的 Eden 空间和两块较小的 Survior 空间。每次使用 Eden 空间和其中一块 Survivor。在回收时，将 Eden 和 Survivor 中还存活着的对象一次性复制到另一块 Survivor 空间上，最后清理 Eden 和使用过的那一块 Survivor。

### 分代收集

它根据对象存活周期将内存划分为几块，不同块采用适当的收集算法。

一般将 Java 堆分为年轻代和老年代。
- 年轻代使用：**复制** 算法
- 老年代使用：**标记 - 清理** 或者 **标记 - 整理** 算法

![image-20231021231002355](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202310212310673.png)

Java 8 JVM 的内存结构主要由三大块组成：堆内存、元空间和栈，Java 堆是内存空间占据最大的一块区域。

![image-20231022124750244](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202310221247489.png)

#### 新生代（Young generation）

新生代是大部分对象创建和销毁的区域，在通常的 Java 应用中，绝大部分对象生命周期都是很短暂的。

其内部又分为 `Eden` 区域，作为对象初始分配的区域；两个 `Survivor`，有时候也叫 `from、to `区域，被用来放置从 `Minor GC `中保留下来的对象。

新生成的对象会被分配在`Eden`区域（如果对象太大会直接分配在老年代中），第一次GC会随机选取一个`survivor`作为`to`区域，另一个区域就是`from`区，将`Eden`区域存活的对象复制到`to`区域。第二次GC时，`from`和`to`区职责互换，这时会将`Eden`区和上一次的`to`区域中存活的对象复制到`from`区域。

JVM 会随意选取一个 `Survivor` 区域作为 `to`，然后会在 GC 过程中进行区域间拷贝，也就是将 `Eden` 中存活下来的对象和 `from` 区域的对象，拷贝到这个to区域。这种设计主要是为了防止内存的碎片化，并进一步清理无用对象。

Java 虚拟机会记录 `Survivor` 区中的对象一共被来回复制了几次。如果一个对象被复制的次数为 15（对应虚拟机参数 `-XX:+MaxTenuringThreshold`），那么该对象将被晋升（promote）至老年代。另外，如果单个 `Survivor` 区已经被占用了 50%（对应虚拟机参数 `-XX:TargetSurvivorRatio`），那么较高复制次数的对象也会被晋升至老年代。

#### 老年代（Old generation）

放置长生命周期的对象，通常都是从 `Survivor` 区域拷贝过来的对象。当然，也有特殊情况，**如果对象较大**，JVM 会试图直接分配在 Eden 其他位置上；**如果对象太大**，完全无法在新生代找到足够长的连续空闲空间，JVM 就会直接分配到老年代。

#### 永久代（Permanent generation）

这部分就是早期 Hotspot JVM 的方法区实现方式了，储存 Java 类元数据、常量池、Intern 字符串缓存。在 JDK 8 之后就不存在永久代这块儿了。

Java8 之前使用永久代（Permanent Generation，简称 PermGen）实现方法区，而 **Java8 之后使用元空间（Metaspace）**实现。

JDK8 之前可以通过` -XX:PermSize `和` -XX:MaxPermSize` 来设置永久代大小，JDK8 之后，使用元空间替换了永久代，改为通过` -XX:MetaspaceSize` 和 `-XX:MaxMetaspaceSize` 来设置元空间大小。

##### 永久代问题

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

#### 元空间（Metaspace）

> 元空间（Metaspace）是 Java8 中引入的一个新概念，用来替代原来的永久代。与永久代不同，元空间并不在虚拟机中，而是存储在本地内存（Native Memory）。

在 Java8 中彻底移除了永久代，把将**类的元数据信息、运行时常量、类常量、静态变量、即时编译器编译后的代码**从永久代中移到了元空间中，**字符串常量由永久代转移到堆中**。

**【优点】**

1. **突破内存限制，减少OOM**。 由于元空间使用的是本地内存，而不是 JVM 内存，因此理论上，其大小只受限于操作系统的实际可用内存。这大大减少了内存溢出的可能性。相较于永久代在 JVM 堆中预分配的有限空间，元空间的引入提供了更大的空间来存储类元数据。
2. **提高 Full GC 的效率**。 在永久代中，Full GC 的触发比较频繁，而且效率较低。因为永久代中存放了很多 JVM 需要的类信息，这些数据大多数是不会被清理的，所以 Full GC 往往无法回收多少空间。但在元空间模型中，由于字符串常量池已移至堆中，静态变量也移至 Java 堆或者本地内存，因此可以更有效地进行垃圾回收，避免了因频繁的 Full GC 导致的性能影响。
3. **满足不同的类加载需求和动态类加载的情况**。 在一些大型的、模块化的应用中，可能需要加载大量的类，这就需要大量的元数据存储空间。元空间可以动态地调整大小，能更好地满足这种需求。
4. **避免永久代调优和大小设置的复杂性**。 在 Java8 之前的版本中，通常需要手动设置永久代的大小，以避免内存溢出的错误。这增加了应用的配置和管理的复杂性。而元空间使用本地内存，根据实际需求动态调整，大大简化了内存管理的复杂性。

##  JVM参数

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

## 内存分配与回收策略

对象的内存分配，也就是在堆上分配。主要分配在年轻代的 Eden 区上，少数情况下也可能直接分配在老年代中、

### Minor GC

当 Eden 区空间不足时，触发 Minor GC。

Minor GC 发生在年轻代上，因为年轻代对象存活时间很短，因此 Minor GC 会频繁执行，执行的速度一般也会比较快。

Minor GC 工作流程：

1. Java 应用不断创建对象，通常都是分配在 Eden 区域，当其空间不足时（达到设定的阈值），触发 minor GC。仍然被引用的对象存活下来，被复制到 JVM 选择的 Survivor 区域，而没有被引用的对象则被回收。
2. 经过一次 Minor GC，Eden 就会空闲下来，直到再次达到 Minor GC 触发条件。这时候，另外一个 Survivor 区域则会成为 To 区域，Eden 区域的存活对象和 From 区域对象，都会被复制到 To 区域，并且存活的年龄计数会被加 1。
3. 类似第二步的过程会发生很多次，直到有对象年龄计数达到阈值，这时候就会发生所谓的晋升（Promotion）过程，如下图所示，超过阈值的对象会被晋升到老年代。这个阈值是可以通过 `-XX:MaxTenuringThreshold` 参数指定。

### Full GC

Full GC 发生在老年代上，老年代对象和年轻代的相反，其存活时间长，因此 Full GC 很少执行，而且执行速度会比 Minor GC 慢很多。

### 内存分配策略

#### 对象优先在 Eden 分配

大多数情况下，对象在年轻代 Eden 区分配，当 Eden 区空间不够时，发起 Minor GC。

#### 大对象直接进入老年代

大对象是指需要连续内存空间的对象，最典型的大对象是那种很长的字符串以及数组。

经常出现大对象会提前触发垃圾收集以获取足够的连续空间分配给大对象。

`-XX:PretenureSizeThreshold`，大于此值的对象直接在老年代分配，避免在 Eden 区和 Survivor 区之间的大量内存复制。

#### 长期存活的对象进入老年代

为对象定义年龄计数器，对象在 Eden 出生并经过 Minor GC 依然存活，将移动到 Survivor 中，年龄就增加 1 岁，增加到一定年龄则移动到老年代中。

`-XX:MaxTenuringThreshold` 用来定义年龄的阈值。

#### 动态对象年龄判定

虚拟机并不是永远地要求对象的年龄必须达到 `MaxTenuringThreshold` 才能晋升老年代，如果在 Survivor 区中**相同年龄所有对象大小的总和大于 Survivor 空间的一半**，则**年龄大于或等于该年龄的对象可以直接进入老年代**，无需等到 `MaxTenuringThreshold` 中要求的年龄。

#### 空间分配担保

在发生 Minor GC 之前，虚拟机先检查老年代最大可用的连续空间是否大于年轻代所有对象总空间，如果条件成立的话，那么 Minor GC 可以确认是安全的；

如果不成立的话虚拟机会查看 `HandlePromotionFailure` 设置值是否允许担保失败，如果允许那么就会继续检查老年代最大可用的连续空间是否大于历次晋升到老年代对象的平均大小，如果大于，将尝试着进行一次 Minor GC，尽管这次 Minor GC 是有风险的；如果小于，或者 `HandlePromotionFailure` 设置不允许冒险，那这时也要改为进行一次 Full GC。

### Full GC 的触发条件

对于 Minor GC，其触发条件非常简单，当 Eden 区空间满时，就将触发一次 Minor GC。而 Full GC 则相对复杂，有以下条件：

#### 调用 `System.gc()`

此方法的调用是建议虚拟机进行 Full GC，虽然只是建议而非一定，但很多情况下它会触发 Full GC，从而增加 Full GC 的频率，也即增加了间歇性停顿的次数。因此强烈建议能不使用此方法就不要使用，让虚拟机自己去管理它的内存。可通过` -XX:DisableExplicitGC `来禁止 RMI 调用` System.gc()`。

#### 老年代空间不足

老年代空间不足的常见场景为前文所讲的大对象直接进入老年代、长期存活的对象进入老年代等，当执行 Full GC 后空间仍然不足，则抛出 `java.lang.OutOfMemoryError: Java heap space`。为避免以上原因引起的 Full GC，调优时应尽量做到让对象在 Minor GC 阶段被回收、让对象在年轻代多存活一段时间以及不要创建过大的对象及数组。

#### 方法区空间不足

JVM 规范中运行时数据区域中的方法区，在 HotSpot 虚拟机中又被习惯称为**永久代**，永久代中存放的是类的描述信息、常量、静态变量等数据，当系统中要加载的类、反射的类和调用的方法较多时，永久代可能会被占满，在未配置为采用 CMS GC 的情况下也会执行 Full GC。如果经过 Full GC 仍然回收不了，那么 JVM 会抛出` java.lang.OutOfMemoryError: PermGen space` 错误。为避免永久代占满造成 Full GC 现象，可采用的方法为增大 Perm Gen 空间或转为使用 CMS GC。

#### Minor GC 的平均晋升空间大小大于老年代可用空间

如果发现统计数据说之前 Minor GC 的平均晋升大小比目前老年代剩余的空间大，则不会触发 Minor GC 而是转为触发 Full GC。

#### 对象大小大于 To 区和老年代的可用内存

由 `Eden 区`、`From 区`向` To 区`复制时，对象大小大于 To 区可用内存，则把该对象转存到老年代，且老年代的可用内存小于该对象大小
