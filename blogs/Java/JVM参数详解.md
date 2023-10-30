---
title: JVM参数详解
categories: [Java]
tags: [后端, JVM]
date: 2023-10-22 13:00:00
---

## -XX:+UseConcMarkSweepGC

打开此开关后，使用 **CMS + ParNew + Serial Old** 收集器组合来进行内存回收。

**并发标记清除收集器是以获取最短停顿时间为目标。**

开启后，年轻代使用 ParNew 收集器；老年代使用 CMS 收集器，如果 CMS 产生的碎片过多，导致无法存放浮动垃圾，JVM 会出现 Concurrent Mode Failure ，此时使用 Serial Old 收集器来替代 CMS 收集器清理碎片。

## -XX:+UseAdaptiveSizePolicy

JDK 1.8 默认使用 UseParallelGC 垃圾回收器，该垃圾回收器默认启动了 AdaptiveSizePolicy，会根据GC的情况自动计算计算 Eden、From 和 To 区的大小。

**注意事项：**

1. 在 JDK 1.8 中，如果使用 CMS，无论 UseAdaptiveSizePolicy 如何设置，都会将 UseAdaptiveSizePolicy 设置为 false
2. 由于AdaptiveSizePolicy会动态调整 Eden、Survivor 的大小，有些情况存在Survivor 被自动调为很小，比如十几MB甚至几MB的可能，这个时候YGC回收掉 Eden区后，还存活的对象进入Survivor 装不下，就会直接晋升到老年代，导致老年代占用空间逐渐增加，从而触发FULL GC，如果一次FULL GC的耗时很长（比如到达几百毫秒），那么在要求高响应的系统就是不可取的。

**对于面向外部的大流量、低延迟系统，不建议启用此参数，建议关闭该参数**。

## -XX:+CMSClassUnloadingEnabled

表示开启 CMS 对永久代的垃圾回收（或元空间），避免由于永久代空间耗尽带来 Full GC。

## -XX:+UseCMSCompactAtFullCollection

控制 **Full GC** 的过程中是否进行空间的整理（默认开启，注意是Full GC，不是普通CMS GC）。

> 和`-XX: CMSFullGCsBeforeCompaction=n` 配合使用

## -XX: CMSFullGCsBeforeCompaction=n

控制多少次 Full GC 后进行一次压缩。

## -XX:+DisableExplicitGC

禁止代码中显示调用GC。

## -XX:CMSMaxAbortablePrecleanTime

控制CMS垃圾回收的**abortable preclean阶段**结束时间。默认值5s。

####  CMS垃圾回收的6个重要阶段

1. **initial-mark 初始标记**（CMS的第一个STW阶段）：标记GC Root直接引用的对象，GC Root直接引用的对象不多，所以很快。
2. **concurrent-mark 并发标记阶段**：由第一阶段标记过的对象出发，所有可达的对象都在本阶段标记。
3. **concurrent-preclean 并发预清理阶段**，也是一个并发执行的阶段。在本阶段，会查找前一阶段执行过程中,从新生代晋升或新分配或被更新的对象。通过并发地重新扫描这些对象，预清理阶段可以减少下一个stop-the-world 重新标记阶段的工作量。
4. **concurrent-abortable-preclean 并发可中止的预清理阶段**：这个阶段其实跟上一个阶段做的东西一样，也是为了减少下一个STW重新标记阶段的工作量。增加这一阶段是为了让我们可以控制这个阶段的结束时机，比如扫描多长时间（默认5秒）或者Eden区使用占比达到期望比例（默认50%）就结束本阶段
5. **remark 重标记阶段**（CMS的第二个STW阶段），暂停所有用户线程，从GC Root开始重新扫描整堆，标记存活的对象。需要注意的是，虽然CMS只回收老年代的垃圾对象，但是这个阶段依然需要扫描新生代，因为很多GC Root都在新生代，而这些GC Root指向的对象又在老年代，这称为“跨代引用”。
6. **concurrent-sweep ，并发清理**。

## -XX:+HeapDumpOnOutOfMemoryError

当JVM发生OOM时，自动生成DUMP文件。

## -XX:+PrintGCDetails

打印输出详细的GC收集日志的信息。

> Heap
>  PSYoungGen      total 6144K, used 2058K [0x00000000ff980000, 0x0000000100000000, 0x0000000100000000)
>   eden space 5632K, 36% used [0x00000000ff980000,0x00000000ffb82950,0x00000000fff00000)
>   from space 512K, 0% used [0x00000000fff80000,0x00000000fff80000,0x0000000100000000)
>   to   space 512K, 0% used [0x00000000fff00000,0x00000000fff00000,0x00000000fff80000)
>  ParOldGen       total 13824K, used 0K [0x00000000fec00000, 0x00000000ff980000, 0x00000000ff980000)
>   object space 13824K, 0% used [0x00000000fec00000,0x00000000fec00000,0x00000000ff980000)
>  Metaspace       used 3032K, capacity 4494K, committed 4864K, reserved 1056768K
>   class space    used 330K, capacity 386K, committed 512K, reserved 1048576K

## -XX:+PrintGCDateStamps

格式化GC日志输出时间。

## -XX:CMSInitiatingOccupancyFraction=70

在使用CMS收集器的情况下，老年代使用达到指定阈值的内存时，触发FullGC.。

## -XX:+UseCMSInitiatingOccupancyOnly

指定用设定的回收阈值(-XX:CMSInitiatingOccupancyFraction参数的值)，如果不指定，JVM仅在第一次使用设定值，后续则会根据运行时采集的数据做自动调整。如果指定了该参数，那么每次JVM都会在到达规定设定值时才进行GC。

