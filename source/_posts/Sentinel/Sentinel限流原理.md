---
title: Sentinel限流原理
categories: [Sentinel]
tags: [后端]
date: 2023-07-09 19:00:00
---

## SphU.entry 入口

从`SphU.entry()`方法向下执行，会进入到下面这个方法中：

```java
 private Entry entryWithPriority(ResourceWrapper resourceWrapper, int count, boolean prioritized, Object... args)
        throws BlockException {
        Context context = ContextUtil.getContext();
        if (context instanceof NullContext) {
            // The {@link NullContext} indicates that the amount of context has exceeded the threshold,
            // so here init the entry only. No rule checking will be done.
            return new CtEntry(resourceWrapper, null, context);
        }

        if (context == null) {
            // Using default context.
            context = InternalContextUtil.internalEnter(Constants.CONTEXT_DEFAULT_NAME);
        }

        // Global switch is close, no rule checking will do.
        // 1. 全局开关关闭，说明没有规则检查，直接返回一个CtEntry对象，不再进行后续的限流检测
        if (!Constants.ON) {
            return new CtEntry(resourceWrapper, null, context);
        }

        // 2. 根据包装过的资源获取对应的SlotChain
        ProcessorSlot<Object> chain = lookProcessChain(resourceWrapper);

        /*
         * Means amount of resources (slot chain) exceeds {@link Constants.MAX_SLOT_CHAIN_SIZE},
         * so no rule checking will be done.
         */
        if (chain == null) {
            return new CtEntry(resourceWrapper, null, context);
        }

        Entry e = new CtEntry(resourceWrapper, chain, context, count, args);
        try {
            // 3. 执行SlotChain的entry方法，如果SlotChain的entry方法抛出了BlockException，则将该异常继续向上抛出，如果SlotChain的entry方法正常执行了，则最后会将该entry对象返回
            chain.entry(context, resourceWrapper, null, count, prioritized, args);
        } catch (BlockException e1) {
            e.exit(count, args);
            // 4. 如果上层方法捕获了BlockException，则说明请求被限流了，否则请求能正常执行
            throw e1;
        } catch (Throwable e1) {
            // This should not happen, unless there are errors existing in Sentinel internal.
            RecordLog.info("Sentinel unexpected exception", e1);
        }
        return e;
    }
```

该方法主要实现了下面几点：

1. 全局开关关闭，说明没有规则检查，直接返回一个 CtEntry 对象，不再进行后续的限流检测。
2. 根据包装过的资源获取对应的 SlotChain。
3. 执行 SlotChain 的 entry 方法，如果 SlotChain 的 entry 方法抛出了 BlockException，则将该异常继续向上抛出，如果 SlotChain 的 entry 方法正常执行了，则最后会将该 entry 对象返回。
4. 如果上层方法捕获了 BlockException，则说明请求被限流了，否则请求能正常执行。

## SlotChain 的链路获取

重点关注一下**SlotChain**链路的获取逻辑。

