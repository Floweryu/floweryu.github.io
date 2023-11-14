const e=JSON.parse('{"key":"v-910762a6","path":"/middleware/sentinel/Sentinel%E5%9F%BA%E7%A1%80%E6%A6%82%E5%BF%B5.html","title":"Sentinel基础概念","lang":"zh-CN","frontmatter":{"title":"Sentinel基础概念","date":"2023-07-04T12:55:00.000Z","category":["Sentinel"],"tag":["后端","中间件"],"description":"流量控制 任意时间到来的请求往往是随机不可控的，而系统的处理能力是有限的。需要根据系统的处理能力对流量进行控制 image-20230702135042339 流量控制有下面几个角度： 资源的调用关系。比如：资源调用链路、资源和资源的关系。; 运行的指标。比如：QPS、线程池、系统负载。; 控制的效果。比如：直接限流、冷启动、排队。; 熔断降级 在资源...","head":[["meta",{"property":"og:url","content":"https://floweryu.top/middleware/sentinel/Sentinel%E5%9F%BA%E7%A1%80%E6%A6%82%E5%BF%B5.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"Sentinel基础概念"}],["meta",{"property":"og:description","content":"流量控制 任意时间到来的请求往往是随机不可控的，而系统的处理能力是有限的。需要根据系统的处理能力对流量进行控制 image-20230702135042339 流量控制有下面几个角度： 资源的调用关系。比如：资源调用链路、资源和资源的关系。; 运行的指标。比如：QPS、线程池、系统负载。; 控制的效果。比如：直接限流、冷启动、排队。; 熔断降级 在资源..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:47:27.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-07-04T12:55:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:47:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Sentinel基础概念\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-07-04T12:55:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:47:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://github.com/Floweryu/floweryu.github.io\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"流量控制","slug":"流量控制","link":"#流量控制","children":[]},{"level":2,"title":"熔断降级","slug":"熔断降级","link":"#熔断降级","children":[{"level":3,"title":"熔断降级设计理念","slug":"熔断降级设计理念","link":"#熔断降级设计理念","children":[]}]},{"level":2,"title":"系统负载保护","slug":"系统负载保护","link":"#系统负载保护","children":[]},{"level":2,"title":"Sentinel主流程","slug":"sentinel主流程","link":"#sentinel主流程","children":[]},{"level":2,"title":"Sentinal各个Slot功能","slug":"sentinal各个slot功能","link":"#sentinal各个slot功能","children":[{"level":3,"title":"NodeSelectorSlot","slug":"nodeselectorslot","link":"#nodeselectorslot","children":[]},{"level":3,"title":"ClusterBuilderSlot","slug":"clusterbuilderslot","link":"#clusterbuilderslot","children":[]},{"level":3,"title":"StatisticSlot","slug":"statisticslot","link":"#statisticslot","children":[]},{"level":3,"title":"FlowSlot","slug":"flowslot","link":"#flowslot","children":[]},{"level":3,"title":"DegradeSlot","slug":"degradeslot","link":"#degradeslot","children":[]},{"level":3,"title":"SystemSlot","slug":"systemslot","link":"#systemslot","children":[]},{"level":3,"title":"参考文档：","slug":"参考文档","link":"#参考文档","children":[]}]}],"git":{"createdTime":1699955247000,"updatedTime":1699955247000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":6.02,"words":1806},"filePathRelative":"middleware/sentinel/Sentinel基础概念.md","localizedDate":"2023年7月4日","autoDesc":true}');export{e as data};
