const e=JSON.parse('{"key":"v-39ebcda6","path":"/middleware/rocketmq/RocketMQ%E9%9D%A2%E8%AF%95%E9%A2%98.html","title":"RocketMQ面试题","lang":"zh-CN","frontmatter":{"title":"RocketMQ面试题","category":["RocketMQ"],"tag":["后端","中间件"],"date":"2023-10-30T22:00:00.000Z","description":"RocketMQ如何保证消费幂等？ 也可以理解为RocketMQ如何防止重复消费？ 消息幂等 当出现消费者对某条消息重复消费的情况时，重复消费的结果与消费一次的结果是相同，并且多次消费并未对业务系统产生任何负面影响，那么这个消费者的处理过程就是幂等的。 适用场景 1. 发送消息时重复 当一条消息已被成功发送到服务端并完成持久化，此时出现了网络闪断或者客...","head":[["meta",{"property":"og:url","content":"https://floweryu.top/middleware/rocketmq/RocketMQ%E9%9D%A2%E8%AF%95%E9%A2%98.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"RocketMQ面试题"}],["meta",{"property":"og:description","content":"RocketMQ如何保证消费幂等？ 也可以理解为RocketMQ如何防止重复消费？ 消息幂等 当出现消费者对某条消息重复消费的情况时，重复消费的结果与消费一次的结果是相同，并且多次消费并未对业务系统产生任何负面影响，那么这个消费者的处理过程就是幂等的。 适用场景 1. 发送消息时重复 当一条消息已被成功发送到服务端并完成持久化，此时出现了网络闪断或者客..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://floweryu.top/"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-15T02:39:03.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"RocketMQ面试题"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-10-30T22:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-15T02:39:03.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"RocketMQ面试题\\",\\"image\\":[\\"https://floweryu.top/\\"],\\"datePublished\\":\\"2023-10-30T22:00:00.000Z\\",\\"dateModified\\":\\"2023-11-15T02:39:03.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://github.com/Floweryu/floweryu.github.io\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"RocketMQ如何保证消费幂等？","slug":"rocketmq如何保证消费幂等","link":"#rocketmq如何保证消费幂等","children":[{"level":3,"title":"消息幂等","slug":"消息幂等","link":"#消息幂等","children":[]},{"level":3,"title":"适用场景","slug":"适用场景","link":"#适用场景","children":[]},{"level":3,"title":"处理方法","slug":"处理方法","link":"#处理方法","children":[]},{"level":3,"title":"参考：","slug":"参考","link":"#参考","children":[]}]},{"level":2,"title":"如何保证消息不丢失/可靠性？","slug":"如何保证消息不丢失-可靠性","link":"#如何保证消息不丢失-可靠性","children":[{"level":3,"title":"生产阶段","slug":"生产阶段","link":"#生产阶段","children":[]},{"level":3,"title":"存储阶段","slug":"存储阶段","link":"#存储阶段","children":[]},{"level":3,"title":"消费阶段","slug":"消费阶段","link":"#消费阶段","children":[]},{"level":3,"title":"参考","slug":"参考-1","link":"#参考-1","children":[]}]},{"level":2,"title":"如何处理消息积压？","slug":"如何处理消息积压","link":"#如何处理消息积压","children":[{"level":3,"title":"产生原因","slug":"产生原因","link":"#产生原因","children":[]},{"level":3,"title":"如何避免消息堆积？","slug":"如何避免消息堆积","link":"#如何避免消息堆积","children":[]},{"level":3,"title":"如何处理消息堆积？","slug":"如何处理消息堆积","link":"#如何处理消息堆积","children":[]},{"level":3,"title":"参考：","slug":"参考-2","link":"#参考-2","children":[]}]},{"level":2,"title":"如何实现顺序消息？","slug":"如何实现顺序消息","link":"#如何实现顺序消息","children":[{"level":3,"title":"局部顺序","slug":"局部顺序","link":"#局部顺序","children":[]},{"level":3,"title":"全局顺序","slug":"全局顺序","link":"#全局顺序","children":[]}]},{"level":2,"title":"如何实现消息过滤？","slug":"如何实现消息过滤","link":"#如何实现消息过滤","children":[{"level":3,"title":"Tag 标签过滤","slug":"tag-标签过滤","link":"#tag-标签过滤","children":[]},{"level":3,"title":"SQL 属性过滤","slug":"sql-属性过滤","link":"#sql-属性过滤","children":[]},{"level":3,"title":"参考","slug":"参考-3","link":"#参考-3","children":[]}]},{"level":2,"title":"延时消息","slug":"延时消息","link":"#延时消息","children":[{"level":3,"title":"功能原理","slug":"功能原理","link":"#功能原理","children":[]},{"level":3,"title":"使用限制","slug":"使用限制","link":"#使用限制","children":[]},{"level":3,"title":"参考","slug":"参考-4","link":"#参考-4","children":[]}]},{"level":2,"title":"死信队列","slug":"死信队列","link":"#死信队列","children":[{"level":3,"title":"背景","slug":"背景","link":"#背景","children":[]},{"level":3,"title":"特性","slug":"特性","link":"#特性","children":[]}]},{"level":2,"title":"如何保证高可用？","slug":"如何保证高可用","link":"#如何保证高可用","children":[{"level":3,"title":"NameServer 高可用","slug":"nameserver-高可用","link":"#nameserver-高可用","children":[]},{"level":3,"title":"BrokerServer 高可用","slug":"brokerserver-高可用","link":"#brokerserver-高可用","children":[]},{"level":3,"title":"Consumer 高可用","slug":"consumer-高可用","link":"#consumer-高可用","children":[]},{"level":3,"title":"Producer高可用","slug":"producer高可用","link":"#producer高可用","children":[]},{"level":3,"title":"参考：","slug":"参考-5","link":"#参考-5","children":[]}]},{"level":2,"title":"RocketMQ 整体工作流程","slug":"rocketmq-整体工作流程","link":"#rocketmq-整体工作流程","children":[]},{"level":2,"title":"RocketMQ为什么不使用Zookeeper作为注册中心？","slug":"rocketmq为什么不使用zookeeper作为注册中心","link":"#rocketmq为什么不使用zookeeper作为注册中心","children":[]},{"level":2,"title":"RocketMQ 如何对文件进行读写？","slug":"rocketmq-如何对文件进行读写","link":"#rocketmq-如何对文件进行读写","children":[]},{"level":2,"title":"RocketMQ 的负载均衡","slug":"rocketmq-的负载均衡","link":"#rocketmq-的负载均衡","children":[{"level":3,"title":"生产者负载均衡","slug":"生产者负载均衡","link":"#生产者负载均衡","children":[]},{"level":3,"title":"消费者负载均衡","slug":"消费者负载均衡","link":"#消费者负载均衡","children":[]},{"level":3,"title":"参考","slug":"参考-6","link":"#参考-6","children":[]}]},{"level":2,"title":"RocketMQ消息长轮询","slug":"rocketmq消息长轮询","link":"#rocketmq消息长轮询","children":[]}],"git":{"createdTime":1699955247000,"updatedTime":1700015943000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":2}]},"readingTime":{"minutes":29.32,"words":8796},"filePathRelative":"middleware/rocketmq/RocketMQ面试题.md","localizedDate":"2023年10月30日","autoDesc":true}');export{e as data};
