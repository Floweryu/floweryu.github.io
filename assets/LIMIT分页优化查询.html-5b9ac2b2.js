const t=JSON.parse('{"key":"v-6f9e242a","path":"/middleware/mysql/LIMIT%E5%88%86%E9%A1%B5%E4%BC%98%E5%8C%96%E6%9F%A5%E8%AF%A2.html","title":"Mysql的limit原理及分页查询优化","lang":"zh-CN","frontmatter":{"title":"Mysql的limit原理及分页查询优化","date":"2023-07-12T20:15:00.000Z","category":["MySQL"],"tag":["后端","原理"],"description":"在进行分页查询的时候，通常会使用LIMIT加偏移量的办法实现，但当偏移量非常大的时候，例如：LIMIT 10000， 20这样的查询，这是MySQL需要查询10020条记录然后只返回20条，前面的10000条都将会抛弃。这样的代价就非常高。 优化上述查询，有两种方案供选择： 在页面中限制分页的数量 优化大偏移量的性能 使用索引覆盖扫描，不查询所有的列，然后根据需要进行一次关联，再返回所需的列 例如下面查询：","head":[["meta",{"property":"og:url","content":"https://floweryu.top/middleware/mysql/LIMIT%E5%88%86%E9%A1%B5%E4%BC%98%E5%8C%96%E6%9F%A5%E8%AF%A2.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"Mysql的limit原理及分页查询优化"}],["meta",{"property":"og:description","content":"在进行分页查询的时候，通常会使用LIMIT加偏移量的办法实现，但当偏移量非常大的时候，例如：LIMIT 10000， 20这样的查询，这是MySQL需要查询10020条记录然后只返回20条，前面的10000条都将会抛弃。这样的代价就非常高。 优化上述查询，有两种方案供选择： 在页面中限制分页的数量 优化大偏移量的性能 使用索引覆盖扫描，不查询所有的列，然后根据需要进行一次关联，再返回所需的列 例如下面查询："}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:47:27.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"原理"}],["meta",{"property":"article:published_time","content":"2023-07-12T20:15:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:47:27.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"Mysql的limit原理及分页查询优化\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-07-12T20:15:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:47:27.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://floweryu.top\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[],"git":{"createdTime":1699955247000,"updatedTime":1699955247000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":1.6,"words":480},"filePathRelative":"middleware/mysql/LIMIT分页优化查询.md","localizedDate":"2023年7月12日","excerpt":"<blockquote>\\n<p>在进行分页查询的时候，通常会使用LIMIT加偏移量的办法实现，但当偏移量非常大的时候，例如：LIMIT 10000， 20这样的查询，这是MySQL需要查询10020条记录然后只返回20条，前面的10000条都将会抛弃。这样的代价就非常高。</p>\\n</blockquote>\\n<p>优化上述查询，有两种方案供选择：</p>\\n<ul>\\n<li>在页面中限制分页的数量</li>\\n<li>优化大偏移量的性能</li>\\n</ul>\\n<p><strong>使用索引覆盖扫描，不查询所有的列，然后根据需要进行一次关联，再返回所需的列</strong></p>\\n<p>例如下面查询：</p>","autoDesc":true}');export{t as data};
