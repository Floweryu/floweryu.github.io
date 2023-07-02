\---

title: Sentinel基础概念

categories: [Sentinel]

tags: [后端]

\---

## 流量控制

> **任意时间到来的请求往往是随机不可控的，而系统的处理能力是有限的**。需要根据系统的处理能力对流量进行控制

![image-20230702135042339](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307021350271.png)

流量控制有下面几个角度：

- **资源的调用关系**。比如：资源调用链路、资源和资源的关系。
- **运行的指标**。比如：QPS、线程池、系统负载。
- **控制的效果**。比如：直接限流、冷启动、排队。

## 熔断降级

在资源调用过程中，如果某个资源出现了不稳定，最终会导致堆积发生。

![image-20230702135741629](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307022000526.png)

Sentinel 和 Hystrix 的原则是一致的：当调用链路中某个资源出现不稳定，例如，表现为 timeout，异常比例升高的时候。则对这个资源的调用进行限制，并让请求快速失败，避免影响到其它的资源，最终产生雪崩的效果。

### 熔断降级设计理念

在限制的手段上，Sentinel 和 Hystrix 采取了完全不一样的方法。

Hystrix 通过[线程池](https://github.com/Netflix/Hystrix/wiki/How-it-Works#benefits-of-thread-pools)的方式：

- 好处：资源和资源之间做到了最彻底的隔离。
- 缺点：除了增加了线程切换的成本，还需要预先给各个资源做线程池大小的分配。

Sentinel 对这个问题采取了两种手段：

1. **通过并发线程数进行限制**

这样不但没有线程切换的损耗，也不需要您预先分配线程池的大小。当某个资源出现不稳定的情况下，例如响应时间变长，对资源的直接影响就是会造成线程数的逐步堆积。**当线程数在特定资源上堆积到一定的数量之后，对该资源的新请求就会被拒绝**。堆积的线程完成任务后才开始继续接收请求。

2. **通过响应时间对资源进行降级**

除了对并发线程数进行控制以外，Sentinel 还可以通过响应时间来快速降级不稳定的资源。**当依赖的资源出现响应时间过长后，所有对该资源的访问都会被直接拒绝，直到过了指定的时间窗口之后才重新恢复**。

## 系统负载保护

Sentinel 同时提供[系统维度的自适应保护能力](https://sentinelguard.io/zh-cn/docs/system-adaptive-protection.html)。防止雪崩，是系统防护中重要的一环。当系统负载较高的时候，如果还持续让请求进入，可能会导致系统崩溃，无法响应。在集群环境下，网络负载均衡会把本应这台机器承载的流量转发到其它的机器上去。如果这个时候其它的机器也处在一个边缘状态的时候，这个增加的流量就会导致这台机器也崩溃，最后导致整个集群不可用。

## Sentinel主流程

在 Sentinel 里面，所有的资源都对应一个资源名称以及一个 Entry。Entry 可以通过对主流框架的适配自动创建，也可以通过注解的方式或调用 API 显式创建；每一个 Entry 创建的时候，同时也会创建一系列功能插槽（slot chain）。这些插槽有不同的职责，例如:、

- `NodeSelectorSlot` 负责收集资源的路径，并将这些资源的调用路径，以树状结构存储起来，用于根据调用路径来限流降级；
- `ClusterBuilderSlot` 则用于存储资源的统计信息以及调用者信息，例如该资源的 RT, QPS, thread count 等等，这些信息将用作为多维度限流，降级的依据；
- `StatisticSlot` 则用于记录、统计不同纬度的 runtime 指标监控信息；
- `FlowSlot` 则用于根据预设的限流规则以及前面 slot 统计的状态，来进行流量控制；
- `AuthoritySlot` 则根据配置的黑白名单和调用来源信息，来做黑白名单控制；
- `DegradeSlot` 则通过统计信息以及预设的规则，来做熔断降级；
- `SystemSlot` 则通过系统的状态，例如 load1 等，来控制总的入口流量；

总体的框架如下：

![image-20230702154412159](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307022001521.png)

Sentinel 将 `ProcessorSlot` 作为 SPI 接口进行扩展（1.7.2 版本以前 `SlotChainBuilder` 作为 SPI），使得 Slot Chain 具备了扩展的能力。您可以自行加入自定义的 slot 并编排 slot 间的顺序，从而可以给 Sentinel 添加自定义的功能。

![image-20230702154750154](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307022001747.png)

## Sentinal各个Slot功能

### NodeSelectorSlot

>  这个 slot 主要负责收集资源的路径，并将这些资源的调用路径，以树状结构存储起来，用于根据调用路径来限流降级。

使用下面代码可以创建一个demo：

```java
 ContextUtil.enter("entrance1", "appA");
  Entry nodeA = SphU.entry("nodeA");
  if (nodeA != null) {
    nodeA.exit();
  }
  ContextUtil.exit();

  ContextUtil.enter("entrance2", "appA");
  nodeA = SphU.entry("nodeA");
  if (nodeA != null) {
    nodeA.exit();
  }
  ContextUtil.exit();
```

![image-20230702160008744](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307022001547.png)

### ClusterBuilderSlot

> 此插槽用于构建资源的 `ClusterNode` 以及调用来源节点。`ClusterNode` 保持资源运行统计信息（响应时间、QPS、block 数目、线程数、异常数等）以及原始调用者统计信息列表。来源调用者的名字由 `ContextUtil.enter(contextName，origin)` 中的 `origin` 标记。

存储的信息示例如下：

```	bash
id: nodeA
idx origin  threadNum passedQps blockedQps totalQps aRt   1m-passed 1m-blocked 1m-total 
1   caller1 0         0         0          0        0     0         0          0        
2   caller2 0         0         0          0        0     0         0          0        
```



### StatisticSlot

> `StatisticSlot` 是 Sentinel 的核心功能插槽之一，用于统计实时的调用数据。

- `clusterNode`：资源唯一标识的 ClusterNode 的 runtime 统计
- `origin`：根据来自不同调用者的统计信息
- `defaultnode`: 根据上下文条目名称和资源 ID 的 runtime 统计
- 入口的统计

Sentinel 底层采用高性能的滑动窗口数据结构 `LeapArray` 来统计实时的秒级指标数据，可以很好地支撑写多于读的高并发场景。

![image-20230702160429033](https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307022001258.png)

### FlowSlot

这个 slot 主要根据预设的资源的统计信息，按照固定的次序，依次生效。如果一个资源对应两条或者多条流控规则，则会根据如下次序依次检验，直到全部通过或者有一个规则生效为止:

- 指定应用生效的规则，即针对调用方限流的；
- 调用方为 other 的规则；
- 调用方为 default 的规则。

### DegradeSlot

这个 slot 主要针对资源的平均响应时间（RT）以及异常比率，来决定资源是否在接下来的时间被自动熔断掉。

### SystemSlot

这个 slot 会根据对于当前系统的整体情况，对入口资源的调用进行动态调配。其原理是让入口的流量和当前系统的预计容量达到一个动态平衡。

注意系统规则只对入口流量起作用（调用类型为 `EntryType.IN`），对出口流量无效。可通过 `SphU.entry(res, entryType)` 指定调用类型，如果不指定，默认是`EntryType.OUT`。

### 参考文档：

- [核心类解析](https://github.com/alibaba/Sentinel/wiki/Sentinel-%E6%A0%B8%E5%BF%83%E7%B1%BB%E8%A7%A3%E6%9E%90)

  

