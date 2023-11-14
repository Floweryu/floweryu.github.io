const n=JSON.parse('{"key":"v-f712f97e","path":"/middleware/rocketmq/%E6%B6%88%E6%81%AF%E5%8F%91%E9%80%81%E4%B8%8E%E6%B6%88%E8%B4%B9.html","title":"消息发送与消费","lang":"zh-CN","frontmatter":{"title":"消息发送与消费","date":"2023-10-30T16:25:00.000Z","category":["RocketMQ"],"tag":["后端","中间件"],"description":"本文介绍了RocketMQ发送消息的三种方式：发送同步消息、发送异步消息、发送单向消息 1. 发送同步消息 这种可靠性同步地发送方式使用的比较广泛，比如：重要的消息通知，短信通知。 public class SyncProducer { \\tpublic static void main(String[] args) throws Exception { \\t// 实例化消息生产者Producer DefaultMQProducer producer = new DefaultMQProducer(\\"please_rename_unique_group_name\\"); \\t// 设置NameServer的地址 \\tproducer.setNamesrvAddr(\\"localhost:9876\\"); \\t// 启动Producer实例 producer.start(); \\tfor (int i = 0; i &lt; 100; i++) { \\t // 创建消息，并指定Topic，Tag和消息体 \\t Message msg = new Message(\\"TopicTest\\" /* Topic */, \\t\\"TagA\\" /* Tag */, \\t(\\"Hello RocketMQ \\" + i).getBytes(RemotingHelper.DEFAULT_CHARSET) /* Message body */ \\t); \\t// 发送消息到一个Broker SendResult sendResult = producer.send(msg); // 通过sendResult返回消息是否成功送达 System.out.printf(\\"%s%n\\", sendResult); \\t} \\t// 如果不再发送消息，关闭Producer实例。 \\tproducer.shutdown(); } }","head":[["meta",{"property":"og:url","content":"https://floweryu.top/middleware/rocketmq/%E6%B6%88%E6%81%AF%E5%8F%91%E9%80%81%E4%B8%8E%E6%B6%88%E8%B4%B9.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"消息发送与消费"}],["meta",{"property":"og:description","content":"本文介绍了RocketMQ发送消息的三种方式：发送同步消息、发送异步消息、发送单向消息 1. 发送同步消息 这种可靠性同步地发送方式使用的比较广泛，比如：重要的消息通知，短信通知。 public class SyncProducer { \\tpublic static void main(String[] args) throws Exception { \\t// 实例化消息生产者Producer DefaultMQProducer producer = new DefaultMQProducer(\\"please_rename_unique_group_name\\"); \\t// 设置NameServer的地址 \\tproducer.setNamesrvAddr(\\"localhost:9876\\"); \\t// 启动Producer实例 producer.start(); \\tfor (int i = 0; i &lt; 100; i++) { \\t // 创建消息，并指定Topic，Tag和消息体 \\t Message msg = new Message(\\"TopicTest\\" /* Topic */, \\t\\"TagA\\" /* Tag */, \\t(\\"Hello RocketMQ \\" + i).getBytes(RemotingHelper.DEFAULT_CHARSET) /* Message body */ \\t); \\t// 发送消息到一个Broker SendResult sendResult = producer.send(msg); // 通过sendResult返回消息是否成功送达 System.out.printf(\\"%s%n\\", sendResult); \\t} \\t// 如果不再发送消息，关闭Producer实例。 \\tproducer.shutdown(); } }"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:47:27.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-10-30T16:25:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:47:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"消息发送与消费\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-10-30T16:25:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:47:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://floweryu.top\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":3,"title":"1. 发送同步消息","slug":"_1-发送同步消息","link":"#_1-发送同步消息","children":[]},{"level":3,"title":"2.发送异步消息","slug":"_2-发送异步消息","link":"#_2-发送异步消息","children":[]},{"level":3,"title":"3. 单向发送消息","slug":"_3-单向发送消息","link":"#_3-单向发送消息","children":[]},{"level":3,"title":"4. 消费消息","slug":"_4-消费消息","link":"#_4-消费消息","children":[]},{"level":3,"title":"文章来自","slug":"文章来自","link":"#文章来自","children":[]}],"git":{"createdTime":1699955247000,"updatedTime":1699955247000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":2.48,"words":744},"filePathRelative":"middleware/rocketmq/消息发送与消费.md","localizedDate":"2023年10月30日","excerpt":"<p>本文介绍了RocketMQ发送消息的三种方式：发送同步消息、发送异步消息、发送单向消息</p>\\n<h3> 1. 发送同步消息</h3>\\n<p>这种可靠性同步地发送方式使用的比较广泛，比如：重要的消息通知，短信通知。</p>\\n<div class=\\"language-java line-numbers-mode\\" data-ext=\\"java\\"><pre class=\\"language-java\\"><code><span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">class</span> <span class=\\"token class-name\\">SyncProducer</span> <span class=\\"token punctuation\\">{</span>\\n\\t<span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">static</span> <span class=\\"token keyword\\">void</span> <span class=\\"token function\\">main</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">String</span><span class=\\"token punctuation\\">[</span><span class=\\"token punctuation\\">]</span> args<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">throws</span> <span class=\\"token class-name\\">Exception</span> <span class=\\"token punctuation\\">{</span>\\n    \\t<span class=\\"token comment\\">// 实例化消息生产者Producer</span>\\n        <span class=\\"token class-name\\">DefaultMQProducer</span> producer <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">DefaultMQProducer</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"please_rename_unique_group_name\\"</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    \\t<span class=\\"token comment\\">// 设置NameServer的地址</span>\\n    \\tproducer<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">setNamesrvAddr</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"localhost:9876\\"</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    \\t<span class=\\"token comment\\">// 启动Producer实例</span>\\n        producer<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">start</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    \\t<span class=\\"token keyword\\">for</span> <span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">int</span> i <span class=\\"token operator\\">=</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">;</span> i <span class=\\"token operator\\">&lt;</span> <span class=\\"token number\\">100</span><span class=\\"token punctuation\\">;</span> i<span class=\\"token operator\\">++</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    \\t    <span class=\\"token comment\\">// 创建消息，并指定Topic，Tag和消息体</span>\\n    \\t    <span class=\\"token class-name\\">Message</span> msg <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Message</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"TopicTest\\"</span> <span class=\\"token comment\\">/* Topic */</span><span class=\\"token punctuation\\">,</span>\\n        \\t<span class=\\"token string\\">\\"TagA\\"</span> <span class=\\"token comment\\">/* Tag */</span><span class=\\"token punctuation\\">,</span>\\n        \\t<span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"Hello RocketMQ \\"</span> <span class=\\"token operator\\">+</span> i<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">getBytes</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">RemotingHelper</span><span class=\\"token punctuation\\">.</span><span class=\\"token constant\\">DEFAULT_CHARSET</span><span class=\\"token punctuation\\">)</span> <span class=\\"token comment\\">/* Message body */</span>\\n        \\t<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        \\t<span class=\\"token comment\\">// 发送消息到一个Broker</span>\\n            <span class=\\"token class-name\\">SendResult</span> sendResult <span class=\\"token operator\\">=</span> producer<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">send</span><span class=\\"token punctuation\\">(</span>msg<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n            <span class=\\"token comment\\">// 通过sendResult返回消息是否成功送达</span>\\n            <span class=\\"token class-name\\">System</span><span class=\\"token punctuation\\">.</span>out<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">printf</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"%s%n\\"</span><span class=\\"token punctuation\\">,</span> sendResult<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    \\t<span class=\\"token punctuation\\">}</span>\\n    \\t<span class=\\"token comment\\">// 如果不再发送消息，关闭Producer实例。</span>\\n    \\tproducer<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">shutdown</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{n as data};
