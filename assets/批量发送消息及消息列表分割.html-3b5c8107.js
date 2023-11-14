const s=JSON.parse('{"key":"v-134c317e","path":"/rocketmq/%E6%89%B9%E9%87%8F%E5%8F%91%E9%80%81%E6%B6%88%E6%81%AF%E5%8F%8A%E6%B6%88%E6%81%AF%E5%88%97%E8%A1%A8%E5%88%86%E5%89%B2.html","title":"批量发送消息及消息列表分割","lang":"en-US","frontmatter":{"title":"批量发送消息及消息列表分割","date":"2023-10-30T16:30:00.000Z","category":["RocketMQ"],"tag":["后端","中间件"],"description":"批量发送消息能显著提高传递小消息的性能。限制是这些批量消息应该有相同的topic，相同的waitStoreMsgOK，而且不能是延时消息。此外，这一批消息的总大小不应超过4MB。 发送批量消息 public class BatchProducer { public static void main(String[] args) throws Exception { DefaultMQProducer producer = new DefaultMQProducer(\\"batch_producer_group\\"); producer.setNamesrvAddr(\\"106.15.42.9:9876\\"); producer.start(); String topic = \\"TopicTest\\"; List&lt;Message&gt; messages = new ArrayList&lt;&gt;(); messages.add(new Message(topic, \\"TagA\\", \\"OrderID001\\", \\"Hello world 0\\".getBytes())); messages.add(new Message(topic, \\"TagA\\", \\"OrderID002\\", \\"Hello world 1\\".getBytes())); messages.add(new Message(topic, \\"TagA\\", \\"OrderID003\\", \\"Hello world 2\\".getBytes())); ListSplitter splitter = new ListSplitter(messages); while (splitter.hasNext()) { List&lt;Message&gt; listItem = splitter.next(); producer.send(listItem); } producer.shutdown(); } }","head":[["meta",{"property":"og:url","content":"https://mister-hope.github.io/rocketmq/%E6%89%B9%E9%87%8F%E5%8F%91%E9%80%81%E6%B6%88%E6%81%AF%E5%8F%8A%E6%B6%88%E6%81%AF%E5%88%97%E8%A1%A8%E5%88%86%E5%89%B2.html"}],["meta",{"property":"og:site_name","content":"Blog Demo"}],["meta",{"property":"og:title","content":"批量发送消息及消息列表分割"}],["meta",{"property":"og:description","content":"批量发送消息能显著提高传递小消息的性能。限制是这些批量消息应该有相同的topic，相同的waitStoreMsgOK，而且不能是延时消息。此外，这一批消息的总大小不应超过4MB。 发送批量消息 public class BatchProducer { public static void main(String[] args) throws Exception { DefaultMQProducer producer = new DefaultMQProducer(\\"batch_producer_group\\"); producer.setNamesrvAddr(\\"106.15.42.9:9876\\"); producer.start(); String topic = \\"TopicTest\\"; List&lt;Message&gt; messages = new ArrayList&lt;&gt;(); messages.add(new Message(topic, \\"TagA\\", \\"OrderID001\\", \\"Hello world 0\\".getBytes())); messages.add(new Message(topic, \\"TagA\\", \\"OrderID002\\", \\"Hello world 1\\".getBytes())); messages.add(new Message(topic, \\"TagA\\", \\"OrderID003\\", \\"Hello world 2\\".getBytes())); ListSplitter splitter = new ListSplitter(messages); while (splitter.hasNext()) { List&lt;Message&gt; listItem = splitter.next(); producer.send(listItem); } producer.shutdown(); } }"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"en-US"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:30:42.000Z"}],["meta",{"property":"article:author","content":"Mr.Hope"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"中间件"}],["meta",{"property":"article:published_time","content":"2023-10-30T16:30:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:30:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"批量发送消息及消息列表分割\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-10-30T16:30:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:30:42.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Mr.Hope\\",\\"url\\":\\"https://mister-hope.com\\"}]}"]]},"headers":[{"level":3,"title":"发送批量消息","slug":"发送批量消息","link":"#发送批量消息","children":[]},{"level":3,"title":"原文链接","slug":"原文链接","link":"#原文链接","children":[]}],"git":{"createdTime":1699954242000,"updatedTime":1699954242000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":1.35,"words":405},"filePathRelative":"rocketmq/批量发送消息及消息列表分割.md","localizedDate":"October 30, 2023","excerpt":"<blockquote>\\n<p>批量发送消息能显著提高传递小消息的性能。限制是这些批量消息应该有相同的topic，相同的waitStoreMsgOK，而且不能是延时消息。此外，这一批消息的总大小不应超过4MB。</p>\\n</blockquote>\\n<h3> 发送批量消息</h3>\\n<div class=\\"language-java line-numbers-mode\\" data-ext=\\"java\\"><pre class=\\"language-java\\"><code><span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">class</span> <span class=\\"token class-name\\">BatchProducer</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">static</span> <span class=\\"token keyword\\">void</span> <span class=\\"token function\\">main</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">String</span><span class=\\"token punctuation\\">[</span><span class=\\"token punctuation\\">]</span> args<span class=\\"token punctuation\\">)</span> <span class=\\"token keyword\\">throws</span> <span class=\\"token class-name\\">Exception</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token class-name\\">DefaultMQProducer</span> producer <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">DefaultMQProducer</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"batch_producer_group\\"</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        producer<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">setNamesrvAddr</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"106.15.42.9:9876\\"</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        producer<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">start</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n\\n        <span class=\\"token class-name\\">String</span> topic <span class=\\"token operator\\">=</span> <span class=\\"token string\\">\\"TopicTest\\"</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token class-name\\">List</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token class-name\\">Message</span><span class=\\"token punctuation\\">&gt;</span></span> messages <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">ArrayList</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token punctuation\\">&gt;</span></span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        messages<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">add</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Message</span><span class=\\"token punctuation\\">(</span>topic<span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"TagA\\"</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"OrderID001\\"</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"Hello world 0\\"</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">getBytes</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        messages<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">add</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Message</span><span class=\\"token punctuation\\">(</span>topic<span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"TagA\\"</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"OrderID002\\"</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"Hello world 1\\"</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">getBytes</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        messages<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">add</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">Message</span><span class=\\"token punctuation\\">(</span>topic<span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"TagA\\"</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"OrderID003\\"</span><span class=\\"token punctuation\\">,</span> <span class=\\"token string\\">\\"Hello world 2\\"</span><span class=\\"token punctuation\\">.</span><span class=\\"token function\\">getBytes</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n\\n\\n\\n        <span class=\\"token class-name\\">ListSplitter</span> splitter <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">ListSplitter</span><span class=\\"token punctuation\\">(</span>messages<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">while</span> <span class=\\"token punctuation\\">(</span>splitter<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">hasNext</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n            <span class=\\"token class-name\\">List</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token class-name\\">Message</span><span class=\\"token punctuation\\">&gt;</span></span> listItem <span class=\\"token operator\\">=</span> splitter<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">next</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n            producer<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">send</span><span class=\\"token punctuation\\">(</span>listItem<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span>\\n        \\n        producer<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">shutdown</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{s as data};
