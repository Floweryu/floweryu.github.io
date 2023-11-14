const e=JSON.parse('{"key":"v-507e74b6","path":"/middleware/redis/Redis%E9%9D%A2%E8%AF%95%E9%A2%98.html","title":"Redis面试题","lang":"zh-CN","frontmatter":{"title":"Redis面试题","date":"2023-11-09T19:05:00.000Z","category":["Redis"],"tag":["后端","中间件"],"description":"缓存击穿/缓存穿透/缓存雪崩 缓存穿透 缓存穿透是指用户请求的数据在缓存中不存在即没有命中，同时在数据库中也不存在，导致用户每次请求该数据都要去数据库中查询一遍，然后返回空。 如果有恶意攻击者不断请求系统中不存在的数据，会导致短时间大量请求落在数据库上，造成数据库压力过大，甚至击垮数据库系统。 布隆过滤器 布隆过滤器（Bloom Filter，简称BF）由Burton Howard Bloom在1970年提出，是一种空间效率高的概率型数据结构。 布隆过滤器专门用来检测集合中是否存在特定的元素。","head":[["meta",{"property":"og:url","content":"https://floweryu.top/middleware/redis/Redis%E9%9D%A2%E8%AF%95%E9%A2%98.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"Redis面试题"}],["meta",{"property":"og:description","content":"缓存击穿/缓存穿透/缓存雪崩 缓存穿透 缓存穿透是指用户请求的数据在缓存中不存在即没有命中，同时在数据库中也不存在，导致用户每次请求该数据都要去数据库中查询一遍，然后返回空。 如果有恶意攻击者不断请求系统中不存在的数据，会导致短时间大量请求落在数据库上，造成数据库压力过大，甚至击垮数据库系统。 布隆过滤器 布隆过滤器（Bloom Filter，简称BF）由Burton Howard Bloom在1970年提出，是一种空间效率高的概率型数据结构。 布隆过滤器专门用来检测集合中是否存在特定的元素。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:image","content":"https://floweryu.top/"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:47:27.000Z"}],["meta",{"name":"twitter:card","content":"summary_large_image"}],["meta",{"name":"twitter:image:alt","content":"Redis面试题"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-11-09T19:05:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:47:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Redis面试题\\",\\"image\\":[\\"https://floweryu.top/\\"],\\"datePublished\\":\\"2023-11-09T19:05:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:47:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://floweryu.top\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"缓存击穿/缓存穿透/缓存雪崩","slug":"缓存击穿-缓存穿透-缓存雪崩","link":"#缓存击穿-缓存穿透-缓存雪崩","children":[{"level":3,"title":"缓存穿透","slug":"缓存穿透","link":"#缓存穿透","children":[]},{"level":3,"title":"缓存击穿","slug":"缓存击穿","link":"#缓存击穿","children":[]},{"level":3,"title":"缓存雪崩","slug":"缓存雪崩","link":"#缓存雪崩","children":[]},{"level":3,"title":"缓存预热","slug":"缓存预热","link":"#缓存预热","children":[]},{"level":3,"title":"缓存降级","slug":"缓存降级","link":"#缓存降级","children":[]}]}],"git":{"createdTime":1699955247000,"updatedTime":1699955247000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":7.32,"words":2195},"filePathRelative":"middleware/redis/Redis面试题.md","localizedDate":"2023年11月9日","excerpt":"<h2> 缓存击穿/缓存穿透/缓存雪崩</h2>\\n<h3> 缓存穿透</h3>\\n<p>缓存穿透是指用户请求的数据在缓存中不存在即没有命中，同时在数据库中也不存在，导致用户每次请求该数据都要去数据库中查询一遍，然后返回空。</p>\\n<p>如果有恶意攻击者不断请求系统中不存在的数据，会导致短时间大量请求落在数据库上，造成数据库压力过大，甚至击垮数据库系统。</p>\\n<h4> 布隆过滤器</h4>\\n<p>布隆过滤器（Bloom Filter，简称BF）由Burton Howard Bloom在1970年提出，是一种空间效率高的概率型数据结构。</p>\\n<p>布隆过滤器专门用来检测集合中是否存在特定的元素。</p>","autoDesc":true}');export{e as data};
