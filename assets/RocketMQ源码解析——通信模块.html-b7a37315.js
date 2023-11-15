const e=JSON.parse('{"key":"v-2e73ac33","path":"/rocketmq/RocketMQ%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E2%80%94%E2%80%94%E9%80%9A%E4%BF%A1%E6%A8%A1%E5%9D%97.html","title":"RocketMQ源码解析——通信模块","lang":"zh-CN","frontmatter":{"title":"RocketMQ源码解析——通信模块","category":["RocketMQ"],"tag":["后端","中间件"],"date":"2023-10-30T16:25:00.000Z","description":"基本通信流程 1. Broker启动后需要完成一次将自己注册至NameServer的操作；随后每隔30s时间定时向NameServer上报Topic路由信息。 2. 消息生产者Producer作为客户端发送消息时候，需要根据消息的Topic从本地缓存的TopicPublishInfoTable获取路由信息。如果没有则更新路由信息会从NameServer...","head":[["meta",{"property":"og:url","content":"https://floweryu.top/rocketmq/RocketMQ%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E2%80%94%E2%80%94%E9%80%9A%E4%BF%A1%E6%A8%A1%E5%9D%97.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"RocketMQ源码解析——通信模块"}],["meta",{"property":"og:description","content":"基本通信流程 1. Broker启动后需要完成一次将自己注册至NameServer的操作；随后每隔30s时间定时向NameServer上报Topic路由信息。 2. 消息生产者Producer作为客户端发送消息时候，需要根据消息的Topic从本地缓存的TopicPublishInfoTable获取路由信息。如果没有则更新路由信息会从NameServer..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-15T14:09:26.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-10-30T16:25:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-15T14:09:26.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"RocketMQ源码解析——通信模块\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-10-30T16:25:00.000Z\\",\\"dateModified\\":\\"2023-11-15T14:09:26.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://github.com/Floweryu/floweryu.github.io\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"基本通信流程","slug":"基本通信流程","link":"#基本通信流程","children":[]},{"level":2,"title":"Remoting通信类结构","slug":"remoting通信类结构","link":"#remoting通信类结构","children":[]}],"git":{"createdTime":1699954242000,"updatedTime":1700057366000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":2},{"name":"Floweryu","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":0.93,"words":280},"filePathRelative":"rocketmq/RocketMQ源码解析——通信模块.md","localizedDate":"2023年10月30日","autoDesc":true}');export{e as data};
