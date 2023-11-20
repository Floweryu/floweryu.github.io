import{_ as d}from"./plugin-vue_export-helper-c27b6911.js";import{r as s,o as r,c as t,b as e,d as i,e as n,a}from"./app-4857b6b0.js";const l="/assets/LPN9gcpd58yJAsG-6a286836.png",c="/assets/image-20231115202641638-4e4f6fbc.png",p="/assets/image-20231115203225347-a20c7ccc.png",g="/assets/image-20231115205550491-f9c630ce.png",h="/assets/image-20231119131028701-e838d710.png",u="/assets/image-20231119135006679-8d7f41fd.png",f="/assets/89nPHosa2hpzLmX-dddcee76.png",b="/assets/image-20231119144608138-012cf1c9.png",m="/assets/image-20231119144642033-7c2012c3.png",R="/assets/7kjYPBV6xwe2UNC-3c25bbbc.png",_="/assets/xe6FMNyjmBwIbGi-f3eca6ef.png",A="/assets/tH5gQskyvZaX1cq-b5896f27.png",v="/assets/tblpo7wmIUfGzjE-be65fc8f.png",B="/assets/OiWZSKRYubopGBf-92ce1b63.png",O="/assets/image-20231119154711639-7c5a6ee9.png",k="/assets/image-20231120224414429-97fc8452.png",x="/assets/image-20231120225412695-f2edfbe3.png",F="/assets/image-20231120230433792-6cec21a6.png",y="/assets/image-20231120231232249-25c309ae.png",D="/assets/image-20231120231644331-7f528a60.png",E="/assets/image-20231119160133493-0114afb1.png",S={},q=a('<h2 id="缓存击穿-缓存穿透-缓存雪崩" tabindex="-1"><a class="header-anchor" href="#缓存击穿-缓存穿透-缓存雪崩" aria-hidden="true">#</a> 缓存击穿/缓存穿透/缓存雪崩</h2><h3 id="缓存穿透" tabindex="-1"><a class="header-anchor" href="#缓存穿透" aria-hidden="true">#</a> 缓存穿透</h3><p>缓存穿透是指用户请求的数据在缓存中不存在即没有命中，同时在数据库中也不存在，导致用户每次请求该数据都要去数据库中查询一遍，然后返回空。</p><p>如果有恶意攻击者不断请求系统中不存在的数据，会导致短时间大量请求落在数据库上，造成数据库压力过大，甚至击垮数据库系统。</p><h4 id="布隆过滤器" tabindex="-1"><a class="header-anchor" href="#布隆过滤器" aria-hidden="true">#</a> 布隆过滤器</h4><p>布隆过滤器（Bloom Filter，简称BF）由Burton Howard Bloom在1970年提出，是一种空间效率高的概率型数据结构。</p><p>布隆过滤器专门用来检测集合中是否存在特定的元素。</p><p>如果在平时我们要判断一个元素是否在一个集合中，通常会采用查找比较的方法，下面分析不同的数据结构查找效率：</p><ul><li>采用线性表存储，查找时间复杂度为O(N)</li><li>采用平衡二叉排序树（AVL、红黑树）存储，查找时间复杂度为O(logN)</li><li>采用哈希表存储，考虑到哈希碰撞，整体时间复杂度也要O[log(n/m)]</li></ul><p>当需要判断一个元素是否存在于海量数据集合中，不仅查找时间慢，还会占用大量存储空间。接下来看一下布隆过滤器如何解决这个问题。</p><p><strong>布隆过滤器设计思想</strong></p><p>布隆过滤器由一个长度为m比特的位数组（bit array）与k个哈希函数（hash function）组成的数据结构。位数组初始化均为0，所有的哈希函数都可以分别把输入数据尽量均匀地散列。</p><p>当要向布隆过滤器中插入一个元素时，该元素经过k个哈希函数计算产生k个哈希值，以哈希值作为位数组中的下标，将所有k个对应的比特值由0置为1。</p><p>当要查询一个元素时，同样将其经过哈希函数计算产生哈希值，然后检查对应的k个比特值：如果有任意一个比特为0，表明该元素一定不在集合中；如果所有比特均为1，表明该集合有可能性在集合中。</p><p>为什么不是一定在集合中呢？因为不同的元素计算的哈希值有可能一样，会出现哈希碰撞，导致一个不存在的元素有可能对应的比特位为1，这就是所谓“假阳性”（false positive）。相对地，“假阴性”（false negative）在BF中是绝不会出现的。</p><p>总结一下：<strong>布隆过滤器认为不在的，一定不会在集合中；布隆过滤器认为在的，可能在也可能不在集合中。</strong></p><p><strong>例子</strong></p><p>举个例子：下图是一个布隆过滤器，共有18个比特位，3个哈希函数。集合中三个元素x，y，z通过三个哈希函数散列到不同的比特位，并将比特位置为1。当查询元素w时，通过三个哈希函数计算，发现有一个比特位的值为0，可以肯定认为该元素不在集合中。</p><figure><img src="'+l+'" alt="图片" tabindex="0" loading="lazy"><figcaption>图片</figcaption></figure><p><strong>布隆过滤器优缺点</strong></p><p>优点：</p><ul><li>节省空间：不需要存储数据本身，只需要存储数据对应hash比特位</li><li>时间复杂度低：插入和查找的时间复杂度都为O(k)，k为哈希函数的个数</li></ul><p>缺点：</p><ul><li>存在假阳性：布隆过滤器判断存在，可能出现元素不在集合中；判断准确率取决于哈希函数的个数</li><li>不能删除元素：如果一个元素被删除，但是却不能从布隆过滤器中删除，这也是造成假阳性的原因了</li></ul><p>布隆过滤器适用场景</p><ul><li>爬虫系统url去重</li><li>垃圾邮件过滤</li><li>黑名单</li></ul><h4 id="缓存空对象" tabindex="-1"><a class="header-anchor" href="#缓存空对象" aria-hidden="true">#</a> 缓存空对象</h4><p>当缓存未命中，查询持久层也为空，可以将返回的空对象写到缓存中，这样下次请求该key时直接从缓存中查询返回空对象，请求不会落到持久层数据库。为了避免存储过多空对象，通常会给空对象设置一个过期时间。</p><p>这种方法会存在两个问题：</p><ul><li>如果有大量的key穿透，缓存空对象会占用宝贵的内存空间。</li><li>空对象的key设置了过期时间，在这段时间可能会存在缓存和持久层数据不一致的场景。可以参考这篇文章保证缓存和数据库的一致性: https://juejin.cn/post/7246365103783329847</li></ul><h3 id="缓存击穿" tabindex="-1"><a class="header-anchor" href="#缓存击穿" aria-hidden="true">#</a> 缓存击穿</h3><p>缓存击穿，是指一个key非常热点，在不停的扛着大并发，大并发集中对这一个点进行访问，当这个key在失效的瞬间，持续的大并发就穿破缓存，直接请求数据库，就像在一个屏障上凿开了一个洞。</p><p><strong>缓存击穿危害</strong>：数据库瞬时压力骤增，造成大量请求阻塞。</p><h4 id="使用互斥锁-mutex-key" tabindex="-1"><a class="header-anchor" href="#使用互斥锁-mutex-key" aria-hidden="true">#</a> 使用互斥锁（mutex key）</h4><p>让一个线程回写缓存，其他线程等待回写缓存线程执行完，重新读缓存即可。</p><p>同一时间只有一个线程读数据库然后回写缓存，其他线程都处于阻塞状态。如果是高并发场景，大量线程阻塞势必会降低吞吐量。</p><h4 id="热点数据永不过期" tabindex="-1"><a class="header-anchor" href="#热点数据永不过期" aria-hidden="true">#</a> 热点数据永不过期</h4><p>永不过期实际包含两层意思：</p><ul><li>物理不过期，针对热点key不设置过期时间</li><li>逻辑过期，把过期时间存在key对应的value里，如果发现要过期了，通过一个后台的异步线程进行缓存的构建</li></ul><p>不足的就是构建缓存时候，其余线程(非构建缓存的线程)可能访问的是老数据，对于不追求严格强一致性的系统是可以接受的。</p><h3 id="缓存雪崩" tabindex="-1"><a class="header-anchor" href="#缓存雪崩" aria-hidden="true">#</a> 缓存雪崩</h3><p>缓存雪崩是指缓存中数据大批量到过期时间，而查询数据量巨大，请求直接落到数据库上，引起数据库压力过大甚至宕机。</p><p>和缓存击穿不同的是，缓存击穿指并发查同一条数据，缓存雪崩是不同数据都过期了，很多数据都查不到从而查数据库。</p><h4 id="均匀过期" tabindex="-1"><a class="header-anchor" href="#均匀过期" aria-hidden="true">#</a> 均匀过期</h4><p>设置不同的过期时间，让缓存失效的时间点尽量均匀。通常可以为有效期增加随机值或者统一规划有效期。</p><h4 id="加互斥锁" tabindex="-1"><a class="header-anchor" href="#加互斥锁" aria-hidden="true">#</a> 加互斥锁</h4><p>跟缓存击穿解决思路一致，同一时间只让一个线程构建缓存，其他线程阻塞排队。</p><h4 id="缓存永不过期" tabindex="-1"><a class="header-anchor" href="#缓存永不过期" aria-hidden="true">#</a> 缓存永不过期</h4><p>跟缓存击穿解决思路一致，缓存在物理上永远不过期，用一个异步的线程更新缓存。</p><h4 id="双层缓存策略" tabindex="-1"><a class="header-anchor" href="#双层缓存策略" aria-hidden="true">#</a> 双层缓存策略</h4><p>使用主备两层缓存：</p><p>主缓存：有效期按照经验值设置，设置为主读取的缓存，主缓存失效后从数据库加载最新值。</p><p>备份缓存：有效期长，获取锁失败时读取的缓存，主缓存更新时需要同步更新备份缓存。</p><h3 id="缓存预热" tabindex="-1"><a class="header-anchor" href="#缓存预热" aria-hidden="true">#</a> 缓存预热</h3><p>缓存预热就是系统上线后，将相关的缓存数据直接加载到缓存系统，这样就可以避免在用户请求的时候，先查询数据库，然后再将数据回写到缓存。</p><p>如果不进行预热， 那么 Redis 初始状态数据为空，系统上线初期，对于高并发的流量，都会访问到数据库中， 对数据库造成流量的压力。</p><h4 id="缓存预热的操作方法" tabindex="-1"><a class="header-anchor" href="#缓存预热的操作方法" aria-hidden="true">#</a> 缓存预热的操作方法</h4><ul><li>数据量不大的时候，工程启动的时候进行加载缓存动作；</li><li>数据量大的时候，设置一个定时任务脚本，进行缓存的刷新；</li><li>数据量太大的时候，优先保证热点数据进行提前加载到缓存。</li></ul><h3 id="缓存降级" tabindex="-1"><a class="header-anchor" href="#缓存降级" aria-hidden="true">#</a> 缓存降级</h3><p>缓存降级是指缓存失效或缓存服务器挂掉的情况下，不去访问数据库，直接返回默认数据或访问服务的内存数据。</p><p>在项目实战中通常会将部分热点数据缓存到服务的内存中，这样一旦缓存出现异常，可以直接使用服务的内存数据，从而避免数据库遭受巨大压力。</p><p>降级一般是有损的操作，所以尽量减少降级对于业务的影响程度。</p><h2 id="redis-线程模型" tabindex="-1"><a class="header-anchor" href="#redis-线程模型" aria-hidden="true">#</a> Redis 线程模型</h2><p>Redis 的单线程是指对<strong>命令的执行</strong>是单线程，而 Redis 程序并不是单线程的：</p><ul><li><strong>Redis 在 2.6 版本</strong>：会启动 2 个后台线程，分别处理关闭文件、AOF 刷盘这两个任务。</li><li><strong>Redis 在 4.0 版本之后</strong>：新增了一个新的后台线程，用来异步释放 Redis 内存，也就是 lazyfree 线程。因此，当我们要删除一个大 key 的时候，不要使用 del 命令删除，因为 del 是在主线程处理的，这样会导致 Redis 主线程卡顿，因此我们应该使用 unlink 命令来异步删除大key。</li></ul><h3 id="redis-单线程为什么还这么快" tabindex="-1"><a class="header-anchor" href="#redis-单线程为什么还这么快" aria-hidden="true">#</a> Redis 单线程为什么还这么快</h3><ul><li>edis 的大部分操作<strong>都在内存中完成</strong>，因此 Redis 瓶颈可能是机器的内存或者网络带宽，而并非 CPU，既然 CPU 不是瓶颈，那么自然就采用单线程的解决方案了。</li><li>Redis 采用单线程模型可以<strong>避免了多线程之间的竞争</strong>，省去了多线程切换带来的时间和性能上的开销，而且也不会导致死锁问题。</li><li>Redis 采用了 <strong>I/O 多路复用机制</strong>处理大量的客户端 Socket 请求，IO 多路复用机制是指一个线程处理多个 IO 流，即 select/epoll 机制。简单来说，在 Redis 只运行单线程的情况下，该机制允许内核中，同时存在多个监听 Socket 和已连接 Socket。内核会一直监听这些 Socket 上的连接请求或数据请求。一旦有请求到达，就会交给 Redis 线程处理，这就实现了一个 Redis 线程处理多个 IO 流的效果。</li></ul><h3 id="redis-6-0-之后为什么引入了多线程" tabindex="-1"><a class="header-anchor" href="#redis-6-0-之后为什么引入了多线程" aria-hidden="true">#</a> Redis 6.0 之后为什么引入了多线程</h3><p><strong>随着网络硬件的性能提升，Redis 的性能瓶颈有时会出现在网络 I/O 的处理上</strong>。</p><p>为了提高网络 I/O 的并行度，Redis 6.0 对于网络 I/O 采用多线程来处理。但是<strong>对于命令的执行，Redis 仍然使用单线程来处理</strong>，不要误解 Redis 有多线程同时执行命令。</p><p>多线程执行机制如下：</p><img src="'+c+'" alt="image-20231115202641638" style="zoom:50%;"><ul><li>主线程负责接收建立连接请求，获取 socket 放入全局等待读处理队列</li><li>主线程处理完读事件之后，通过 RR(Round Robin) 将这些连接分配给这些 IO 线程</li><li>主线程阻塞等待 IO 线程读取 socket 完毕</li><li><strong>主线程通过单线程的方式执行请求命令</strong>，将结果写回缓冲区</li><li>主线程阻塞等待 IO 线程将数据回写 socket 完毕</li><li>解除绑定，清空等待队列</li></ul><h2 id="redis-持久化" tabindex="-1"><a class="header-anchor" href="#redis-持久化" aria-hidden="true">#</a> Redis 持久化</h2><h3 id="如何实现数据不丢失" tabindex="-1"><a class="header-anchor" href="#如何实现数据不丢失" aria-hidden="true">#</a> 如何实现数据不丢失</h3><blockquote><p>Redis 的读写操作都是在内存中，所以 Redis 性能才会高，但是当 Redis 重启后，内存中的数据就会丢失，那为了保证内存中的数据不会丢失，Redis 实现了数据持久化的机制，这个机制会把数据存储到磁盘，这样在 Redis 重启就能够从磁盘中恢复原有的数据。</p></blockquote><p>Redis 共有三种数据持久化的方式：</p><ul><li><strong>AOF 日志</strong>：每执行一条写操作命令，就把该命令以追加的方式写入到一个文件里。</li><li><strong>RDB 快照</strong>：将某一时刻的内存数据，以二进制的方式写入磁盘。</li><li><strong>混合持久化方式</strong>：Redis 4.0 新增的方式，集成了 AOF 和 RBD 的优点。</li></ul><h3 id="aof-持久化" tabindex="-1"><a class="header-anchor" href="#aof-持久化" aria-hidden="true">#</a> AOF 持久化</h3><p>AOF持久化是通过保存Redis服务器所执行的写命令来记录数据库状态的。</p><blockquote><p>优点：</p><ol><li>每一次修改都同步，文件完成性更好</li><li>每秒同步一次，可能会丢失一秒数据</li></ol><p>缺点：</p><ol><li>相对于文件大小，aof远远大于rdb，修复速度也比rdb慢</li><li>aof运行效率比rdb慢</li></ol></blockquote><h4 id="aof持久化的实现" tabindex="-1"><a class="header-anchor" href="#aof持久化的实现" aria-hidden="true">#</a> AOF持久化的实现</h4><p><img src="'+p+'" alt="image-20231115203225347" loading="lazy"> <strong>命令追加</strong>**</p><p>AOF打开后，服务器在写完一个命令之后，会以协议格式将被执行的写命令追加到服务器状态的 aof_buf 缓冲区末尾。</p><p><strong>先执行命令，再写入日志</strong></p><p><strong>好处</strong>：</p><ul><li><strong>避免额外检查开销</strong>。假如先写入 AOF 日志，再执行命令，如果该命令语法有问题，不进行语法检查的话，在使用日志恢复数据时就会出错。</li><li><strong>不会因写入日志阻塞当前写操作命令的执行</strong>：因为当写操作命令执行成功后，才会将命令记录到 AOF 日志。</li></ul><p><strong>风险</strong>：</p><ul><li><strong>数据可能会丢失：</strong> 执行写操作命令和记录日志是两个过程，那当 Redis 在还没来得及将命令写入到硬盘时，服务器发生宕机了，这个数据就会有丢失的风险。</li><li><strong>可能阻塞其他操作：</strong> 由于写操作命令执行成功后才记录到 AOF 日志，所以不会阻塞当前命令的执行，但因为 AOF 日志也是在主线程中执行，所以当 Redis 把日志文件写入磁盘的时候，还是会阻塞后续的操作无法执行。</li></ul><h4 id="aof-写回策略" tabindex="-1"><a class="header-anchor" href="#aof-写回策略" aria-hidden="true">#</a> AOF 写回策略</h4><p>Redis 写入 AOF 过程如下图：</p><img src="'+g+'" alt="image-20231115205550491" style="zoom:50%;"><p>通过配置<code>appendfsync</code>选项的值直接决定AOF持久化功能的效率和安全性。</p><ul><li>值为<code>always</code>时，服务器每个事件循环都要将<code>aof_buf</code>缓冲区中的内容写入到AOF文件，并且同步AOF文件。<code>always</code>的效率最低，但是安全性最高。</li><li>值为<code>everysec</code>时，服务器在每个事件循环都将<code>aof_buf</code>缓冲区中所有内容写入到AOF文件，并且每隔一秒就要在子线程中对AOF文件进行一次同步。效率上足够快，就算故障，<strong>最多会丢失2秒数据</strong>。</li><li>值为<code>no</code>时，服务器在每个事件循环都将<code>aof_buf</code>缓冲区中所有内容写入到AOF文件，至于何时同步，就有操作系统控制。</li></ul><p><strong>为什么最多会丢失2秒数据呢</strong></p><p>除了首次命令写入操作之外，后面所有写入操作，Redis 主线程会负责对比上次 AOF 同步时间：</p><ul><li>如果距上次同步成功时间在 2 秒内：主线程直接返回。</li><li>如果距上次同步成功时间超过 2 秒：主线程将调用 AOF 磁盘同步线程进行阻塞，直到磁盘同步操作完成，此时 Redis 不可用。</li></ul><p>按照上面规则，主线程在命令写入后会调用系统的<code>write</code>操作，<code>write</code>执行完成后主线程返回。然后文件同步<code>fsync</code>线程每秒调用一次将命令写入磁盘。</p><p>问题在于：如果硬盘负载过高，同步操作可能会超过 1 秒，这时如果主线程仍然继续向缓冲区写入命令，硬盘负载会越来越大（<code>fsync</code>线程处理不过来）。如果在第 2 秒时 Redis 停机，则最近两秒内的数据将不会写入磁盘，就会丢失。</p><figure><img src="'+h+'" alt="image-20231119131028701" tabindex="0" loading="lazy"><figcaption>image-20231119131028701</figcaption></figure><h4 id="aof-文件过大重写" tabindex="-1"><a class="header-anchor" href="#aof-文件过大重写" aria-hidden="true">#</a> AOF 文件过大重写</h4><p>随着写操作命令越来越多，AOF 文件也会越来越大，就会带来性能问题，重启 Redis 恢复数据就会很慢。</p><p>为了避免 AOF 文件过大，使用了 AOF 重写机制：当 AOF 文件大小超过阈值，就会对 AOF 文件进行压缩。</p><p><strong>原理</strong>：在重写时，读取当前数据库中所有键值对，将每个键值对用一条命令记录到<strong>新 AOF 文件</strong>，全部记录完成后，用新的 AOF 文件替换掉现有的 AOF 文件。</p><blockquote><p>示例：</p><p>在没有重写前，假如执行：<code>set example a</code> 和 <code>set example b</code>这两个命令，就会将这两个命令写入到 AOF 文件。</p><p>重写后：AOF 文件中只有 <code>set example b</code> 这一条命令。由此可见进行了压缩。</p></blockquote><p>重写过程是由<strong>子进程</strong>完成的，主进程可以继续处理命令请求。</p><blockquote><p>为什么不用线程？</p><p>因为多线程会共享内存，修改数据时需要加锁保证数据安全，就会降低性能。</p><p>而父子进程是共享内存数据的，共享的内存只能以<strong>只读</strong>方式，当父子进程任意一方修改共享内存，就会发生<strong>写时复制</strong>，父子进行就有独立的数据副本，不需要加锁来保证数据安全。简记：<strong>读时共享，写时复制</strong>。</p></blockquote><p><strong>重写过程中，主进程依然可以正常处理命令</strong>。所以对于同一个 key ，可能会存在主进程和子进程内存数据不一致的情况。</p><p>Redis 通过设置 <strong>AOF 重写缓冲区</strong> 来解决上面问题，这个缓冲区在重写子进程创建后使用。</p><p>在重写 AOF 期间，当 Redis 执行完一个写命令之后，它会<strong>同时将这个写命令写入到 「AOF 缓冲区」和 「AOF 重写缓冲区」</strong>。</p><figure><img src="'+u+'" alt="image-20231119135006679" tabindex="0" loading="lazy"><figcaption>image-20231119135006679</figcaption></figure><p>也就是说，在重写子进程执行 AOF 重写期间，主进程需要执行以下三个工作:</p><ul><li>执行客户端发来的命令。</li><li>将执行后的写命令追加到 「AOF 缓冲区」。</li><li>将执行后的写命令追加到 「AOF 重写缓冲区」。</li></ul><p>子进程完成 AOF 重写工作，会向主进程发送一条信号。<strong>主进程</strong>收到该信号后，会调用一个信号处理函数，该函数主要做以下工作：</p><ul><li>将 <strong>AOF 重写缓冲区</strong>中的所有内容追加到新的 AOF 的文件中，使得新旧两个 AOF 文件所保存的数据库状态一致。</li><li>新的 AOF 的文件进行改名，覆盖现有的 AOF 文件。</li></ul>',115),I={href:"https://xiaolincoding.com/redis/storage/aof.html",target:"_blank",rel:"noopener noreferrer"},V=a('<h3 id="rdb持久化" tabindex="-1"><a class="header-anchor" href="#rdb持久化" aria-hidden="true">#</a> RDB持久化</h3><blockquote><p>上面介绍的 AOF 持久化记录的是操作命令，在恢复数据时需要将命令再执行一遍，当命令量大时，很耗费时间，恢复数据就很慢。</p></blockquote><p>RDB持久化是把<strong>实际数据生成快照保存到硬盘的过程</strong>，触发RDB持久化过程分为手动触发和自动触发。</p><p>在 Redis 恢复数据时， RDB 恢复数据的效率会比 AOF 高些，因为直接将 RDB 文件读入内存就可以，不需要像 AOF 那样还需要额外执行操作命令的步骤才能恢复数据。</p><h4 id="rdb-快照会阻塞主线程吗" tabindex="-1"><a class="header-anchor" href="#rdb-快照会阻塞主线程吗" aria-hidden="true">#</a> RDB 快照会阻塞主线程吗</h4><p>有两个 Redis 命令可以用于生成 RDB 文件，一个是 <code>SAVE</code>，另一个是 <code>BGSAVE</code>。<strong>区别在于是否在主线程里面执行</strong>。</p><ul><li><p><code>SAVE</code> 命令会阻塞Redis服务器进程，直到 RDB 文件创建完毕为止，在服务器进程阻塞期间，服务器不能处理任何命令请求，<strong>会阻塞主线程</strong>。</p></li><li><p><code>BGSAVE </code>命令会派生出一个子进程，然后由子进程负责创建 RDB 文件。服务器进程（父进程）继续处理命令请求，<strong>不会阻塞主线程</strong>。</p></li></ul><p>RDB 文件的载入工作是在服务器启动时自动执行的，Redis 没有专门用于载入 RDB 文件的命令，只要 Redis 服务器在启动时检测到 RDB 文件存在，它就会自动载入RDB 文件。</p><blockquote><p>💡因为 AFO文件的更新频率通常比RDB文件更新频率更高，所以：</p><ul><li>如果服务器开启了 AOF 持久化功能，那么服务器会优先使用 AOF 文件来还原数据库状态。</li><li>只有在 AOF 持久化功能处于关闭状态时，服务器才会使用 RDB 文件来还原数据库状态。</li></ul></blockquote><figure><img src="'+f+'" alt="image-20210305104729387" tabindex="0" loading="lazy"><figcaption>image-20210305104729387</figcaption></figure><blockquote><p>Redis 的快照是<strong>全量快照</strong>，也就是说每次执行快照，都是把内存中的「所有数据」都记录到磁盘中。所以执行快照是一个比较重的操作，如果频率太频繁，可能会对 Redis 性能产生影响。如果频率太低，服务器故障时，丢失的数据会更多。</p></blockquote><h4 id="rdb-执行快照时-数据能修改吗" tabindex="-1"><a class="header-anchor" href="#rdb-执行快照时-数据能修改吗" aria-hidden="true">#</a> RDB 执行快照时，数据能修改吗</h4><p>执行 <code>bgsave</code> 过程中，Redis 依然<strong>可以继续处理操作命令</strong>的，也就是数据是能被修改的，关键的技术就在于<strong>写时复制技术（Copy-On-Write, COW）。</strong></p><p>执行 <code>bgsave</code> 命令的时候，会通过 <code>fork()</code> 创建子进程，此时子进程和父进程是共享同一片内存数据的，因为创建子进程的时候，会复制父进程的页表，但是页表指向的物理内存还是一个，此时如果主线程执行读操作，则主线程和 <code>bgsave</code> 子进程互相不影响。</p><img src="'+b+'" alt="image-20231119144608138" style="zoom:50%;"><p>如果主线程执行写操作，则被修改的数据会复制一份副本，然后 <code>bgsave</code> 子进程会把该副本数据写入 RDB 文件，在这个过程中，主线程仍然可以直接修改原来的数据。</p><img src="'+m+`" alt="image-20231119144642033" style="zoom:50%;"><h4 id="save命令执行时服务器状态" tabindex="-1"><a class="header-anchor" href="#save命令执行时服务器状态" aria-hidden="true">#</a> <code>SAVE</code>命令执行时服务器状态</h4><p>当<code>SAVE</code>命令执行时，Redis服务器会被阻塞，这时服务器不能处理任何命令请求。</p><h4 id="bgsave命令执行时服务器状态" tabindex="-1"><a class="header-anchor" href="#bgsave命令执行时服务器状态" aria-hidden="true">#</a> <code>BGSAVE</code>命令执行时服务器状态</h4><p><code>BGSAVE</code>命令执行期间，服务器仍可以处理客户端的命令请求。但是，对<code>SAVE</code>、<code>BGSAVE</code>、<code>BGREWRITEAOF</code>这三个命令方式和平时有所不同。</p><p>在<code>BGSAVE</code>命令执行期间，<code>SAVE</code>命令会被服务器拒绝，这是为了避免父进程和子进程同时执行两个<code>rdbSave</code>调用，防止产生竞争条件。</p><p>在<code>BGSAVE</code>命令执行期间，<code>BGSAVE</code>命令也会被服务器拒绝，因为通知执行两个<code>BGSAVE</code>命令也会产生竞争条件。</p><p>最后，<code>BGREWRITEAOF</code>和<code>BGSAVE</code>两个命令不能同时运行：</p><ul><li>如果<code>BGSAVE</code>命令正在执行，那么客户端发送的<code>BGREWRITEAOF</code>命令会被延迟到<code>BGSAVE</code>命令执行完毕之后执行。</li><li>如果<code>BGREWRITEAOF</code>命令正在执行，那么客户端发送的<code>BGSAVE</code>命令会被服务器拒绝。</li></ul><h4 id="rdb文件载入时服务器状态" tabindex="-1"><a class="header-anchor" href="#rdb文件载入时服务器状态" aria-hidden="true">#</a> RDB文件载入时服务器状态</h4><p>服务器在载入RDB文件期间，会一直处于阻塞状态，直到载入工作完毕为止。</p><h4 id="自动间隔性保存" tabindex="-1"><a class="header-anchor" href="#自动间隔性保存" aria-hidden="true">#</a> 自动间隔性保存</h4><p>因为<code>BGSAVE</code>可以在不阻塞服务器进程下执行，所以允许设置<code>save</code>选项，让服务器每隔一段时间自动执行一次<code>BGSAVE</code>命令。</p><p>可以通过<code>save</code>选项设置多个保存条件，但只要其中一个条件被满足，服务器就会执行<code>BGSAVE</code>命令。</p><blockquote><p>比如下面例子：</p><ul><li><code>save 900 1</code> ：服务器在900秒内，对数据库进行了至少1次修改</li></ul></blockquote><p>#####<code>saveparams</code>属性**：</p><p><code>saveparams</code> 属性是一个数组，数组中的每个元素都是一个 <code>saveparam</code> 结构，每个 <code>saveparam</code> 结构都保存了一个 <code>save</code> 选项设置的保存条件：</p><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>struct saveparam {
    time_t seconds; // 秒数
    int changes;  // 修改数
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h5 id="dirty-计数器和-lastsave-属性" tabindex="-1"><a class="header-anchor" href="#dirty-计数器和-lastsave-属性" aria-hidden="true">#</a> <code>dirty</code> 计数器和 <code>lastsave</code> 属性</h5><ul><li><code>dirty</code> 计数器记录距离上一次成功执行 <code>SAVE</code> 命令或者 <code>BGSAVE </code>命令后，服务器对数据库状态（所有数据库）进行了多少次修改（删除，更新，写入等）</li><li><code>lastsave</code> 属性是一个 <code>UNIX</code> 时间戳，记录了服务器上一次成功执行 <code>SAVE</code> 或者 <code>BGSAVE</code> 命令的时间。</li></ul><div class="language-c++ line-numbers-mode" data-ext="c++"><pre class="language-c++"><code>struct redisServer {
    long long dirty;  // 修改计数器
    time_t lastsave;  // 上一次执行保存的时间
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="检查保存条件是否满足" tabindex="-1"><a class="header-anchor" href="#检查保存条件是否满足" aria-hidden="true">#</a> 检查保存条件是否满足</h4><p>Redis周期性操作函数 <code>serverCron</code> 默认每隔100毫秒就会执行一次，该函数用于对正在允许的服务器进行维护，它的一项工作就是检查<code>save</code>选项所设置的保存条件是否已经满足，如果满足，就会执行 <code>BGSAVE</code> 命令。</p><h4 id="rdb文件结构" tabindex="-1"><a class="header-anchor" href="#rdb文件结构" aria-hidden="true">#</a> RDB文件结构</h4><figure><img src="`+R+'" alt="image-20210305135556398" tabindex="0" loading="lazy"><figcaption>image-20210305135556398</figcaption></figure><ul><li><code>REDIS</code> 部分长度为5个字节，保存着<code>REDIS</code>五个字符。通过这五个字符，程序在载入文件时，快速检查所载入的文件是否RDB文件。</li><li><code>db_version</code> 长度为4个字节，它的值是一个字符串表示的整数，这个整数记录了RDB文件的版本号。比如<code>0006</code>代表RDB文件版本为第六版。</li><li><code>database </code>部分包含零个或任意多个数据库，以及各个数据库中的键值对数据。 <ul><li>如果服务器数据库状态为空，这个部分也为空，长度为0字节。</li><li>如果服务器数据库状态为非空（有至少一个数据库非空），那么这个部分也为非空。根据数据库保存的键值对的数量、类型和内容的不同，这个部分长度也会有所不同。</li></ul></li><li><code>EOF</code> 常量的长度为1字节，标志着RDB文件正文内容的结束，当读入程序遇到这个值的时候，表明所有数据库的所有键值对都已经载入完毕了。</li><li><code>check_sum</code> 是一个8字节长的无符号整数、保存着一个校验和，这个校验和是程序通过对<code>REDIS</code>、<code>db_version</code>、<code>databases</code>、<code>EOF</code>四个部分的内容进行计算得出的。服务器在载入RDB文件时，会将载入数据所计算出的校验和与<code>check_sum</code>所记录的校验和进行对比，以此来检查RDB文件是否有出错或者损坏的情况出现。</li></ul><h5 id="databases部分" tabindex="-1"><a class="header-anchor" href="#databases部分" aria-hidden="true">#</a> <strong><code>databases</code>部分</strong></h5><p>一个RDB文件的<code>databases</code>部分可以保存任意多个非空数据库。</p><p>例如，如果服务器的0号和3号数据库非空，则将创建以下结构RDB文件：</p><figure><img src="'+_+'" alt="image-20210305141958845" tabindex="0" loading="lazy"><figcaption>image-20210305141958845</figcaption></figure><p>每个<code>database</code>都包含数据库所有键值对。</p><p>每个非空数据库在RDB文件中都可以保存为<code>SELECTDB</code>、<code>db_number</code>、<code>key_value_pairs</code>三个部分。</p><figure><img src="'+A+'" alt="image-20210305142202954" tabindex="0" loading="lazy"><figcaption>image-20210305142202954</figcaption></figure><ul><li><code>SELECTDB</code>常量的长度为1字节，标示将要读入的数据库号码。</li><li><code>db_number</code>保存着一个数据库号码，根据号码大小不同，这个部分长度可以是1字节、2字节、5字节等。当程序读入<code>db_number</code>部分后，服务器会调用<code>SELECT</code>命令，根据读入的数据库号码进行数据库的切换，使得读入的键值对可以正确载入到数据库中。</li><li><code>key_value_pairs</code>部分保存了数据库中所有键值对数据，如果键值对带有过期时间，则过期时间也会和键值对保存在一起。根据键值对的数量、类型、内容以及是否有过期时间等条件的不同，<code>key_value_pairs</code>部分的长度也会有所不同。</li></ul><h5 id="key-value-pairs部分" tabindex="-1"><a class="header-anchor" href="#key-value-pairs部分" aria-hidden="true">#</a> <code>key_value_pairs</code>部分</h5><p>RDB文件中的每个<code>key_value_pairs</code>部分都保存了一个或以上数量的键值对，如果键值对带有过期时间的话，那么键值对的过期时间也会被保存在内。</p><p>不带过期时间的键值对如下：</p><figure><img src="'+v+'" alt="image-20210305202119931" tabindex="0" loading="lazy"><figcaption>image-20210305202119931</figcaption></figure><ul><li><code>TYPE</code>记录了<code>value</code>类型，长度为1字节。</li><li><code>KEY</code>总是一个字符串对象。</li><li>根据<code>TYPE</code>类型不同，以及保存内容长度的不同，保存<code>value</code>的结构和长度也会有所不同</li></ul><p>带有过期时间的键值对如下：</p><figure><img src="'+B+'" alt="image-20210305202032401" tabindex="0" loading="lazy"><figcaption>image-20210305202032401</figcaption></figure><ul><li><code>EXPIRETIME_MS</code>常量的长度为1字节，它告知读入程序，接下来要读入的是一个以毫秒为单位的过期时间。</li><li><code>ms</code>是一个8字节长的带符号整数，记录着一个以毫秒为单位的UNIX时间戳，这个时间戳就是键值对的过期时间。</li></ul><h3 id="混合持久化" tabindex="-1"><a class="header-anchor" href="#混合持久化" aria-hidden="true">#</a> 混合持久化</h3><p>先看看 AOF 和 RDB 各自优点：</p><p>RDB 优点是数据恢复速度快，但是快照的频率不好把握。频率太低，丢失的数据就会比较多，频率太高，就会影响性能。</p><p>AOF 优点是丢失数据少，但是数据恢复不快。</p><p>为了集成了两者的优点， Redis 4.0 提出了<strong>混合使用 AOF 日志和内存快照</strong>，也叫混合持久化，既保证了 Redis 重启速度，又降低数据丢失风险。</p><p><strong>思考</strong>：AOF 恢复数据过程中导致性能慢的地方在于要重新执行一遍命令，那么在恢复数据时能不能不重新执行命令呢？</p><p><strong>混合持久化</strong>发生在 AOF 重写过程中，由于重写过程由子进程执行，不会阻塞主进程，所以子进程现将与主进程共享的内存数据以 RDB 方式写入 AOF 文件，而不是执行命令。然后主进程在该阶段执行的命令会写到<strong>重写缓冲区</strong>，重写缓冲区里面的增量命令仍以 AOF 方式写入 AOF 文件，最后通知主进程将含有 RDB 格式和 AOF 格式的新 AOF 文件替换旧的 AOF 文件。</p><blockquote><p>为什么增量命令仍以 AOF 方式写入呢？</p><p>因为增量命令写入 AOF 文件这一过程是主进程执行的，直接追加命令的效率比转为 RDB 快照效率更高。</p></blockquote><p>混合持久化后，<strong>AOF 文件前半部分是 RDB 格式的全量数据，后半部分是 AOF 格式的增量数据</strong>。</p><p><strong>优点</strong>：</p><ul><li>AOF 文件前半部分是 RDB 快照，所以恢复数据更快，Redis 启动更快。</li><li>AOF 文件后半部分是命令，但这部分命令是子进程重写 AOF 期间主进程产生的，命令少，这样数据丢失也少。</li></ul><p>缺点：</p><ul><li>AOF 文件可读性变差，前后部分内容格式不一样。</li><li>兼容性差， Redis 4.0 之前版本无法使用。</li></ul><h2 id="主从复制" tabindex="-1"><a class="header-anchor" href="#主从复制" aria-hidden="true">#</a> 主从复制</h2><p>主服务器：读写操作，当发生写操作时自动将写操作同步给从服务器。</p><p>从服务器：一般是只读，并接受主服务器同步过来写操作命令，然后执行这条命令。</p><figure><img src="'+O+`" alt="image-20231119154711639" tabindex="0" loading="lazy"><figcaption>image-20231119154711639</figcaption></figure><p>主服务器：数据修改操作，同步数据到从服务器。<strong>命令复制是异步的</strong>。</p><p>主服务器收到新的写命令后，会发送给从服务器。但是，主服务器并不会等到从服务器实际执行完命令后，再把结果返回给客户端，而是主服务器自己在本地执行完命令后，就会向客户端返回结果了。如果从服务器还没有执行主服务器同步过来的命令，主从服务器间的数据就不一致了。</p><p>所以，无法实现强一致性保证（主从数据时时刻刻保持一致），数据不一致是难以避免的。</p><h3 id="初次同步" tabindex="-1"><a class="header-anchor" href="#初次同步" aria-hidden="true">#</a> 初次同步</h3><p><strong>问题一： 如何确定主从关系？</strong></p><p>可以使用 <code>replicaof</code>（Redis 5.0 之前使用 <code>slaveof</code>）命令形成主服务器和从服务器的关系。</p><p>比如，现在有服务器 A 和 服务器 B，我们在服务器 B 上执行下面这条命令：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code># 服务器 B 执行这条命令
replicaof &lt;服务器 A 的 IP 地址&gt; &lt;服务器 A 的 Redis 端口号&gt;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><p>接着，服务器 B 就会变成服务器 A 的「从服务器」，然后与主服务器进行第一次同步。</p><p>主从服务器间的第一次同步的过程可分为三个阶段：</p><ul><li>第一阶段：建立链接、协商同步。</li><li>第二阶段：主服务器同步数据给从服务器。</li><li>第三阶段：主服务器发送新写操作命令给从服务器。</li></ul><figure><img src="`+k+'" alt="image-20231120224414429" tabindex="0" loading="lazy"><figcaption>image-20231120224414429</figcaption></figure><h4 id="第一阶段" tabindex="-1"><a class="header-anchor" href="#第一阶段" aria-hidden="true">#</a> 第一阶段</h4><blockquote><p><strong>建立链接，协商同步</strong></p></blockquote><p>执行了 <code>replicaof</code> 命令后，从服务器就会给主服务器发送 <code>psync</code> 命令，表示要进行数据同步。</p><p><code>psync</code> 命令包含两个参数，分别是<strong>主服务器的 runID</strong> 和<strong>复制进度 offset</strong>。</p><ul><li>runID：每个 Redis 服务器在启动时都会自动生产一个随机的 ID 来唯一标识自己。当从服务器和主服务器第一次同步时，因为不知道主服务器的 run ID，所以将其设置为 &quot;?&quot;。</li><li>offset：表示复制的进度，第一次同步时，其值为 -1。</li></ul><p>主服务器收到 psync 命令后，会用 <code>FULLRESYNC</code> 作为响应命令返回给对方。</p><p>并且这个响应命令会带上两个参数：主服务器的 runID 和主服务器目前的复制进度 offset。从服务器收到响应后，会记录这两个值。</p><p>FULLRESYNC 响应命令的意图是采用<strong>全量复制</strong>的方式，也就是主服务器会把所有的数据都同步给从服务器。</p><p>所以，第一阶段的工作时为了全量复制做准备。</p><h4 id="第二阶段" tabindex="-1"><a class="header-anchor" href="#第二阶段" aria-hidden="true">#</a> 第二阶段</h4><blockquote><p><strong>主服务器传递文件到从服务器</strong></p></blockquote><p>接着，主服务器会执行 <code>bgsave</code> 命令来生成 RDB 文件，然后把文件发送给从服务器。</p><p>从服务器收到 RDB 文件后，会先清空当前的数据，然后载入 RDB 文件。</p><p>前面已经提到，主服务器生成 RDB 这个过程主线程不会阻塞，<code>bgsave</code>命令是产生了一个子进程来做生成 RDB 文件的工作，是异步工作的，这样 Redis 依然可以正常处理命令。但是这期间的写操作命令并没有记录到刚生成的 RDB 文件中，这时主从服务器数据就不一致了。</p><p>为了保证主从数据一致性，主服务器会将下面三个时间的写命令，写入到 <strong>replication buffer</strong> 缓冲区里：</p><ul><li>主服务器生成 RDB 文件期间。</li><li>主服务器发送 RDB 文件给从服务器期间。</li><li>从服务器加载 RDB 文件期间。</li></ul><h4 id="第三阶段" tabindex="-1"><a class="header-anchor" href="#第三阶段" aria-hidden="true">#</a> 第三阶段</h4><blockquote><p><strong>主服务器发送新写操作命令给从服务器</strong></p></blockquote><p>接着，主服务器将 <strong>replication buffer</strong> 缓冲区里所记录的写操作命令发送给从服务器，从服务器执行来自主服务器 replication buffer 缓冲区里发来的命令，这时主从服务器的数据就一致了。</p><h3 id="命令传播" tabindex="-1"><a class="header-anchor" href="#命令传播" aria-hidden="true">#</a> 命令传播</h3><blockquote><p>主从服务器在完成第一次同步后，双方之间就会维护一个 TCP <strong>长连接</strong>。</p></blockquote><figure><img src="'+x+'" alt="image-20231120225412695" tabindex="0" loading="lazy"><figcaption>image-20231120225412695</figcaption></figure><p>后续主服务器可以通过这个连接继续将写操作命令传播给从服务器，然后从服务器执行该命令，使得与主服务器的数据库状态相同。</p><p>而且这个连接是长连接的，目的是避免频繁的 TCP 连接和断开带来的性能开销。</p><p>上面的这个过程被称为<strong>基于长连接的命令传播</strong>，通过这种方式来保证第一次同步后的主从服务器的数据一致性。</p><h3 id="分摊主服务器压力" tabindex="-1"><a class="header-anchor" href="#分摊主服务器压力" aria-hidden="true">#</a> 分摊主服务器压力</h3><p>主服务器是可以有多个从服务器的，如果从服务器数量非常多，而且都与主服务器进行全量同步的话，就会带来两个问题：</p><ul><li>由于是通过 bgsave 命令来生成 RDB 文件的，那么主服务器就会忙于创建子进程，如果主服务器的内存数据非常大，在s生成 RDB 文件时是会阻塞主线程的，从而使得 Redis 无法正常处理请求。</li><li>传输 RDB 文件会占用主服务器的网络带宽，会对主服务器响应命令请求产生影响。</li></ul><figure><img src="'+F+`" alt="image-20231120230433792" tabindex="0" loading="lazy"><figcaption>image-20231120230433792</figcaption></figure><p>通过这种方式，<strong>主服务器生成 RDB 和传输 RDB 的压力可以分摊到充当经理角色的从服务器</strong>。</p><p>在「从服务器」上执行下面这条命令，使其作为目标服务器的从服务器：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>replicaof &lt;目标服务器的IP&gt; 6379
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>此时如果目标服务器本身也是「从服务器」，那么该目标服务器就会成为「经理」的角色，不仅可以接受主服务器同步的数据，也会把数据同步给自己旗下的从服务器，从而减轻主服务器的负担。</p><h3 id="增量复制" tabindex="-1"><a class="header-anchor" href="#增量复制" aria-hidden="true">#</a> 增量复制</h3><blockquote><p>主从服务器在完成第一次同步后，就会基于长连接进行命令传播。但链接断开了怎么办呢？</p></blockquote><p>在 Redis 2.8 之前，如果主从服务器在命令同步时出现了网络断开又恢复的情况，从服务器就会和主服务器重新进行一次<strong>全量复制</strong>，很明显这样的开销太大了，必须要改进一波。</p><p>所以，从 Redis 2.8 开始，网络断开又恢复后，从主从服务器会采用<strong>增量复制</strong>的方式继续同步，也就是只会把网络断开期间主服务器接收到的写操作命令，同步给从服务器。</p><p>网络恢复后的增量复制过程如下图：</p><figure><img src="`+y+'" alt="image-20231120231232249" tabindex="0" loading="lazy"><figcaption>image-20231120231232249</figcaption></figure><p>主要有三个步骤：</p><ul><li>从服务器在恢复网络后，会发送 <code>psync</code> 命令给主服务器，此时的 <code>psync</code> 命令里的 offset 参数不是 <strong>-1</strong>。</li><li>主服务器收到该命令后，然后用 <code>CONTINUE</code> 响应命令告诉从服务器接下来采用增量复制的方式同步数据。</li><li>然后主服务将主从服务器断线期间，所执行的写命令发送给从服务器，然后从服务器执行这些命令。</li></ul><hr><p><strong>问题：主服务器怎么知道要将哪些增量数据发送给从服务器呢？</strong></p><ul><li><strong>repl_backlog_buffer</strong>：是一个「<strong>环形</strong>」缓冲区，用于主从服务器断连后，从中找到差异的数据。</li><li><strong>replication offset</strong>：标记上面那个缓冲区的同步进度，主从服务器都有各自的偏移量，主服务器使用 <code>master_repl_offset</code> 来记录自己「<em>写</em>」到的位置，从服务器使用 <code>slave_repl_offset</code> 来记录自己「<em>读</em>」到的位置。</li></ul><hr><p><strong>问题：repl_backlog_buffer 缓冲区是什么时候写入的呢？</strong></p><p>主服务器进行命令传播时，不仅会将写命令发送给从服务器，还会将写命令写入到 <strong>repl_backlog_buffer</strong> 缓冲区里，因此这个缓冲区里会保存着最近传播的写命令。</p><hr><p><strong>【增量同步原理】</strong></p><p>网络断开后，当从服务器重新连上主服务器时，从服务器会通过 psync 命令将自己的复制偏移量 <strong>slave_repl_offset</strong> 发送给主服务器，主服务器根据自己的 <strong>master_repl_offset</strong> 和 <strong>slave_repl_offset</strong> 之间的差距，然后来决定对从服务器执行哪种同步操作：</p><ul><li>如果判断出从服务器要读取的数据还在 <strong>repl_backlog_buffer</strong> 缓冲区里，那么主服务器将采用<strong>增量同步</strong>的方式；</li><li>相反，如果判断出从服务器要读取的数据已经不存在 <strong>repl_backlog_buffer</strong> 缓冲区里（缓存区可以覆盖），那么主服务器将采用<strong>全量同步</strong>的方式。</li></ul><p>当主服务器在 <strong>repl_backlog_buffer</strong> 中找到主从服务器差异（增量）的数据后，就会将增量的数据写入到 <strong>replication buffer</strong> 缓冲区，这个缓冲区我们前面也提到过，它是缓存将要传播给从服务器的命令。</p><figure><img src="'+D+`" alt="image-20231120231644331" tabindex="0" loading="lazy"><figcaption>image-20231120231644331</figcaption></figure><p><strong>repl_backlog_buffer</strong> 缓行缓冲区的默认大小是 <strong>1M</strong>，并且由于它是一个环形缓冲区，所以当缓冲区写满后，主服务器继续写入的话，就会覆盖之前的数据。</p><p>因此，当主服务器的写入速度远超于从服务器的读取速度，缓冲区的数据一下就会被覆盖。</p><p>那么在网络恢复时，如果从服务器想读的数据已经被覆盖了，主服务器就会采用全量同步，这个方式比增量同步的性能损耗要大很多。</p><p><strong>为了避免在网络恢复时，主服务器频繁地使用全量同步的方式，可以调整下 repl_backlog_buffer 缓冲区大小，尽可能的大一些</strong>，减少出现从服务器要读取的数据被覆盖的概率，从而使得主服务器采用增量同步的方式。</p><hr><p><strong>问题：repl_backlog_buffer 缓冲区具体要调整到多大呢</strong></p><blockquote><p>计算公司： repl_backlog_buffer = second * write_size_per_second</p></blockquote><ul><li>second 为从服务器断线后重新连接上主服务器所需的平均 时间(以秒计算)。</li><li>write_size_per_second 则是主服务器平均每秒产生的写命令数据量大小。</li></ul><p>举个例子：如果主服务器平均每秒产生 1 MB 的写命令，而从服务器断线之后平均要 5 秒才能重新连接主服务器。</p><p>那么 repl_backlog_buffer 大小就不能低于 5 MB，否则新写地命令就会覆盖旧数据了。</p><p>当然，为了应对一些突发的情况，可以将 repl_backlog_buffer 的大小设置为此基础上的 2 倍，也就是 10 MB。</p><p>关于 repl_backlog_buffer 大小修改的方法，只需要修改配置文件里下面这个参数项的值就可以。</p><div class="language-bash line-numbers-mode" data-ext="sh"><pre class="language-bash"><code>repl-backlog-size 1mb
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h2 id="哨兵模式" tabindex="-1"><a class="header-anchor" href="#哨兵模式" aria-hidden="true">#</a> 哨兵模式</h2><p>在使用 Redis 主从服务的时候，会有一个问题，就是当 Redis 的主从服务器出现故障宕机时，需要手动进行恢复。</p><p>为了解决这个问题，Redis 增加了哨兵模式（<strong>Redis Sentinel</strong>），因为哨兵模式做到了可以监控主从服务器，并且提供<strong>主从节点故障转移的功能。</strong></p><figure><img src="`+E+'" alt="image-20231119160133493" tabindex="0" loading="lazy"><figcaption>image-20231119160133493</figcaption></figure>',157);function z(G,C){const o=s("ExternalLinkIcon");return r(),t("div",null,[q,e("blockquote",null,[e("p",null,[i("参考："),e("a",I,[i("AOF 持久化是怎么实现的"),n(o)])])]),V])}const L=d(S,[["render",z],["__file","Redis面试题.html.vue"]]);export{L as default};
