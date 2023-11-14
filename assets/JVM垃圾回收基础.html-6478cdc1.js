const n=JSON.parse('{"key":"v-fd68f0da","path":"/java/JVM%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E5%9F%BA%E7%A1%80.html","title":"JVM垃圾回收基础","lang":"zh-CN","frontmatter":{"title":"JVM垃圾回收基础","date":"2023-10-21T23:00:00.000Z","category":["Java"],"tag":["后端","JVM"],"description":"如何判断对象需要回收？ 引用计数算法 给对象添加一个引用计数器，当对象增加一个引用时计数器加1，引用失效时计数器减1。引用计数为0的对象可被回收。 **缺点：**两个对象出现循环引用的情况下，此时引用计数器永远不为0，导致无法对它们进行回收。 public class ReferenceCountingGC { public Object instance = null; public static void main(String[] args) { ReferenceCountingGC objectA = new ReferenceCountingGC(); ReferenceCountingGC objectB = new ReferenceCountingGC(); objectA.instance = objectB; objectB.instance = objectA; } }","head":[["meta",{"property":"og:url","content":"https://floweryu.top/java/JVM%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6%E5%9F%BA%E7%A1%80.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"JVM垃圾回收基础"}],["meta",{"property":"og:description","content":"如何判断对象需要回收？ 引用计数算法 给对象添加一个引用计数器，当对象增加一个引用时计数器加1，引用失效时计数器减1。引用计数为0的对象可被回收。 **缺点：**两个对象出现循环引用的情况下，此时引用计数器永远不为0，导致无法对它们进行回收。 public class ReferenceCountingGC { public Object instance = null; public static void main(String[] args) { ReferenceCountingGC objectA = new ReferenceCountingGC(); ReferenceCountingGC objectB = new ReferenceCountingGC(); objectA.instance = objectB; objectB.instance = objectA; } }"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:30:42.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"JVM"}],["meta",{"property":"article:published_time","content":"2023-10-21T23:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:30:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"JVM垃圾回收基础\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-10-21T23:00:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:30:42.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://floweryu.top\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"如何判断对象需要回收？","slug":"如何判断对象需要回收","link":"#如何判断对象需要回收","children":[{"level":3,"title":"引用计数算法","slug":"引用计数算法","link":"#引用计数算法","children":[]},{"level":3,"title":"可达性分析算法","slug":"可达性分析算法","link":"#可达性分析算法","children":[]},{"level":3,"title":"引用类型","slug":"引用类型","link":"#引用类型","children":[]}]},{"level":2,"title":"垃圾回收算法","slug":"垃圾回收算法","link":"#垃圾回收算法","children":[{"level":3,"title":"垃圾收集性能","slug":"垃圾收集性能","link":"#垃圾收集性能","children":[]},{"level":3,"title":"标记 - 清除（Mark-Sweep）算法","slug":"标记-清除-mark-sweep-算法","link":"#标记-清除-mark-sweep-算法","children":[]},{"level":3,"title":"标记 - 整理（Mark-Compact）算法","slug":"标记-整理-mark-compact-算法","link":"#标记-整理-mark-compact-算法","children":[]},{"level":3,"title":"复制（Copying）算法","slug":"复制-copying-算法","link":"#复制-copying-算法","children":[]},{"level":3,"title":"分代收集","slug":"分代收集","link":"#分代收集","children":[]}]},{"level":2,"title":"JVM参数","slug":"jvm参数","link":"#jvm参数","children":[]},{"level":2,"title":"内存分配与回收策略","slug":"内存分配与回收策略","link":"#内存分配与回收策略","children":[{"level":3,"title":"Minor GC","slug":"minor-gc","link":"#minor-gc","children":[]},{"level":3,"title":"Full GC","slug":"full-gc","link":"#full-gc","children":[]},{"level":3,"title":"内存分配策略","slug":"内存分配策略","link":"#内存分配策略","children":[]},{"level":3,"title":"Full GC 的触发条件","slug":"full-gc-的触发条件","link":"#full-gc-的触发条件","children":[]}]}],"git":{"createdTime":1699954242000,"updatedTime":1699954242000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":18.39,"words":5516},"filePathRelative":"java/JVM垃圾回收基础.md","localizedDate":"2023年10月21日","excerpt":"<h2> 如何判断对象需要回收？</h2>\\n<h3> 引用计数算法</h3>\\n<p>给对象添加一个引用计数器，当对象增加一个引用时计数器加1，引用失效时计数器减1。引用计数为0的对象可被回收。</p>\\n<p>**缺点：**两个对象出现循环引用的情况下，此时引用计数器永远不为0，导致无法对它们进行回收。</p>\\n<div class=\\"language-java line-numbers-mode\\" data-ext=\\"java\\"><pre class=\\"language-java\\"><code><span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">class</span> <span class=\\"token class-name\\">ReferenceCountingGC</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">public</span> <span class=\\"token class-name\\">Object</span> instance <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">null</span><span class=\\"token punctuation\\">;</span>\\n\\n    <span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">static</span> <span class=\\"token keyword\\">void</span> <span class=\\"token function\\">main</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">String</span><span class=\\"token punctuation\\">[</span><span class=\\"token punctuation\\">]</span> args<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token class-name\\">ReferenceCountingGC</span> objectA <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">ReferenceCountingGC</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token class-name\\">ReferenceCountingGC</span> objectB <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">ReferenceCountingGC</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        objectA<span class=\\"token punctuation\\">.</span>instance <span class=\\"token operator\\">=</span> objectB<span class=\\"token punctuation\\">;</span>\\n        objectB<span class=\\"token punctuation\\">.</span>instance <span class=\\"token operator\\">=</span> objectA<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{n as data};