```java
ProcessorSlot<Object> lookProcessChain(ResourceWrapper resourceWrapper) {
    // 这里使用两次判断为null(双重检查锁或缓存机制)的原因如下：
    // 假设有两个线程A，B同时到达第一个if，都为null，此时A线程进入synchronized
    // 遇到第二个if，当然还是null，A线程就会执行第二个if里面的语句，创建一个chain，然后存到缓存中，退出synchronized
    // B线程进入synchronized，获取chain，但此时缓存命中，就不用再执行第二个if里面的语句了，减少了synchronized锁的时间
    ProcessorSlotChain chain = chainMap.get(resourceWrapper);
    if (chain == null) {
        synchronized (LOCK) {
            chain = chainMap.get(resourceWrapper);
            if (chain == null) {
                // Entry size limit.
                if (chainMap.size() >= Constants.MAX_SLOT_CHAIN_SIZE) {
                    return null;
                }
				// 构造SlotChain
                chain = SlotChainProvider.newSlotChain();

               	// map扩容
                Map<ResourceWrapper, ProcessorSlotChain> newMap = new HashMap<ResourceWrapper, ProcessorSlotChain>(
                    chainMap.size() + 1);
                newMap.putAll(chainMap);
                // 将资源和slot-chain映射
                newMap.put(resourceWrapper, chain);
                chainMap = newMap;
            }
        }
    }
    return chain;
}

public static ProcessorSlotChain newSlotChain() {
    if (slotChainBuilder != null) {
        return slotChainBuilder.build();
    }

    // Resolve the slot chain builder SPI.
    // 从com.alibaba.csp.sentinel.slotchain.ProcessorSlot文件中读取slot构建slot chain
    slotChainBuilder = SpiLoader.of(SlotChainBuilder.class).loadFirstInstanceOrDefault();

    // 确保slotChainBuilder不为null
    if (slotChainBuilder == null) {
        // Should not go through here.
        RecordLog.warn("[SlotChainProvider] Wrong state when resolving slot chain builder, using default");
        slotChainBuilder = new DefaultSlotChainBuilder();
    } else {
        RecordLog.info("[SlotChainProvider] Global slot chain builder resolved: {}",
                       slotChainBuilder.getClass().getCanonicalName());
    }
    return slotChainBuilder.build();
}


public class DefaultSlotChainBuilder implements SlotChainBuilder {

    @Override
    public ProcessorSlotChain build() {
        ProcessorSlotChain chain = new DefaultProcessorSlotChain();

        List<ProcessorSlot> sortedSlotList = SpiLoader.of(ProcessorSlot.class).loadInstanceListSorted();
        for (ProcessorSlot slot : sortedSlotList) {
            if (!(slot instanceof AbstractLinkedProcessorSlot)) {
                RecordLog.warn("The ProcessorSlot(" + slot.getClass().getCanonicalName() + ") is not an instance of AbstractLinkedProcessorSlot, can't be added into ProcessorSlotChain");
                continue;
            }

            chain.addLast((AbstractLinkedProcessorSlot<?>) slot);
        }

        return chain;
    }
}
```

在 Sentinel 里面，所有的资源都对应一个资源名称（`resourceName`），每次资源调用都会创建一个 `Entry` 对象。Entry 可以通过对主流框架的适配自动创建，也可以通过注解的方式或调用 `SphU` API 显式创建。Entry 创建的时候，同时也会创建一系列功能插槽（slot chain），这些插槽有不同的职责，例如:

- **`NodeSelectorSlot`**：收集资源的路径，并将这些资源的调用路径，以树状结构存储起来，用于根据调用路径来限流降级。
- **`ClusterBuilderSlot`** ：用于存储资源的统计信息以及调用者信息，例如该资源的 RT, QPS, thread count 等等，这些信息将用作为多维度限流，降级的依据；
- **`StatisticSlot`** ：用于记录、统计不同纬度的 runtime 指标监控信息；
- **`SystemSlot`** ：通过系统的状态，来控制总的入口流量；
- **`AuthoritySlot`** ：根据配置的黑白名单和调用来源信息，来做黑白名单控制；
- **`FlowSlot`** ：用于根据预设的限流规则以及前面 slot 统计的状态，来进行流量控制；
- **`DegradeSlot`** ：通过统计信息以及预设的规则，来做熔断降级；

下面借用官网的图片：官方链接如下：https://sentinelguard.io/zh-cn/docs/basic-implementation.html

![image-20220801191458948](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307091906761.png)

上面 slot 的排序规则根据下面代码：

```java
Collections.sort(sortedClassList, new Comparator<Class<? extends S>>() {
    @Override
    public int compare(Class<? extends S> o1, Class<? extends S> o2) {
        Spi spi1 = o1.getAnnotation(Spi.class);
        int order1 = spi1 == null ? 0 : spi1.order();

        Spi spi2 = o2.getAnnotation(Spi.class);
        int order2 = spi2 == null ? 0 : spi2.order();

        return Integer.compare(order1, order2);
    }
});
```

其中`spi2.order()`是`@Spi`注解定义的，每个 slot 的顺序如下，

