const t=JSON.parse('{"key":"v-17591a46","path":"/rocketmq/RocketMQ%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E2%80%94%E2%80%94%E4%BA%8B%E5%8A%A1%E6%B6%88%E6%81%AF.html","title":"RocketMQ源码解析——事务消息","lang":"zh-CN","frontmatter":{"title":"RocketMQ源码解析——事务消息","category":["RocketMQ"],"tag":["后端","中间件"],"date":"2023-10-30T16:25:00.000Z","description":"一、概要 RocketMQ采用了2PC的思想来实现了提交事务消息，同时增加一个补偿逻辑来处理二阶段超时或者失败的消息 image-20221113154641351 所以，事务消息大致分两个流程：正常事务消息的发送及提交、事务消息的补偿流程 1.1 事务消息发送及提交（序号对照上图） 1. 生产者发送消息（half消息）到服务端 2. 服务端响应消息写...","head":[["meta",{"property":"og:url","content":"https://floweryu.top/rocketmq/RocketMQ%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E2%80%94%E2%80%94%E4%BA%8B%E5%8A%A1%E6%B6%88%E6%81%AF.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"RocketMQ源码解析——事务消息"}],["meta",{"property":"og:description","content":"一、概要 RocketMQ采用了2PC的思想来实现了提交事务消息，同时增加一个补偿逻辑来处理二阶段超时或者失败的消息 image-20221113154641351 所以，事务消息大致分两个流程：正常事务消息的发送及提交、事务消息的补偿流程 1.1 事务消息发送及提交（序号对照上图） 1. 生产者发送消息（half消息）到服务端 2. 服务端响应消息写..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://floweryu.top/"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-15T14:09:26.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"RocketMQ源码解析——事务消息"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-10-30T16:25:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-15T14:09:26.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"RocketMQ源码解析——事务消息\\",\\"image\\":[\\"https://floweryu.top/\\"],\\"datePublished\\":\\"2023-10-30T16:25:00.000Z\\",\\"dateModified\\":\\"2023-11-15T14:09:26.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://github.com/Floweryu/floweryu.github.io\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"一、概要","slug":"一、概要","link":"#一、概要","children":[]}],"git":{"createdTime":1699954242000,"updatedTime":1700057366000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":2},{"name":"Floweryu","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":1.28,"words":383},"filePathRelative":"rocketmq/RocketMQ源码解析——事务消息.md","localizedDate":"2023年10月30日","autoDesc":true}');export{t as data};
