const n=JSON.parse('{"key":"v-21d4e8ce","path":"/posts/algorithm/LRU%E7%BC%93%E5%AD%98%E7%AE%97%E6%B3%95.html","title":"LRU缓存算法","lang":"zh-CN","frontmatter":{"title":"LRU缓存算法","date":"2023-07-09T19:00:00.000Z","category":["算法"],"tag":["LRU"],"description":"双向链表+哈希表（非线程安全） https://leetcode.cn/problems/lru-cache/solutions/259678/lruhuan-cun-ji-zhi-by-leetcode-solution/ /** * LRU算法: 哈希表+双向链表实现 * 1. 双向链表按照被使用的顺序来存储, 靠近头部的节点是最近使用的, 靠近尾部的节点是最久未使用的 * 2. 哈希表存储key和node映射关系, 通过key能快速定位到链表中的节点 * @author zhangjunfeng * @date 2023/2/2 16:15 */ public class LRUCache { class DLinkedNode { int key; int value; DLinkedNode prev; DLinkedNode next; public DLinkedNode() {} public DLinkedNode(int _key, int _value) { key = _key; value = _value; } } private Map&lt;Integer, DLinkedNode&gt; cache = new HashMap&lt;&gt;(); private int size; private int capacity; private DLinkedNode head, tail; public LRUCache(int _capacity) { this.size = 0; this.capacity = _capacity; head = new DLinkedNode(); tail = new DLinkedNode(); head.next = tail; tail.prev = head; } /** * 1. 先判断key是否存在, 不存在返回-1 * 2. 若key存在, 则key对应的节点就是最近访问节点, 通过哈希表映射到在双向链表中的位置, 然后将节点移动到链表头部 * @param key * @return */ public int get(int key) { DLinkedNode node = cache.get(key); if (node == null) { return -1; } // key存在则移动到链表头部, 表示最近访问 moveToHead(node); return node.value; } /** * 1. 如果key不存在, 创建一个新节点并在链表头部添加该节点, 判断链表长度是否超出容量限制, 若超出容量, 则删除链表尾部结点 * 2. 如果key存在, 覆盖旧值, 将节点移动到头部 * @param key * @param value */ public void put(int key, int value) { DLinkedNode node = cache.get(key); if (node == null) { // node不存在, 则创建一个新节点 DLinkedNode newNode = new DLinkedNode(key, value); // 添加进哈希表 cache.put(key, newNode); // 添加到链表头部, 表示最近访问 addToHead(newNode); // 链表长度加1 ++size; // 如果超出缓存容量 if (size &gt; capacity) { // 删除链表最后一个结点, 去掉最长时间未访问的 DLinkedNode tail = removeTail(); // 去掉哈希表中对应节点 cache.remove(tail.key); // 减小链表长度 --size; } } else { // 如果缓存中有 // 先覆盖旧值 node.value = value; // 再将节点移到链表头部, 表示最近访问 moveToHead(node); } } /** * 添加一个结点需要修改四条链 * @param node */ private void addToHead(DLinkedNode node) { node.prev = head; node.next = head.next; head.next.prev = node; head.next = node; } /** * 删除一个结点需要修改两条链 * @param node */ private void removeNode(DLinkedNode node) { node.prev.next = node.next; node.next.prev = node.prev; } /** * 把结点移到头部 */ private void moveToHead(DLinkedNode node) { // 先删除节点 removeNode(node); // 再将该节点移到头部 addToHead(node); } /** * 删除尾结点并返回 */ private DLinkedNode removeTail() { DLinkedNode last = tail.prev; removeNode(last); return last; } public void print() { DLinkedNode cur = head.next; while (cur != null &amp;&amp; cur.next != null) { System.out.println(\\"key: \\" + cur.key + \\"; value: \\" + cur.value); cur = cur.next; } System.out.println(\\"-----------------\\"); } }","head":[["meta",{"property":"og:url","content":"https://floweryu.top/posts/algorithm/LRU%E7%BC%93%E5%AD%98%E7%AE%97%E6%B3%95.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"LRU缓存算法"}],["meta",{"property":"og:description","content":"双向链表+哈希表（非线程安全） https://leetcode.cn/problems/lru-cache/solutions/259678/lruhuan-cun-ji-zhi-by-leetcode-solution/ /** * LRU算法: 哈希表+双向链表实现 * 1. 双向链表按照被使用的顺序来存储, 靠近头部的节点是最近使用的, 靠近尾部的节点是最久未使用的 * 2. 哈希表存储key和node映射关系, 通过key能快速定位到链表中的节点 * @author zhangjunfeng * @date 2023/2/2 16:15 */ public class LRUCache { class DLinkedNode { int key; int value; DLinkedNode prev; DLinkedNode next; public DLinkedNode() {} public DLinkedNode(int _key, int _value) { key = _key; value = _value; } } private Map&lt;Integer, DLinkedNode&gt; cache = new HashMap&lt;&gt;(); private int size; private int capacity; private DLinkedNode head, tail; public LRUCache(int _capacity) { this.size = 0; this.capacity = _capacity; head = new DLinkedNode(); tail = new DLinkedNode(); head.next = tail; tail.prev = head; } /** * 1. 先判断key是否存在, 不存在返回-1 * 2. 若key存在, 则key对应的节点就是最近访问节点, 通过哈希表映射到在双向链表中的位置, 然后将节点移动到链表头部 * @param key * @return */ public int get(int key) { DLinkedNode node = cache.get(key); if (node == null) { return -1; } // key存在则移动到链表头部, 表示最近访问 moveToHead(node); return node.value; } /** * 1. 如果key不存在, 创建一个新节点并在链表头部添加该节点, 判断链表长度是否超出容量限制, 若超出容量, 则删除链表尾部结点 * 2. 如果key存在, 覆盖旧值, 将节点移动到头部 * @param key * @param value */ public void put(int key, int value) { DLinkedNode node = cache.get(key); if (node == null) { // node不存在, 则创建一个新节点 DLinkedNode newNode = new DLinkedNode(key, value); // 添加进哈希表 cache.put(key, newNode); // 添加到链表头部, 表示最近访问 addToHead(newNode); // 链表长度加1 ++size; // 如果超出缓存容量 if (size &gt; capacity) { // 删除链表最后一个结点, 去掉最长时间未访问的 DLinkedNode tail = removeTail(); // 去掉哈希表中对应节点 cache.remove(tail.key); // 减小链表长度 --size; } } else { // 如果缓存中有 // 先覆盖旧值 node.value = value; // 再将节点移到链表头部, 表示最近访问 moveToHead(node); } } /** * 添加一个结点需要修改四条链 * @param node */ private void addToHead(DLinkedNode node) { node.prev = head; node.next = head.next; head.next.prev = node; head.next = node; } /** * 删除一个结点需要修改两条链 * @param node */ private void removeNode(DLinkedNode node) { node.prev.next = node.next; node.next.prev = node.prev; } /** * 把结点移到头部 */ private void moveToHead(DLinkedNode node) { // 先删除节点 removeNode(node); // 再将该节点移到头部 addToHead(node); } /** * 删除尾结点并返回 */ private DLinkedNode removeTail() { DLinkedNode last = tail.prev; removeNode(last); return last; } public void print() { DLinkedNode cur = head.next; while (cur != null &amp;&amp; cur.next != null) { System.out.println(\\"key: \\" + cur.key + \\"; value: \\" + cur.value); cur = cur.next; } System.out.println(\\"-----------------\\"); } }"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:30:42.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"LRU"}],["meta",{"property":"article:published_time","content":"2023-07-09T19:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:30:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"LRU缓存算法\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-07-09T19:00:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:30:42.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://floweryu.top\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"双向链表+哈希表（非线程安全）","slug":"双向链表-哈希表-非线程安全","link":"#双向链表-哈希表-非线程安全","children":[]},{"level":2,"title":"线程安全版本","slug":"线程安全版本","link":"#线程安全版本","children":[{"level":3,"title":"实现方法","slug":"实现方法","link":"#实现方法","children":[]},{"level":3,"title":"ConcurrentLinkedQueue简单介绍","slug":"concurrentlinkedqueue简单介绍","link":"#concurrentlinkedqueue简单介绍","children":[]},{"level":3,"title":"ReadWriteLock简单介绍","slug":"readwritelock简单介绍","link":"#readwritelock简单介绍","children":[]},{"level":3,"title":"ScheduledExecutorService 简单介绍","slug":"scheduledexecutorservice-简单介绍","link":"#scheduledexecutorservice-简单介绍","children":[]},{"level":3,"title":"原理","slug":"原理","link":"#原理","children":[]},{"level":3,"title":"代码实现","slug":"代码实现","link":"#代码实现","children":[]},{"level":3,"title":"并发测试","slug":"并发测试","link":"#并发测试","children":[]}]},{"level":2,"title":"线程安全并且带有过期时间","slug":"线程安全并且带有过期时间","link":"#线程安全并且带有过期时间","children":[{"level":3,"title":"完整源码","slug":"完整源码","link":"#完整源码","children":[]}]},{"level":2,"title":"资料来自","slug":"资料来自","link":"#资料来自","children":[]}],"git":{"createdTime":1699954242000,"updatedTime":1699954242000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":9.58,"words":2873},"filePathRelative":"posts/algorithm/LRU缓存算法.md","localizedDate":"2023年7月9日","excerpt":"<h2> 双向链表+哈希表（非线程安全）</h2>\\n<p>https://leetcode.cn/problems/lru-cache/solutions/259678/lruhuan-cun-ji-zhi-by-leetcode-solution/</p>\\n<div class=\\"language-java line-numbers-mode\\" data-ext=\\"java\\"><pre class=\\"language-java\\"><code><span class=\\"token doc-comment comment\\">/**\\n * LRU算法: 哈希表+双向链表实现\\n * 1. 双向链表按照被使用的顺序来存储, 靠近头部的节点是最近使用的, 靠近尾部的节点是最久未使用的\\n * 2. 哈希表存储key和node映射关系, 通过key能快速定位到链表中的节点\\n * <span class=\\"token keyword\\">@author</span> zhangjunfeng\\n * <span class=\\"token keyword\\">@date</span> 2023/2/2 16:15\\n */</span>\\n<span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">class</span> <span class=\\"token class-name\\">LRUCache</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">class</span> <span class=\\"token class-name\\">DLinkedNode</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token keyword\\">int</span> key<span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">int</span> value<span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token class-name\\">DLinkedNode</span> prev<span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token class-name\\">DLinkedNode</span> next<span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">public</span> <span class=\\"token class-name\\">DLinkedNode</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span><span class=\\"token punctuation\\">}</span>\\n        <span class=\\"token keyword\\">public</span> <span class=\\"token class-name\\">DLinkedNode</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">int</span> _key<span class=\\"token punctuation\\">,</span> <span class=\\"token keyword\\">int</span> _value<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n            key <span class=\\"token operator\\">=</span> _key<span class=\\"token punctuation\\">;</span>\\n            value <span class=\\"token operator\\">=</span> _value<span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    \\n    <span class=\\"token keyword\\">private</span> <span class=\\"token class-name\\">Map</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token class-name\\">Integer</span><span class=\\"token punctuation\\">,</span> <span class=\\"token class-name\\">DLinkedNode</span><span class=\\"token punctuation\\">&gt;</span></span> cache <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">HashMap</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token punctuation\\">&gt;</span></span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token keyword\\">private</span> <span class=\\"token keyword\\">int</span> size<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token keyword\\">private</span> <span class=\\"token keyword\\">int</span> capacity<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token keyword\\">private</span> <span class=\\"token class-name\\">DLinkedNode</span> head<span class=\\"token punctuation\\">,</span> tail<span class=\\"token punctuation\\">;</span>\\n    \\n    <span class=\\"token keyword\\">public</span> <span class=\\"token class-name\\">LRUCache</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">int</span> _capacity<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token keyword\\">this</span><span class=\\"token punctuation\\">.</span>size <span class=\\"token operator\\">=</span> <span class=\\"token number\\">0</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">this</span><span class=\\"token punctuation\\">.</span>capacity <span class=\\"token operator\\">=</span> _capacity<span class=\\"token punctuation\\">;</span>\\n        head <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">DLinkedNode</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        tail <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">DLinkedNode</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        head<span class=\\"token punctuation\\">.</span>next <span class=\\"token operator\\">=</span> tail<span class=\\"token punctuation\\">;</span>\\n        tail<span class=\\"token punctuation\\">.</span>prev <span class=\\"token operator\\">=</span> head<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    \\n    <span class=\\"token doc-comment comment\\">/**\\n     * 1. 先判断key是否存在, 不存在返回-1\\n     * 2. 若key存在, 则key对应的节点就是最近访问节点, 通过哈希表映射到在双向链表中的位置, 然后将节点移动到链表头部\\n     * <span class=\\"token keyword\\">@param</span> <span class=\\"token parameter\\">key</span>\\n     * <span class=\\"token keyword\\">@return</span>\\n     */</span>\\n    <span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">int</span> <span class=\\"token function\\">get</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">int</span> key<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token class-name\\">DLinkedNode</span> node <span class=\\"token operator\\">=</span> cache<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">get</span><span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">if</span> <span class=\\"token punctuation\\">(</span>node <span class=\\"token operator\\">==</span> <span class=\\"token keyword\\">null</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n            <span class=\\"token keyword\\">return</span> <span class=\\"token operator\\">-</span><span class=\\"token number\\">1</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span>\\n        <span class=\\"token comment\\">// key存在则移动到链表头部, 表示最近访问</span>\\n        <span class=\\"token function\\">moveToHead</span><span class=\\"token punctuation\\">(</span>node<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">return</span> node<span class=\\"token punctuation\\">.</span>value<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    \\n    <span class=\\"token doc-comment comment\\">/**\\n     * 1. 如果key不存在, 创建一个新节点并在链表头部添加该节点, 判断链表长度是否超出容量限制, 若超出容量, 则删除链表尾部结点\\n     * 2. 如果key存在, 覆盖旧值, 将节点移动到头部\\n     * <span class=\\"token keyword\\">@param</span> <span class=\\"token parameter\\">key</span>\\n     * <span class=\\"token keyword\\">@param</span> <span class=\\"token parameter\\">value</span>\\n     */</span>\\n    <span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">void</span> <span class=\\"token function\\">put</span><span class=\\"token punctuation\\">(</span><span class=\\"token keyword\\">int</span> key<span class=\\"token punctuation\\">,</span> <span class=\\"token keyword\\">int</span> value<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token class-name\\">DLinkedNode</span> node <span class=\\"token operator\\">=</span> cache<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">get</span><span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">if</span> <span class=\\"token punctuation\\">(</span>node <span class=\\"token operator\\">==</span> <span class=\\"token keyword\\">null</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n            <span class=\\"token comment\\">// node不存在, 则创建一个新节点</span>\\n            <span class=\\"token class-name\\">DLinkedNode</span> newNode <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">DLinkedNode</span><span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">,</span> value<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n            <span class=\\"token comment\\">// 添加进哈希表</span>\\n            cache<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">put</span><span class=\\"token punctuation\\">(</span>key<span class=\\"token punctuation\\">,</span> newNode<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n            <span class=\\"token comment\\">// 添加到链表头部, 表示最近访问</span>\\n            <span class=\\"token function\\">addToHead</span><span class=\\"token punctuation\\">(</span>newNode<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n            <span class=\\"token comment\\">// 链表长度加1</span>\\n            <span class=\\"token operator\\">++</span>size<span class=\\"token punctuation\\">;</span>\\n            <span class=\\"token comment\\">// 如果超出缓存容量</span>\\n            <span class=\\"token keyword\\">if</span> <span class=\\"token punctuation\\">(</span>size <span class=\\"token operator\\">&gt;</span> capacity<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n                <span class=\\"token comment\\">// 删除链表最后一个结点, 去掉最长时间未访问的</span>\\n                <span class=\\"token class-name\\">DLinkedNode</span> tail <span class=\\"token operator\\">=</span> <span class=\\"token function\\">removeTail</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n                <span class=\\"token comment\\">// 去掉哈希表中对应节点</span>\\n                cache<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">remove</span><span class=\\"token punctuation\\">(</span>tail<span class=\\"token punctuation\\">.</span>key<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n                <span class=\\"token comment\\">// 减小链表长度</span>\\n                <span class=\\"token operator\\">--</span>size<span class=\\"token punctuation\\">;</span>\\n            <span class=\\"token punctuation\\">}</span>\\n        <span class=\\"token punctuation\\">}</span> <span class=\\"token keyword\\">else</span> <span class=\\"token punctuation\\">{</span>\\n            <span class=\\"token comment\\">// 如果缓存中有</span>\\n            <span class=\\"token comment\\">// 先覆盖旧值</span>\\n            node<span class=\\"token punctuation\\">.</span>value <span class=\\"token operator\\">=</span> value<span class=\\"token punctuation\\">;</span>\\n            <span class=\\"token comment\\">// 再将节点移到链表头部, 表示最近访问</span>\\n            <span class=\\"token function\\">moveToHead</span><span class=\\"token punctuation\\">(</span>node<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token punctuation\\">}</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    \\n    <span class=\\"token doc-comment comment\\">/**\\n     * 添加一个结点需要修改四条链\\n     * <span class=\\"token keyword\\">@param</span> <span class=\\"token parameter\\">node</span>\\n     */</span>\\n    <span class=\\"token keyword\\">private</span> <span class=\\"token keyword\\">void</span> <span class=\\"token function\\">addToHead</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">DLinkedNode</span> node<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        node<span class=\\"token punctuation\\">.</span>prev <span class=\\"token operator\\">=</span> head<span class=\\"token punctuation\\">;</span>\\n        node<span class=\\"token punctuation\\">.</span>next <span class=\\"token operator\\">=</span> head<span class=\\"token punctuation\\">.</span>next<span class=\\"token punctuation\\">;</span>\\n        head<span class=\\"token punctuation\\">.</span>next<span class=\\"token punctuation\\">.</span>prev <span class=\\"token operator\\">=</span> node<span class=\\"token punctuation\\">;</span>\\n        head<span class=\\"token punctuation\\">.</span>next <span class=\\"token operator\\">=</span> node<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    \\n    <span class=\\"token doc-comment comment\\">/**\\n     * 删除一个结点需要修改两条链\\n     * <span class=\\"token keyword\\">@param</span> <span class=\\"token parameter\\">node</span>\\n     */</span>\\n    <span class=\\"token keyword\\">private</span> <span class=\\"token keyword\\">void</span> <span class=\\"token function\\">removeNode</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">DLinkedNode</span> node<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        node<span class=\\"token punctuation\\">.</span>prev<span class=\\"token punctuation\\">.</span>next <span class=\\"token operator\\">=</span> node<span class=\\"token punctuation\\">.</span>next<span class=\\"token punctuation\\">;</span>\\n        node<span class=\\"token punctuation\\">.</span>next<span class=\\"token punctuation\\">.</span>prev <span class=\\"token operator\\">=</span> node<span class=\\"token punctuation\\">.</span>prev<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    \\n    <span class=\\"token doc-comment comment\\">/**\\n     * 把结点移到头部\\n     */</span>\\n    <span class=\\"token keyword\\">private</span> <span class=\\"token keyword\\">void</span> <span class=\\"token function\\">moveToHead</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">DLinkedNode</span> node<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token comment\\">// 先删除节点</span>\\n        <span class=\\"token function\\">removeNode</span><span class=\\"token punctuation\\">(</span>node<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token comment\\">// 再将该节点移到头部</span>\\n        <span class=\\"token function\\">addToHead</span><span class=\\"token punctuation\\">(</span>node<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    \\n    <span class=\\"token doc-comment comment\\">/**\\n     * 删除尾结点并返回\\n     */</span>\\n    <span class=\\"token keyword\\">private</span> <span class=\\"token class-name\\">DLinkedNode</span> <span class=\\"token function\\">removeTail</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token class-name\\">DLinkedNode</span> last <span class=\\"token operator\\">=</span> tail<span class=\\"token punctuation\\">.</span>prev<span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token function\\">removeNode</span><span class=\\"token punctuation\\">(</span>last<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">return</span> last<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    \\n    <span class=\\"token keyword\\">public</span> <span class=\\"token keyword\\">void</span> <span class=\\"token function\\">print</span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token class-name\\">DLinkedNode</span> cur <span class=\\"token operator\\">=</span> head<span class=\\"token punctuation\\">.</span>next<span class=\\"token punctuation\\">;</span>\\n        <span class=\\"token keyword\\">while</span> <span class=\\"token punctuation\\">(</span>cur <span class=\\"token operator\\">!=</span> <span class=\\"token keyword\\">null</span> <span class=\\"token operator\\">&amp;&amp;</span> cur<span class=\\"token punctuation\\">.</span>next <span class=\\"token operator\\">!=</span> <span class=\\"token keyword\\">null</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n            <span class=\\"token class-name\\">System</span><span class=\\"token punctuation\\">.</span>out<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">println</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"key: \\"</span> <span class=\\"token operator\\">+</span> cur<span class=\\"token punctuation\\">.</span>key <span class=\\"token operator\\">+</span> <span class=\\"token string\\">\\"; value: \\"</span> <span class=\\"token operator\\">+</span> cur<span class=\\"token punctuation\\">.</span>value<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n            cur <span class=\\"token operator\\">=</span> cur<span class=\\"token punctuation\\">.</span>next<span class=\\"token punctuation\\">;</span>\\n            \\n        <span class=\\"token punctuation\\">}</span>\\n        <span class=\\"token class-name\\">System</span><span class=\\"token punctuation\\">.</span>out<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">println</span><span class=\\"token punctuation\\">(</span><span class=\\"token string\\">\\"-----------------\\"</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n<span class=\\"token punctuation\\">}</span>\\n\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{n as data};
