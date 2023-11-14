const e=JSON.parse('{"key":"v-169159f8","path":"/middleware/sentinel/Sentinel%E6%B5%81%E9%87%8F%E6%8E%A7%E5%88%B6.html","title":"Sentinel流量控制","lang":"zh-CN","frontmatter":{"title":"Sentinel流量控制","date":"2023-07-04T12:55:00.000Z","category":["Sentinel"],"tag":["后端","中间件"],"description":"概述 FlowSlot 会根据预设的规则，结合前面 NodeSelectorSlot、`ClusterNodeBuilderSlot、StatistcSlot 统计出来的实时信息进行流量控制。 限流的直接表现是在执行 Entry nodeA = SphU.entry(资源名字) 的时候抛出 FlowException 异常。FlowException ...","head":[["meta",{"property":"og:url","content":"https://floweryu.top/middleware/sentinel/Sentinel%E6%B5%81%E9%87%8F%E6%8E%A7%E5%88%B6.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"Sentinel流量控制"}],["meta",{"property":"og:description","content":"概述 FlowSlot 会根据预设的规则，结合前面 NodeSelectorSlot、`ClusterNodeBuilderSlot、StatistcSlot 统计出来的实时信息进行流量控制。 限流的直接表现是在执行 Entry nodeA = SphU.entry(资源名字) 的时候抛出 FlowException 异常。FlowException ..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:47:27.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-07-04T12:55:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:47:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Sentinel流量控制\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-07-04T12:55:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:47:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://github.com/Floweryu/floweryu.github.io\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"概述","slug":"概述","link":"#概述","children":[]},{"level":2,"title":"基于QPS/并发数的流量控制","slug":"基于qps-并发数的流量控制","link":"#基于qps-并发数的流量控制","children":[{"level":3,"title":"2.1 并发线程数流量控制","slug":"_2-1-并发线程数流量控制","link":"#_2-1-并发线程数流量控制","children":[]},{"level":3,"title":"2.2 QPS流量控制","slug":"_2-2-qps流量控制","link":"#_2-2-qps流量控制","children":[]}]},{"level":2,"title":"基于调用关系的流量控制","slug":"基于调用关系的流量控制","link":"#基于调用关系的流量控制","children":[{"level":3,"title":"3.1 根据调用方限流","slug":"_3-1-根据调用方限流","link":"#_3-1-根据调用方限流","children":[]},{"level":3,"title":"3.2 根据调用链路入口限流：链路限流","slug":"_3-2-根据调用链路入口限流-链路限流","link":"#_3-2-根据调用链路入口限流-链路限流","children":[]},{"level":3,"title":"3.3 具有关系的资源流量控制：关联流量控制","slug":"_3-3-具有关系的资源流量控制-关联流量控制","link":"#_3-3-具有关系的资源流量控制-关联流量控制","children":[]}]}],"git":{"createdTime":1699955247000,"updatedTime":1699955247000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":6.66,"words":1999},"filePathRelative":"middleware/sentinel/Sentinel流量控制.md","localizedDate":"2023年7月4日","autoDesc":true}');export{e as data};
