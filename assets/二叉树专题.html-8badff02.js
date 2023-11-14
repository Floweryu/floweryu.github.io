const e=JSON.parse('{"key":"v-d421f530","path":"/posts/algorithm/%E4%BA%8C%E5%8F%89%E6%A0%91%E4%B8%93%E9%A2%98.html","title":"二叉树专题","lang":"zh-CN","frontmatter":{"title":"二叉树专题","date":"2023-07-09T19:00:00.000Z","category":["算法"],"tag":["二叉树"],"description":"二叉树的遍历 https://leetcode.cn/problems/binary-tree-preorder-traversal/description/ 给你二叉树的根节点 root ，返回它节点值的 前序 遍历。 二叉树前序遍历： private List&lt;Integer&gt; res = new ArrayList&lt;&gt;(); public List&lt;Integer&gt; preorderTraversal(TreeNode root) { if (root == null) { return res; } res.add(root.val); preorderTraversal(root.left); preorderTraversal(root.right); return res; }","head":[["meta",{"property":"og:url","content":"https://floweryu.top/posts/algorithm/%E4%BA%8C%E5%8F%89%E6%A0%91%E4%B8%93%E9%A2%98.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"二叉树专题"}],["meta",{"property":"og:description","content":"二叉树的遍历 https://leetcode.cn/problems/binary-tree-preorder-traversal/description/ 给你二叉树的根节点 root ，返回它节点值的 前序 遍历。 二叉树前序遍历： private List&lt;Integer&gt; res = new ArrayList&lt;&gt;(); public List&lt;Integer&gt; preorderTraversal(TreeNode root) { if (root == null) { return res; } res.add(root.val); preorderTraversal(root.left); preorderTraversal(root.right); return res; }"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:30:42.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"二叉树"}],["meta",{"property":"article:published_time","content":"2023-07-09T19:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:30:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"二叉树专题\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-07-09T19:00:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:30:42.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://floweryu.top\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"二叉树的遍历","slug":"二叉树的遍历","link":"#二叉树的遍历","children":[]},{"level":2,"title":"剑指 Offer 32 - III. 从上到下打印二叉树 III","slug":"剑指-offer-32-iii-从上到下打印二叉树-iii","link":"#剑指-offer-32-iii-从上到下打印二叉树-iii","children":[]},{"level":2,"title":"剑指 Offer 55 - I. 二叉树的深度","slug":"剑指-offer-55-i-二叉树的深度","link":"#剑指-offer-55-i-二叉树的深度","children":[{"level":3,"title":"题解：递归","slug":"题解-递归","link":"#题解-递归","children":[]}]},{"level":2,"title":"剑指 Offer 34. 二叉树中和为某一值的路径","slug":"剑指-offer-34-二叉树中和为某一值的路径","link":"#剑指-offer-34-二叉树中和为某一值的路径","children":[]},{"level":2,"title":"剑指 Offer 36. 二叉搜索树与双向链表","slug":"剑指-offer-36-二叉搜索树与双向链表","link":"#剑指-offer-36-二叉搜索树与双向链表","children":[]},{"level":2,"title":"剑指 Offer 28. 对称的二叉树","slug":"剑指-offer-28-对称的二叉树","link":"#剑指-offer-28-对称的二叉树","children":[]},{"level":2,"title":"617. 合并二叉树","slug":"_617-合并二叉树","link":"#_617-合并二叉树","children":[]},{"level":2,"title":"剑指 Offer 27. 二叉树的镜像","slug":"剑指-offer-27-二叉树的镜像","link":"#剑指-offer-27-二叉树的镜像","children":[]},{"level":2,"title":"98. 验证二叉搜索树","slug":"_98-验证二叉搜索树","link":"#_98-验证二叉搜索树","children":[]},{"level":2,"title":"剑指 Offer 55 - II. 平衡二叉树","slug":"剑指-offer-55-ii-平衡二叉树","link":"#剑指-offer-55-ii-平衡二叉树","children":[]},{"level":2,"title":"剑指 Offer 68 - I. 二叉搜索树的最近公共祖先","slug":"剑指-offer-68-i-二叉搜索树的最近公共祖先","link":"#剑指-offer-68-i-二叉搜索树的最近公共祖先","children":[]},{"level":2,"title":"剑指 Offer 37. 序列化二叉树","slug":"剑指-offer-37-序列化二叉树","link":"#剑指-offer-37-序列化二叉树","children":[]},{"level":2,"title":"剑指 Offer 07. 重建二叉树","slug":"剑指-offer-07-重建二叉树","link":"#剑指-offer-07-重建二叉树","children":[]},{"level":2,"title":"剑指 Offer II 046. 二叉树的右侧视图","slug":"剑指-offer-ii-046-二叉树的右侧视图","link":"#剑指-offer-ii-046-二叉树的右侧视图","children":[]}],"git":{"createdTime":1699954242000,"updatedTime":1699954242000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":16.37,"words":4912},"filePathRelative":"posts/algorithm/二叉树专题.md","localizedDate":"2023年7月9日","excerpt":"<h2> 二叉树的遍历</h2>\\n<blockquote>\\n<p>https://leetcode.cn/problems/binary-tree-preorder-traversal/description/</p>\\n<p>给你二叉树的根节点 <code>root</code> ，返回它节点值的 <strong>前序</strong> 遍历。</p>\\n</blockquote>\\n<h4> 二叉树前序遍历：</h4>\\n<div class=\\"language-java line-numbers-mode\\" data-ext=\\"java\\"><pre class=\\"language-java\\"><code><span class=\\"token keyword\\">private</span> <span class=\\"token class-name\\">List</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token class-name\\">Integer</span><span class=\\"token punctuation\\">&gt;</span></span> res <span class=\\"token operator\\">=</span> <span class=\\"token keyword\\">new</span> <span class=\\"token class-name\\">ArrayList</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token punctuation\\">&gt;</span></span><span class=\\"token punctuation\\">(</span><span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n\\n<span class=\\"token keyword\\">public</span> <span class=\\"token class-name\\">List</span><span class=\\"token generics\\"><span class=\\"token punctuation\\">&lt;</span><span class=\\"token class-name\\">Integer</span><span class=\\"token punctuation\\">&gt;</span></span> <span class=\\"token function\\">preorderTraversal</span><span class=\\"token punctuation\\">(</span><span class=\\"token class-name\\">TreeNode</span> root<span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n    <span class=\\"token keyword\\">if</span> <span class=\\"token punctuation\\">(</span>root <span class=\\"token operator\\">==</span> <span class=\\"token keyword\\">null</span><span class=\\"token punctuation\\">)</span> <span class=\\"token punctuation\\">{</span>\\n        <span class=\\"token keyword\\">return</span> res<span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token punctuation\\">}</span>\\n    res<span class=\\"token punctuation\\">.</span><span class=\\"token function\\">add</span><span class=\\"token punctuation\\">(</span>root<span class=\\"token punctuation\\">.</span>val<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token function\\">preorderTraversal</span><span class=\\"token punctuation\\">(</span>root<span class=\\"token punctuation\\">.</span>left<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token function\\">preorderTraversal</span><span class=\\"token punctuation\\">(</span>root<span class=\\"token punctuation\\">.</span>right<span class=\\"token punctuation\\">)</span><span class=\\"token punctuation\\">;</span>\\n    <span class=\\"token keyword\\">return</span> res<span class=\\"token punctuation\\">;</span>\\n<span class=\\"token punctuation\\">}</span>\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div>","autoDesc":true}');export{e as data};
