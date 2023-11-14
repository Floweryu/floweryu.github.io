const e=JSON.parse('{"key":"v-0fa8504e","path":"/java/JVM%E5%8F%82%E6%95%B0%E8%AF%A6%E8%A7%A3.html","title":"JVM参数详解","lang":"zh-CN","frontmatter":{"title":"JVM参数详解","date":"2023-10-22T13:00:00.000Z","category":["Java"],"tag":["后端","JVM"],"description":"-XX:+UseConcMarkSweepGC 打开此开关后，使用 CMS + ParNew + Serial Old 收集器组合来进行内存回收。 并发标记清除收集器是以获取最短停顿时间为目标。 开启后，年轻代使用 ParNew 收集器；老年代使用 CMS 收集器，如果 CMS 产生的碎片过多，导致无法存放浮动垃圾，JVM 会出现 Concurrent...","head":[["meta",{"property":"og:url","content":"https://floweryu.top/java/JVM%E5%8F%82%E6%95%B0%E8%AF%A6%E8%A7%A3.html"}],["meta",{"property":"og:site_name","content":"Floweryu"}],["meta",{"property":"og:title","content":"JVM参数详解"}],["meta",{"property":"og:description","content":"-XX:+UseConcMarkSweepGC 打开此开关后，使用 CMS + ParNew + Serial Old 收集器组合来进行内存回收。 并发标记清除收集器是以获取最短停顿时间为目标。 开启后，年轻代使用 ParNew 收集器；老年代使用 CMS 收集器，如果 CMS 产生的碎片过多，导致无法存放浮动垃圾，JVM 会出现 Concurrent..."}],["meta",{"property":"og:type","content":"article"}],["meta",{"property":"og:locale","content":"zh-CN"}],["meta",{"property":"og:updated_time","content":"2023-11-14T09:30:42.000Z"}],["meta",{"property":"article:author","content":"Floweryu"}],["meta",{"property":"article:tag","content":"后端"}],["meta",{"property":"article:tag","content":"JVM"}],["meta",{"property":"article:published_time","content":"2023-10-22T13:00:00.000Z"}],["meta",{"property":"article:modified_time","content":"2023-11-14T09:30:42.000Z"}],["script",{"type":"application/ld+json"},"{\\"@context\\":\\"https://schema.org\\",\\"@type\\":\\"Article\\",\\"headline\\":\\"JVM参数详解\\",\\"image\\":[\\"\\"],\\"datePublished\\":\\"2023-10-22T13:00:00.000Z\\",\\"dateModified\\":\\"2023-11-14T09:30:42.000Z\\",\\"author\\":[{\\"@type\\":\\"Person\\",\\"name\\":\\"Floweryu\\",\\"url\\":\\"https://github.com/Floweryu/floweryu.github.io\\",\\"email\\":\\"869830837@qq.com\\"}]}"]]},"headers":[{"level":2,"title":"-XX:+UseConcMarkSweepGC","slug":"xx-useconcmarksweepgc","link":"#xx-useconcmarksweepgc","children":[]},{"level":2,"title":"-XX:+UseAdaptiveSizePolicy","slug":"xx-useadaptivesizepolicy","link":"#xx-useadaptivesizepolicy","children":[]},{"level":2,"title":"-XX:+CMSClassUnloadingEnabled","slug":"xx-cmsclassunloadingenabled","link":"#xx-cmsclassunloadingenabled","children":[]},{"level":2,"title":"-XX:+UseCMSCompactAtFullCollection","slug":"xx-usecmscompactatfullcollection","link":"#xx-usecmscompactatfullcollection","children":[]},{"level":2,"title":"-XX: CMSFullGCsBeforeCompaction=n","slug":"xx-cmsfullgcsbeforecompaction-n","link":"#xx-cmsfullgcsbeforecompaction-n","children":[]},{"level":2,"title":"-XX:+DisableExplicitGC","slug":"xx-disableexplicitgc","link":"#xx-disableexplicitgc","children":[]},{"level":2,"title":"-XX:CMSMaxAbortablePrecleanTime","slug":"xx-cmsmaxabortableprecleantime","link":"#xx-cmsmaxabortableprecleantime","children":[]},{"level":2,"title":"-XX:+HeapDumpOnOutOfMemoryError","slug":"xx-heapdumponoutofmemoryerror","link":"#xx-heapdumponoutofmemoryerror","children":[]},{"level":2,"title":"-XX:+PrintGCDetails","slug":"xx-printgcdetails","link":"#xx-printgcdetails","children":[]},{"level":2,"title":"-XX:+PrintGCDateStamps","slug":"xx-printgcdatestamps","link":"#xx-printgcdatestamps","children":[]},{"level":2,"title":"-XX:CMSInitiatingOccupancyFraction=70","slug":"xx-cmsinitiatingoccupancyfraction-70","link":"#xx-cmsinitiatingoccupancyfraction-70","children":[]},{"level":2,"title":"-XX:+UseCMSInitiatingOccupancyOnly","slug":"xx-usecmsinitiatingoccupancyonly","link":"#xx-usecmsinitiatingoccupancyonly","children":[]}],"git":{"createdTime":1699954242000,"updatedTime":1699954242000,"contributors":[{"name":"zhangjunfeng","email":"im.zhangjunfeng@qq.com","commits":1}]},"readingTime":{"minutes":3.77,"words":1132},"filePathRelative":"java/JVM参数详解.md","localizedDate":"2023年10月22日","autoDesc":true}');export{e as data};
