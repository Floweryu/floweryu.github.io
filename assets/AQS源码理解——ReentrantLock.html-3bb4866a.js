const t=JSON.parse('{"key":"v-2b3dbc48","path":"/java/thread/AQS%E6%BA%90%E7%A0%81%E7%90%86%E8%A7%A3%E2%80%94%E2%80%94ReentrantLock.html","title":"AQS源码理解——ReentrantLock","lang":"zh-CN","frontmatter":{"title":"AQS源码理解——ReentrantLock","category":["Java"],"tag":["后端","源码","并发"],"date":"2023-10-10T20:25:00.000Z","description":"公平锁策略 ReentrantLock类中 FairSync 类源码解读： ```java static final class FairSync extends Sync { private static final long serialVersionUID = -3000897897090466540L; // 公平锁入口 // 不响应中断的加锁...","head":[["meta",{"property":"og:url","content":"https://floweryu.top/java/thread/AQS%E6%BA%90%E7%A0%81%E7%90%86%E8%A7%A3%E2%80%94%E2%80%94ReentrantLock.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"AQS源码理解——ReentrantLock"}],["meta",{"property":"og:description","content":"公平锁策略 ReentrantLock类中 FairSync 类源码解读： ```java static final class FairSync extends Sync { private static final long serialVersionUID = -3000897897090466540L; // 公平锁入口 // 不响应中断的加锁..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-22T08:17:26.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"源码"}],["meta",{"property":"article:tag","content":"并发"}],["meta",{"property":"article:published_time","content":"2023-10-10T20:25:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-22T08:17:26.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"AQS源码理解——ReentrantLock\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-10-10T20:25:00.000Z\\",\\"dateModified\\":\\"2023-11-22T08:17:26.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://github.com/Floweryu/floweryu.github.io\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"公平锁策略","slug":"公平锁策略","link":"#公平锁策略","children":[]}],"git":{"createdTime":1700311813000,"updatedTime":1700641046000,"contributors":[{"name":"Floweryu","email":"im.zhangjunfeng@qq.com","commits":1},{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":12.92,"words":3876},"filePathRelative":"java/thread/AQS源码理解——ReentrantLock.md","localizedDate":"2023年10月10日","autoDesc":true}');export{t as data};
