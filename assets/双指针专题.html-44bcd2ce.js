const e=JSON.parse(`{"key":"v-54c04637","path":"/posts/algorithm/%E5%8F%8C%E6%8C%87%E9%92%88%E4%B8%93%E9%A2%98.html","title":"双指针专题","lang":"zh-CN","frontmatter":{"title":"双指针专题","date":"2023-07-09T19:00:00.000Z","category":["算法"],"tag":["双指针"],"description":"165. 比较版本号 https://leetcode.cn/problems/compare-version-numbers/description/ 给你两个版本号 version1 和 version2 ，请你比较它们。 版本号由一个或多个修订号组成，各修订号由一个 '.' 连接。每个修订号由 多位数字 组成，可能包含 前导零 。每个版本号至少包含一个字符。修订号从左到右编号，下标从 0 开始，最左边的修订号下标为 0 ，下一个修订号下标为 1 ，以此类推。例如，2.5.33 和 0.1 都是有效的版本号。 比较版本号时，请按从左到右的顺序依次比较它们的修订号。比较修订号时，只需比较 忽略任何前导零后的整数值 。也就是说，修订号 1 和修订号 001 相等 。如果版本号没有指定某个下标处的修订号，则该修订号视为 0 。例如，版本 1.0 小于版本 1.1 ，因为它们下标为 0 的修订号相同，而下标为 1 的修订号分别为 0 和 1 ，0 &lt; 1 。 返回规则如下： 如果 *version1* &gt; *version2* 返回 1， 如果 *version1* &lt; *version2* 返回 -1， 除此之外返回 0。 输入：version1 = \\"1.01\\", version2 = \\"1.001\\" 输出：0 解释：忽略前导零，\\"01\\" 和 \\"001\\" 都表示相同的整数 \\"1\\" 输入：version1 = \\"1.0\\", version2 = \\"1.0.0\\" 输出：0 解释：version1 没有指定下标为 2 的修订号，即视为 \\"0\\" 输入：version1 = \\"0.1\\", version2 = \\"1.1\\" 输出：-1 解释：version1 中下标为 0 的修订号是 \\"0\\"，version2 中下标为 0 的修订号是 \\"1\\" 。0 &lt; 1，所以 version1 &lt; version2","head":[["meta",{"property":"og:url","content":"https://floweryu.top/posts/algorithm/%E5%8F%8C%E6%8C%87%E9%92%88%E4%B8%93%E9%A2%98.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"双指针专题"}],["meta",{"property":"og:description","content":"165. 比较版本号 https://leetcode.cn/problems/compare-version-numbers/description/ 给你两个版本号 version1 和 version2 ，请你比较它们。 版本号由一个或多个修订号组成，各修订号由一个 '.' 连接。每个修订号由 多位数字 组成，可能包含 前导零 。每个版本号至少包含一个字符。修订号从左到右编号，下标从 0 开始，最左边的修订号下标为 0 ，下一个修订号下标为 1 ，以此类推。例如，2.5.33 和 0.1 都是有效的版本号。 比较版本号时，请按从左到右的顺序依次比较它们的修订号。比较修订号时，只需比较 忽略任何前导零后的整数值 。也就是说，修订号 1 和修订号 001 相等 。如果版本号没有指定某个下标处的修订号，则该修订号视为 0 。例如，版本 1.0 小于版本 1.1 ，因为它们下标为 0 的修订号相同，而下标为 1 的修订号分别为 0 和 1 ，0 &lt; 1 。 返回规则如下： 如果 *version1* &gt; *version2* 返回 1， 如果 *version1* &lt; *version2* 返回 -1， 除此之外返回 0。 输入：version1 = \\"1.01\\", version2 = \\"1.001\\" 输出：0 解释：忽略前导零，\\"01\\" 和 \\"001\\" 都表示相同的整数 \\"1\\" 输入：version1 = \\"1.0\\", version2 = \\"1.0.0\\" 输出：0 解释：version1 没有指定下标为 2 的修订号，即视为 \\"0\\" 输入：version1 = \\"0.1\\", version2 = \\"1.1\\" 输出：-1 解释：version1 中下标为 0 的修订号是 \\"0\\"，version2 中下标为 0 的修订号是 \\"1\\" 。0 &lt; 1，所以 version1 &lt; version2"}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:30:42.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"双指针"}],["meta",{"property":"article:published_time","content":"2023-07-09T19:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:30:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"双指针专题\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-07-09T19:00:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:30:42.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://floweryu.top\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"165. 比较版本号","slug":"_165-比较版本号","link":"#_165-比较版本号","children":[{"level":3,"title":"题解一：字符串分割","slug":"题解一-字符串分割","link":"#题解一-字符串分割","children":[]}]}],"git":{"createdTime":1699954242000,"updatedTime":1699954242000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":1.99,"words":596},"filePathRelative":"posts/algorithm/双指针专题.md","localizedDate":"2023年7月9日","excerpt":"<h2> 165. 比较版本号</h2>\\n<blockquote>\\n<p>https://leetcode.cn/problems/compare-version-numbers/description/</p>\\n<p>给你两个版本号 <code>version1</code> 和 <code>version2</code> ，请你比较它们。</p>\\n<p>版本号由一个或多个修订号组成，各修订号由一个 <code>'.'</code> 连接。每个修订号由 <strong>多位数字</strong> 组成，可能包含 <strong>前导零</strong> 。每个版本号至少包含一个字符。修订号从左到右编号，下标从 0 开始，最左边的修订号下标为 0 ，下一个修订号下标为 1 ，以此类推。例如，<code>2.5.33</code> 和 <code>0.1</code> 都是有效的版本号。</p>\\n<p>比较版本号时，请按从左到右的顺序依次比较它们的修订号。比较修订号时，只需比较 <strong>忽略任何前导零后的整数值</strong> 。也就是说，修订号 <code>1</code> 和修订号 <code>001</code> <strong>相等</strong> 。如果版本号没有指定某个下标处的修订号，则该修订号视为 <code>0</code> 。例如，版本 <code>1.0</code> 小于版本 <code>1.1</code> ，因为它们下标为 <code>0</code> 的修订号相同，而下标为 <code>1</code> 的修订号分别为 <code>0</code> 和 <code>1</code> ，<code>0 &lt; 1</code> 。</p>\\n<p>返回规则如下：</p>\\n<ul>\\n<li>如果 <code>*version1* &gt; *version2*</code> 返回 <code>1</code>，</li>\\n<li>如果 <code>*version1* &lt; *version2*</code> 返回 <code>-1</code>，</li>\\n<li>除此之外返回 <code>0</code>。</li>\\n</ul>\\n<div class=\\"language-text line-numbers-mode\\" data-ext=\\"text\\"><pre class=\\"language-text\\"><code>输入：version1 = \\"1.01\\", version2 = \\"1.001\\"\\n输出：0\\n解释：忽略前导零，\\"01\\" 和 \\"001\\" 都表示相同的整数 \\"1\\"\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div><div class=\\"language-text line-numbers-mode\\" data-ext=\\"text\\"><pre class=\\"language-text\\"><code>输入：version1 = \\"1.0\\", version2 = \\"1.0.0\\"\\n输出：0\\n解释：version1 没有指定下标为 2 的修订号，即视为 \\"0\\"\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div><div class=\\"language-text line-numbers-mode\\" data-ext=\\"text\\"><pre class=\\"language-text\\"><code>输入：version1 = \\"0.1\\", version2 = \\"1.1\\"\\n输出：-1\\n解释：version1 中下标为 0 的修订号是 \\"0\\"，version2 中下标为 0 的修订号是 \\"1\\" 。0 &lt; 1，所以 version1 &lt; version2\\n</code></pre><div class=\\"line-numbers\\" aria-hidden=\\"true\\"><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div><div class=\\"line-number\\"></div></div></div></blockquote>","autoDesc":true}`);export{e as data};
