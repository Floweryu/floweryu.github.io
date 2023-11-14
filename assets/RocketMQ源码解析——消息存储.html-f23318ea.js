const e=JSON.parse('{"key":"v-62bb050d","path":"/middleware/rocketmq/RocketMQ%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E2%80%94%E2%80%94%E6%B6%88%E6%81%AF%E5%AD%98%E5%82%A8.html","title":"RocketMQ源码解析——消息存储","lang":"zh-CN","frontmatter":{"title":"RocketMQ源码解析——消息存储","date":"2023-10-30T16:25:00.000Z","category":["RocketMQ"],"tag":["后端","中间件"],"description":"一、前言 存储方式和效率：文件系统 &gt; KV存储 &gt; 关系型数据库。直接操作文件系统肯定是最快的，但是可靠性低，这一点上关系型数据库与文件系统刚好相反。 二、消息存储整体架构 消息存储架构图中主要有下面三个跟消息存储相关的文件构成：CommitLog、ConsumeQueue、IndexFile。 CommitLog：消息存储文件，所有的主题消息都存储在CommitLog中。消息内容不定长，单个文件大小默认1G，文件名长度为20位，左边补零，剩余为起始偏移量，比如：00000000000000000000代表了第一个文件，起始偏移量为0，文件大小为1G=1073741824；当第一个文件写满了，第二个文件为00000000001073741824，起始偏移量为1073741824，以此类推。消息主要是顺序写入日志文件，当文件满了，写入下一个文件。 ConsumeQueue：消息消费索引，引入的目的主要是提高消息消费的性能。由于RocketMQ是基于主题topic的订阅模式，消息消费是针对主题进行的，如果要遍历commitlog文件，根据topic检索消息是非常低效的。Consumer可根据ConsumeQueue来查找待消费的消息。其中，ConsumeQueue作为消费消息的索引，保存了指定Topic下的队列消息在CommitLog中的起始物理偏移量offset，消息大小size和消息Tag的HashCode值。consumequeue文件可以看成是基于topic的commitlog索引文件，故consumequeue文件夹的组织方式如下：topic/queue/file三层组织结构，具体存储路径为：$HOME/store/consumequeue/{topic}/{queueId}/{fileName}。同样consumequeue文件采取定长设计，每一个条目共20个字节，分别为8字节的commitlog物理偏移量、4字节的消息长度、8字节tag hashcode，单个文件由30W个条目组成，可以像数组一样随机访问每一个条目，每个ConsumeQueue文件大小约5.72M； IndexFile：提供了一种可以通过key或时间区间来查询消息的方法。Index文件的存储位置是：$HOME/store/index/{fileName}，文件名fileName是以创建时的时间戳命名的，固定的单个IndexFile文件大小约为400M，一个IndexFile可以保存 2000W个索引，IndexFile的底层存储设计为在文件系统中实现HashMap结构，故RocketMQ的索引文件其底层实现为hash索引。","head":[["meta",{"property":"og:url","content":"https://floweryu.top/middleware/rocketmq/RocketMQ%E6%BA%90%E7%A0%81%E8%A7%A3%E6%9E%90%E2%80%94%E2%80%94%E6%B6%88%E6%81%AF%E5%AD%98%E5%82%A8.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"RocketMQ源码解析——消息存储"}],["meta",{"property":"og:description","content":"一、前言 存储方式和效率：文件系统 &gt; KV存储 &gt; 关系型数据库。直接操作文件系统肯定是最快的，但是可靠性低，这一点上关系型数据库与文件系统刚好相反。 二、消息存储整体架构 消息存储架构图中主要有下面三个跟消息存储相关的文件构成：CommitLog、ConsumeQueue、IndexFile。 CommitLog：消息存储文件，所有的主题消息都存储在CommitLog中。消息内容不定长，单个文件大小默认1G，文件名长度为20位，左边补零，剩余为起始偏移量，比如：00000000000000000000代表了第一个文件，起始偏移量为0，文件大小为1G=1073741824；当第一个文件写满了，第二个文件为00000000001073741824，起始偏移量为1073741824，以此类推。消息主要是顺序写入日志文件，当文件满了，写入下一个文件。 ConsumeQueue：消息消费索引，引入的目的主要是提高消息消费的性能。由于RocketMQ是基于主题topic的订阅模式，消息消费是针对主题进行的，如果要遍历commitlog文件，根据topic检索消息是非常低效的。Consumer可根据ConsumeQueue来查找待消费的消息。其中，ConsumeQueue作为消费消息的索引，保存了指定Topic下的队列消息在CommitLog中的起始物理偏移量offset，消息大小size和消息Tag的HashCode值。consumequeue文件可以看成是基于topic的commitlog索引文件，故consumequeue文件夹的组织方式如下：topic/queue/file三层组织结构，具体存储路径为：$HOME/store/consumequeue/{topic}/{queueId}/{fileName}。同样consumequeue文件采取定长设计，每一个条目共20个字节，分别为8字节的commitlog物理偏移量、4字节的消息长度、8字节tag hashcode，单个文件由30W个条目组成，可以像数组一样随机访问每一个条目，每个ConsumeQueue文件大小约5.72M； IndexFile：提供了一种可以通过key或时间区间来查询消息的方法。Index文件的存储位置是：$HOME/store/index/{fileName}，文件名fileName是以创建时的时间戳命名的，固定的单个IndexFile文件大小约为400M，一个IndexFile可以保存 2000W个索引，IndexFile的底层存储设计为在文件系统中实现HashMap结构，故RocketMQ的索引文件其底层实现为hash索引。"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:47:27.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-10-30T16:25:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:47:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"RocketMQ源码解析——消息存储\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-10-30T16:25:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:47:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://floweryu.top\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"一、前言","slug":"一、前言","link":"#一、前言","children":[]},{"level":2,"title":"二、消息存储整体架构","slug":"二、消息存储整体架构","link":"#二、消息存储整体架构","children":[]},{"level":2,"title":"三、消息存储实现类","slug":"三、消息存储实现类","link":"#三、消息存储实现类","children":[]},{"level":2,"title":"四、消息发送存储流程","slug":"四、消息发送存储流程","link":"#四、消息发送存储流程","children":[]}],"git":{"createdTime":1699955247000,"updatedTime":1699955247000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":6.02,"words":1806},"filePathRelative":"middleware/rocketmq/RocketMQ源码解析——消息存储.md","localizedDate":"2023年10月30日","excerpt":"<h2> 一、前言</h2>\\n<p>存储方式和效率：文件系统 &gt; KV存储 &gt; 关系型数据库。直接操作文件系统肯定是最快的，但是可靠性低，这一点上关系型数据库与文件系统刚好相反。</p>\\n<h2> 二、消息存储整体架构</h2>\\n<p>消息存储架构图中主要有下面三个跟消息存储相关的文件构成：CommitLog、ConsumeQueue、IndexFile。</p>\\n<ul>\\n<li>CommitLog：<strong>消息存储文件</strong>，所有的主题消息都存储在CommitLog中。消息内容不定长，单个文件大小默认1G，文件名长度为20位，左边补零，剩余为起始偏移量，比如：00000000000000000000代表了第一个文件，起始偏移量为0，文件大小为1G=1073741824；当第一个文件写满了，第二个文件为00000000001073741824，起始偏移量为1073741824，以此类推。消息主要是顺序写入日志文件，当文件满了，写入下一个文件。</li>\\n<li>ConsumeQueue：<strong>消息消费索引</strong>，引入的目的主要是提高消息消费的性能。由于RocketMQ是基于主题topic的订阅模式，消息消费是针对主题进行的，如果要遍历commitlog文件，根据topic检索消息是非常低效的。Consumer可根据ConsumeQueue来查找待消费的消息。其中，ConsumeQueue作为消费消息的索引，<strong>保存了指定Topic下的队列消息在CommitLog中的起始物理偏移量offset，消息大小size和消息Tag的HashCode值</strong>。consumequeue文件可以看成是基于topic的commitlog索引文件，故consumequeue文件夹的组织方式如下：topic/queue/file三层组织结构，具体存储路径为：$HOME/store/consumequeue/{topic}/{queueId}/{fileName}。同样consumequeue文件采取定长设计，每一个条目共20个字节，分别为8字节的commitlog物理偏移量、4字节的消息长度、8字节tag hashcode，单个文件由30W个条目组成，可以像数组一样随机访问每一个条目，每个ConsumeQueue文件大小约5.72M；</li>\\n<li>IndexFile：<strong>提供了一种可以通过key或时间区间来查询消息的方法</strong>。Index文件的存储位置是：$HOME/store/index/{fileName}，文件名fileName是以创建时的时间戳命名的，固定的单个IndexFile文件大小约为400M，一个IndexFile可以保存 2000W个索引，IndexFile的底层存储设计为在文件系统中实现HashMap结构，故RocketMQ的索引文件其底层实现为hash索引。</li>\\n</ul>","autoDesc":true}');export{e as data};