```java
public static final int ORDER_NODE_SELECTOR_SLOT = -10000;
public static final int ORDER_CLUSTER_BUILDER_SLOT = -9000;
public static final int ORDER_LOG_SLOT = -8000;
public static final int ORDER_STATISTIC_SLOT = -7000;
public static final int ORDER_AUTHORITY_SLOT = -6000;
public static final int ORDER_SYSTEM_SLOT = -5000;
public static final int ORDER_FLOW_SLOT = -2000;
public static final int ORDER_DEFAULT_CIRCUIT_BREAKER_SLOT = -1500;
public static final int ORDER_DEGRADE_SLOT = -1000;
```

整个调用链中最核心的就是 **`StatisticSlot`(**用于记录、统计不同纬度的 runtime 指标监控信息) 以及**`FlowSlot`(**根据预设的限流规则以及前面 slot 统计的状态，来进行流量控制）

可以查看**`DefaultProcessorSlotChain.java`**类的源码：

```java
public class DefaultProcessorSlotChain extends ProcessorSlotChain {

    // 先创建头结点
    AbstractLinkedProcessorSlot<?> first = new AbstractLinkedProcessorSlot<Object>() {

        @Override
        public void entry(Context context, ResourceWrapper resourceWrapper, Object t, int count, boolean prioritized, Object... args)
            throws Throwable {
            super.fireEntry(context, resourceWrapper, t, count, prioritized, args);
        }

        @Override
        public void exit(Context context, ResourceWrapper resourceWrapper, int count, Object... args) {
            super.fireExit(context, resourceWrapper, count, args);
        }

    };
    // 创建尾结点，直接指向头结点
    AbstractLinkedProcessorSlot<?> end = first;
    ....

}
```

可以看出**ProcessorSlotChain**是一个链表，里面有两个**AbstractLinkedProcessorSlot**类型的链表：first 和 end，即链表的头结点和尾结点。

![image-20220801191557361](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307091906376.png)

然后添加通过`addLast`方法添加节点

```java
@Override
public void addLast(AbstractLinkedProcessorSlot<?> protocolProcessor) {
    end.setNext(protocolProcessor);	// 由于end=first，所以是在first.next下面添加节点
    end = protocolProcessor;	// 然后调整end的指针指向新节点
}

// AbstractLinkedProcessorSlot抽象类中的方法
public void setNext(AbstractLinkedProcessorSlot<?> next) {
    this.next = next;
}
```

![image-20220801191607238](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307091906704.png)

然后依次类推，可以得到下面的链路 SlotChain：

![image-20220801191620840](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307091906079.png)

## SlotChain 的链路执行

`lookProcessChain`方法获得的第一个`ProcessorSlotChain`的实例是`DefaultProcessorSlotChain`，那么执行 chain.entry 方法，就会执行`DefaultProcessorSlotChain`的`entry`方法：

```java
public void entry(Context context, ResourceWrapper resourceWrapper, Object t, int count, boolean prioritized, Object... args)
    throws Throwable {
    // 触发下一个slot
    first.transformEntry(context, resourceWrapper, t, count, prioritized, args);
}
```

接着调用父类`AbstractLinkedProcessorSlot `的`transformEntry`方法：

```java
// 触发下一个节点entry逻辑
public void fireEntry(Context context, ResourceWrapper resourceWrapper, Object obj, int count, boolean prioritized, Object... args)
    throws Throwable {
    if (next != null) {
        next.transformEntry(context, resourceWrapper, obj, count, prioritized, args);
    }
}

void transformEntry(Context context, ResourceWrapper resourceWrapper, Object o, int count, boolean prioritized, Object... args)
    throws Throwable {
    T t = (T)o;
    // 触发节点entry逻辑
    entry(context, resourceWrapper, t, count, prioritized, args);
}
```

跟着代码`debug`可以知道，上面代码会触发第一个 slot 节点，也就是`NodeSelectorSlot`。这里先不介绍这个 slot 的具体逻辑。

## Slot 中的 entry 逻辑

### 滑动窗口限流原理

#### 从 StatisticSlot 中的 entry 进入

`StaticSlot`主要是统计指标数据，用来给`FlowSlot`进行校验。

```java
public void entry(Context context, ResourceWrapper resourceWrapper, DefaultNode node, int count, boolean prioritized, Object... args) throws Throwable {
        Iterator var8;
        ProcessorSlotEntryCallback handler;
        try {
			// Do some checking.
            // 1. 做一些检查，执行AuthoritySlot、SystemSlot、FlowSlot、DefaultCircuitBreakerSlot方法
            // 如果规则不通过，就会抛出BlockException异常。反之，会在node中统计通过的请求数和线程数等信息。
            this.fireEntry(context, resourceWrapper, node, count, prioritized, args);
            // 执行到这里表示通过了检查，没有被限流
            node.increaseThreadNum();
            // 2. 记录通过规则的请求
            node.addPassRequest(count);
            if (context.getCurEntry().getOriginNode() != null) {
                context.getCurEntry().getOriginNode().increaseThreadNum();
                context.getCurEntry().getOriginNode().addPassRequest(count);
            }

            if (resourceWrapper.getEntryType() == EntryType.IN) {
                Constants.ENTRY_NODE.increaseThreadNum();
                Constants.ENTRY_NODE.addPassRequest(count);
            }

            Iterator var13 = StatisticSlotCallbackRegistry.getEntryCallbacks().iterator();

            while(var13.hasNext()) {
                ProcessorSlotEntryCallback<DefaultNode> handler = (ProcessorSlotEntryCallback)var13.next();
                handler.onPass(context, resourceWrapper, node, count, args);
            }
        } catch (PriorityWaitException var10) {
            node.increaseThreadNum();
            if (context.getCurEntry().getOriginNode() != null) {
                context.getCurEntry().getOriginNode().increaseThreadNum();
            }

            if (resourceWrapper.getEntryType() == EntryType.IN) {
                Constants.ENTRY_NODE.increaseThreadNum();
            }

            var8 = StatisticSlotCallbackRegistry.getEntryCallbacks().iterator();

            while(var8.hasNext()) {
                handler = (ProcessorSlotEntryCallback)var8.next();
                handler.onPass(context, resourceWrapper, node, count, args);
            }
        } catch (BlockException var11) {
            BlockException e = var11;
            context.getCurEntry().setBlockError(var11);
            node.increaseBlockQps(count);
            if (context.getCurEntry().getOriginNode() != null) {
                context.getCurEntry().getOriginNode().increaseBlockQps(count);
            }

            if (resourceWrapper.getEntryType() == EntryType.IN) {
                Constants.ENTRY_NODE.increaseBlockQps(count);
            }

            var8 = StatisticSlotCallbackRegistry.getEntryCallbacks().iterator();

            while(var8.hasNext()) {
                handler = (ProcessorSlotEntryCallback)var8.next();
                handler.onBlocked(e, context, resourceWrapper, node, count, args);
            }

            throw e;
        } catch (Throwable var12) {
            context.getCurEntry().setError(var12);
            throw var12;
        }

    }
```

`node.addPassRequest`方法是在`fireEntry`执行后才执行的，也就是说，当前请求通过了 sentinel 的流控规则，此时需要将当次请求记录下来，也就是执行`addPassRequest`方法：

```java
public void addPassRequest(int count) {
    super.addPassRequest(count);
    this.clusterNode.addPassRequest(count);
}
```

上面方法在`DefaultNode`对象中。

- `DefaultNode`：保存着某个 resource 在某个 context 中的实时指标，每个 DefaultNode 都指向一个 ClusterNode
- `ClusterNode`：保存着某个 resource 在所有 context 中实时指标的总和，同样的 resource 会共享同一个 ClusterNode，不管他在哪个 context 中

在`StatisticNode`类中对`ArrayMetric`进行了初始化：

```java
this.rollingCounterInSecond = new ArrayMetric(SampleCountProperty.SAMPLE_COUNT, IntervalProperty.INTERVAL);
this.rollingCounterInMinute = new ArrayMetric(60, 60000, false);
public void addPassRequest(int count) {
    this.rollingCounterInSecond.addPass(count);
    this.rollingCounterInMinute.addPass(count);
}
```

增加指标用的 addPass 方法是一个`ArrayMetric`的类：

```java
private final LeapArray<MetricBucket> data;

// SAMPLE_COUNT=2  INTERVAL=1000 上面传递的静态变量
public ArrayMetric(int sampleCount, int intervalInMs) {
    this.data = new OccupiableBucketLeapArray(sampleCount, intervalInMs);
}
public void addPass(int count) {
    WindowWrap<MetricBucket> wrap = this.data.currentWindow();
    ((MetricBucket)wrap.value()).addPass(count);
}
```

这里就跟窗口有关系了，这里使用`data`来获取当前窗口，窗口大小为 2。data 的类型是`MetricBucket`对象，用来保存各项指标，变量如下：

```java
private final LongAdder[] counters;
private volatile long minRt;
```

`WindowWrap`对象的变量如下：

```java
// 时间窗口的长度
private final long windowLengthInMs;
// 时间窗口的开始时间，单位是毫秒
private long windowStart;
//时间窗口的内容，在 WindowWrap 中是用泛型表示这个值的，但实际上就是 MetricBucket 类, 参考上面代码
private T value;
```

`LeapArray`对象如下：

```java
public abstract class LeapArray<T> {
    // 时间窗口的长度
    protected int windowLengthInMs;
    // 采样窗口的个数
    protected int sampleCount;
    // 以毫秒为单位的时间间隔
    protected int intervalInMs;
    private double intervalInSecond;
    // 采样的时间窗口数组
    protected final AtomicReferenceArray<WindowWrap<T>> array;
    private final ReentrantLock updateLock = new ReentrantLock();

    public LeapArray(int sampleCount, int intervalInMs) {
        AssertUtil.isTrue(sampleCount > 0, "bucket count is invalid: " + sampleCount);
        AssertUtil.isTrue(intervalInMs > 0, "total time interval of the sliding window should be positive");
        AssertUtil.isTrue(intervalInMs % sampleCount == 0, "time span needs to be evenly divided");
        this.windowLengthInMs = intervalInMs / sampleCount;
        this.intervalInMs = intervalInMs;
        this.intervalInSecond = (double)intervalInMs / 1000.0D;
        // 时间窗口的采样个数，默认为2个采样窗口
        this.sampleCount = sampleCount;
        this.array = new AtomicReferenceArray(sampleCount);
    }
}
```

在`LeapArray`中创建了一个`AtomicReferenceArray`数组，用来对时间窗口中的统计值进行采样。通过采样的统计值计算出平均值，即最终的实时指标的值。

重点是`this.data.currentWindow();`方法

```java
private int calculateTimeIdx(/*@Valid*/ long timeMillis) {
    // 获取时间窗口个数
    long timeId = timeMillis / windowLengthInMs;
    // Calculate current index so we can map the timestamp to the leap array.
    // 获取当前时间在实际窗口array数组中的索引
    return (int)(timeId % array.length());
}

protected long calculateWindowStart(/*@Valid*/ long timeMillis) {
    // 获取时间窗口的起始时间。如下：
    // 时间点：0    1    2   3   4   5   6
    // 时间窗口windowLengthInMs为：2
    // 当前时间为timeMillis为：5
    // 当前时间所在的窗口起始时间= 5 - 5 % 2 = 4
    // timeMillis % windowLengthInMs = 当前时间在当前时间窗口已经跑过的距离
    return timeMillis - timeMillis % windowLengthInMs;
}

// 传进来的是当前时间
public WindowWrap<T> currentWindow(long timeMillis) {
        if (timeMillis < 0) {
            return null;
        }
		// 时间窗口个数对2（假如默认值）取模
        int idx = calculateTimeIdx(timeMillis);
        // Calculate current bucket start time.
    	// 时间窗口的起始时间
        long windowStart = calculateWindowStart(timeMillis);

        /*
         * Get bucket item at given time from the array.
         *
         * (1) Bucket is absent, then just create a new bucket and CAS update to circular array.
         * (2) Bucket is up-to-date, then just return the bucket.
         * (3) Bucket is deprecated, then reset current bucket and clean all deprecated buckets.
         */
        while (true) {
            // 根据索引获取缓存的时间窗口
            WindowWrap<T> old = array.get(idx);
           	// 这里如果没有从缓存中取到，就会创建一个新的时间窗口，所以array的长度不能太大，不然不容易命中
            if (old == null) {
                /*
                 *     B0       B1      B2    NULL      B4
                 * ||_______|_______|_______|_______|_______||___
                 * 200     400     600     800     1000    1200  timestamp
                 *                             ^
                 *                          time=888
                 *            bucket is empty, so create new and update
                 *
                 * If the old bucket is absent, then we create a new bucket at {@code windowStart},
                 * then try to update circular array via a CAS operation. Only one thread can
                 * succeed to update, while other threads yield its time slice.
                 */
                // (1) 没取到缓存，则创建一个新的时间窗口
                WindowWrap<T> window = new WindowWrap<T>(windowLengthInMs, windowStart, newEmptyBucket(timeMillis));
                // 通过CAS将新创建的窗口置换到缓存数组中去
                if (array.compareAndSet(idx, null, window)) {
                    // 设置成功就返回该窗口
                    return window;
                } else {
                    // 否则当前线程让出时间片，等待
                    Thread.yield();
                }
            // (2) 如果当前窗口的开始时间与old的开始时间相等，则直接返回old窗口
            } else if (windowStart == old.windowStart()) {
                /*
                 *     B0       B1      B2     B3      B4
                 * ||_______|_______|_______|_______|_______||___
                 * 200     400     600     800     1000    1200  timestamp
                 *                             ^
                 *                          time=888
                 *            startTime of Bucket 3: 800, so it's up-to-date
                 *
                 * If current {@code windowStart} is equal to the start timestamp of old bucket,
                 * that means the time is within the bucket, so directly return the bucket.
                 */
                return old;
            // 如果当前时间窗口的开始时间已经超过了old窗口的开始时间，则放弃old窗口
            // 并将time设置为新的时间窗口的开始时间，此时窗口向前滑动
            } else if (windowStart > old.windowStart()) {
                /*
                 *   (old)
                 *             B0       B1      B2    NULL      B4
                 * |_______||_______|_______|_______|_______|_______||___
                 * ...    1200     1400    1600    1800    2000    2200  timestamp
                 *                              ^
                 *                           time=1676
                 *          startTime of Bucket 2: 400, deprecated, should be reset
                 *
                 * If the start timestamp of old bucket is behind provided time, that means
                 * the bucket is deprecated. We have to reset the bucket to current {@code windowStart}.
                 * Note that the reset and clean-up operations are hard to be atomic,
                 * so we need a update lock to guarantee the correctness of bucket update.
                 *
                 * The update lock is conditional (tiny scope) and will take effect only when
                 * bucket is deprecated, so in most cases it won't lead to performance loss.
                 */
                if (updateLock.tryLock()) {
                    try {
                        // (3) Successfully get the update lock, now we reset the bucket.
                        return resetWindowTo(old, windowStart);
                    } finally {
                        updateLock.unlock();
                    }
                } else {
                    // Contention failed, the thread will yield its time slice to wait for bucket available.
                    Thread.yield();
                }
            } else if (windowStart < old.windowStart()) {
                // Should not go through here, as the provided time is already behind.
                return new WindowWrap<T>(windowLengthInMs, windowStart, newEmptyBucket(timeMillis));
            }
        }
    }
```

上面代码实际可以分成以下几步：

1. 根据当前时间，算出该时间的 timeId，并根据 timeId 算出当前窗口在采样窗口数组中的索引 idx。
2. 根据当前时间算出当前窗口的应该对应的开始时间 time，以毫秒为单位。
3. 根据索引 idx，在采样窗口数组中取得一个时间窗口。
4. 循环判断直到获取到一个当前时间窗口 old 。
   1. 如果 old 为空，则创建一个时间窗口，并将它插入到 array 的第 idx 个位置，array 上面已经分析过了，是一个 AtomicReferenceArray。
   2. 如果当前窗口的开始时间 time 与 old 的开始时间相等，那么说明 old 就是当前时间窗口，直接返回 old。
   3. 如果当前窗口的开始时间 time 大于 old 的开始时间，则说明 old 窗口已经过时了，将 old 的开始时间更新为最新值：time，进入下一次得循环再判断当前窗口的开始时间 time 与 old 的开始时间相等的时候返回。
   4. 如果当前窗口的开始时间 time 小于 old 的开始时间，实际上这种情况是不可能存在的，因为 time 是当前时间，old 是过去的一个时间。

**timeId（即时间窗口的个数）是会随着时间的增长而增加，当前时间每增长一个 windowLength 的长度，timeId 就加 1。但是 idx 不会增长，只会在 0 和 1 之间变换，因为 array 数组的长度是 2，只有两个采样时间窗口。**

为什么默认只有两个采样窗口？可能是因为时间窗口中保存着很多统计数据，如果时间窗口过多的话，一方面会占用过多内存，另一方面时间窗口过多就意味着时间窗口的长度会变小，如果时间窗口长度变小，就会导致时间窗口过于频繁的滑动。

**下面看看 currentWindow 代码逻辑**：

根据当前时间除于 `windowLength `得到一个 timeId，再用 timeId 跟取样窗口的长度进行一个取模，那么值一定会落在 0，1 两个位置的其中一个。然后根据当前时间算出当前窗口的应该对应的开始时间 time。由于刚刚开始的时候 array 是空的，那么获取到的 old 应当是 null，那么会创建一个新的实例，用图看一下初始化的 LeapArray：

![image-20230709184837045](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307091850289.png)

当 old 获取到的是 null，那么初始的时候 arrays 数组中只有一个窗口（可能是第一个(idx=0)，也可能是第二个(idx=1)），每个时间窗口的长度是 500ms，这就意味着只要当前时间与时间窗口的差值在 500ms 之内，时间窗口就不会向前滑动。例如，假如当前时间走到 300 或者 500 时，当前时间窗口仍然是相同的那个：

![image-20230709185358381](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307091854811.png)

时间继续往前走，当超过 500ms 时，时间窗口就会向前滑动到下一个，这时就会更新当前窗口的开始时间,时间继续往前走，只要不超过 1000ms，则当前窗口不会发生变化，其中代码实现是 resetWindowTo 方法：

![image-20230709185704628](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307091857034.png)

```java
protected WindowWrap<MetricBucket> resetWindowTo(WindowWrap<MetricBucket> w, long time) {
    // Update the start time and reset value.
    w.resetTo(time);
    MetricBucket borrowBucket = borrowArray.getWindowValue(time);
    if (borrowBucket != null) {
        w.value().reset();
        w.value().addPass((int)borrowBucket.pass());
    } else {
        w.value().reset();
    }

    return w;
}
```

当时间继续往前走，当前时间超过 1000ms 时，就会再次进入下一个时间窗口，此时 arrays 数组中的窗口将会有一个失效，会有另一个新的窗口进行替换：

![image-20220814153836045](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307091906190.png)

这样，在当前时间点中进入的请求，会被统计到当前时间对应的窗口中：

```java
public void addPass(int count) {
    WindowWrap<MetricBucket> wrap = data.currentWindow();
    wrap.value().addPass(count);
}
```

获得窗口后，会执行下面语句，增加当前窗口通过的请求数 QPS。这里的`wrap.value()`得到的是`MetricBucket`，在 Sentinel 中 QPS 相关数据的统计结果就维护在这个类中`LongAddr[]`中，最终由这个指标来与我们设置好的规则进行匹配，查看是否限流，也就是`StatisticSlot`的 entry 方法中的`fireEntry`，都要先进入到`FlowSlot`的`entry`方法进行限流过滤：

```java
public void entry(Context context, ResourceWrapper resourceWrapper, DefaultNode node, int count,
                  boolean prioritized, Object... args) throws Throwable {
    // 在此方法里面进行限流规则检查
    checkFlow(resourceWrapper, context, node, count, prioritized);

    fireEntry(context, resourceWrapper, node, count, prioritized, args);
}
```

在`FlowRuleChecker`类中，循环规则匹配资源进行限流过滤。

```java
public void checkFlow(Function<String, Collection<FlowRule>> ruleProvider, ResourceWrapper resource,
                      Context context, DefaultNode node, int count, boolean prioritized) throws BlockException {
    if (ruleProvider == null || resource == null) {
        return;
    }
    Collection<FlowRule> rules = ruleProvider.apply(resource.getName());
    if (rules != null) {
        for (FlowRule rule : rules) {
            if (!canPassCheck(rule, context, node, count, prioritized)) {
                throw new FlowException(rule.getLimitApp(), rule);
            }
        }
    }
}
```

## 参考文章

- https://www.cnblogs.com/wuzhenzhao/p/11453649.html
