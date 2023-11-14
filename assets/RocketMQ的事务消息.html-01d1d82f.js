const e=JSON.parse('{"key":"v-6a63aedc","path":"/middleware/rocketmq/RocketMQ%E7%9A%84%E4%BA%8B%E5%8A%A1%E6%B6%88%E6%81%AF.html","title":"RocketMQ的事务消息","lang":"zh-CN","frontmatter":{"title":"RocketMQ的事务消息","date":"2023-10-30T16:25:00.000Z","category":["RocketMQ"],"tag":["后端","中间件"],"description":"1. 使用场景 在淘宝购物车下单时，涉及到购物车系统和交易系统，这两个系统之间的数据最终一致性可以通过分布式事务消息的异步处理实现。在这种场景下，交易系统是最为核心的系统，需要最大限度地保证下单成功。而购物车系统只需要订阅消息队列RocketMQ版的交易订单消息，做相应的业务处理，即可保证最终的数据一致性。 2. 执行流程 img 事务消息发送步骤如下...","head":[["meta",{"property":"og:url","content":"https://floweryu.top/middleware/rocketmq/RocketMQ%E7%9A%84%E4%BA%8B%E5%8A%A1%E6%B6%88%E6%81%AF.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"RocketMQ的事务消息"}],["meta",{"property":"og:description","content":"1. 使用场景 在淘宝购物车下单时，涉及到购物车系统和交易系统，这两个系统之间的数据最终一致性可以通过分布式事务消息的异步处理实现。在这种场景下，交易系统是最为核心的系统，需要最大限度地保证下单成功。而购物车系统只需要订阅消息队列RocketMQ版的交易订单消息，做相应的业务处理，即可保证最终的数据一致性。 2. 执行流程 img 事务消息发送步骤如下..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://floweryu.top/"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:47:27.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"RocketMQ的事务消息"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-10-30T16:25:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:47:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"RocketMQ的事务消息\\",\\"image\\":[\\"https://floweryu.top/\\"],\\"datePublished\\":\\"2023-10-30T16:25:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:47:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://github.com/Floweryu/floweryu.github.io\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"1. 使用场景","slug":"_1-使用场景","link":"#_1-使用场景","children":[]},{"level":2,"title":"2. 执行流程","slug":"_2-执行流程","link":"#_2-执行流程","children":[]},{"level":2,"title":"3. 使用规则","slug":"_3-使用规则","link":"#_3-使用规则","children":[]},{"level":2,"title":"参考文章","slug":"参考文章","link":"#参考文章","children":[]}],"git":{"createdTime":1699955247000,"updatedTime":1699955247000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":10.84,"words":3251},"filePathRelative":"middleware/rocketmq/RocketMQ的事务消息.md","localizedDate":"2023年10月30日","autoDesc":true}');export{e as data};
