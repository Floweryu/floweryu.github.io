import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as e,a}from"./app-ca7d038d.js";const i="/assets/3fa252bdbb174ebb9315293442e72f91tplv-k3u1fbpfcp-watermark-5174d2ce.png",t="/assets/ea2b11fe35bd4ac694ac5bd173d6f54ftplv-k3u1fbpfcp-watermark-20af8b8f.png",r="/assets/df85901275254794a89c0a3dc22ff503tplv-k3u1fbpfcp-watermark-e227f332.png",l="/assets/2e9e8fc6f7184f26a5fe8eeadeef0b7etplv-k3u1fbpfcp-watermark-e28f1917.png",o="/assets/42f36eeea66e4dbfa65f0176b7c51150tplv-k3u1fbpfcp-watermark-a0e9fd1e.png",c="/assets/3bfbc50de4bb4954950467a9658bf9aetplv-k3u1fbpfcp-watermark-df02282d.png",p="/assets/2d9b6c01aa0f40f1ae999213644a4503tplv-k3u1fbpfcp-watermark-49bb9ee2.png",u={},d=a('<h2 id="一、服务发现" tabindex="-1"><a class="header-anchor" href="#一、服务发现" aria-hidden="true">#</a> 一、服务发现</h2><p>RocketMQ有下面几个角色</p><p><strong>NameSrv: 注册中心</strong></p><p><strong>Broker: 消息服务器</strong></p><p><strong>Producer: 消息生产者</strong></p><p><strong>Consumer: 消息消费者</strong></p><p>RocketMQ没有使用Zookeeper作为服务的注册中心，而是自研的NameSrv，每个NameSrv都是无关联的节点。</p><p>当消息服务器启动后，会将自己的地址信息等，注册到所有的NameSrv。</p><figure><img src="'+i+'" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><p>当Producer和Consumer启动后，会主动连接NameServer，获取可用的Broker列表，并选取Broker进行连接，进行消息发送与拉取。</p><figure><img src="'+t+'" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><h2 id="二、源码分析" tabindex="-1"><a class="header-anchor" href="#二、源码分析" aria-hidden="true">#</a> 二、源码分析</h2><h3 id="_2-1-路由注册" tabindex="-1"><a class="header-anchor" href="#_2-1-路由注册" aria-hidden="true">#</a> 2.1 路由注册</h3><p>在源码的broker包根目录下，有一个<code>BrokerStartup</code>启动类。</p><figure><img src="'+r+`" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><p>入口代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> public static void main(String[] args) {
     start(createBrokerController(args));
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主要进行了两件事：</p><ol start="0"><li>创建BrokerController，用来管理Broker节点</li><li>启动BrokerController</li></ol><p>第一步：创建BrokerController过程，主要是分析配置信息，比如：NameSrv集群的地址表、Broker信的角色信息(Master/Salve)等，并对其进行初始化。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> final BrokerController controller = new BrokerController(
     brokerConfig,
     nettyServerConfig,
     nettyClientConfig,
     messageStoreConfig);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
     private volatile boolean hasShutdown = false;
     private AtomicInteger shutdownTimes = new AtomicInteger(0);
 
     @Override
     public void run() {
         synchronized (this) {
             log.info(&quot;Shutdown hook was invoked, {}&quot;, this.shutdownTimes.incrementAndGet());
             if (!this.hasShutdown) {
                 this.hasShutdown = true;
                 long beginTime = System.currentTimeMillis();
                 controller.shutdown();
                 long consumingTimeTotal = System.currentTimeMillis() - beginTime;
                 log.info(&quot;Shutdown hook over, consuming total time(ms): {}&quot;, consumingTimeTotal);
             }
         }
     }
 }, &quot;ShutdownHook&quot;));
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果代码中使用了线程池，一种优雅的停机方式是注册一个JVM钩子函数，在JVM进程关闭之前，先将线程池关闭，及时释放资源。</p><p>第二步是主要的，启动各种服务。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> public void start() throws Exception {
     if (this.messageStore != null) {
         // 这里的messageStore是在创建controller时初始化的，controller.initialize(); 是DefaultMessageStore类
         // 启动消息存储服务，包括启动Broker的高可用机制；启动以下任务：
         // 1. 启动把内存当中的消息刷到磁盘中的任务
         // 2. 把 commitLog 中的消息分发到 consumerQueue 文件中任务
         // 3. cleanFilesPeriodically(): 清除过期的 commitLog/ consumerQueue 日志文件, 10s
         // 4. checkSelf(): 检查 commitLog/ consumerQueue 的 映射文件，10min
         // 5. 如果 commitLog 锁时间超过了阈值，持久化它的锁信息, 1s
         // 6. isSpaceFull(): 检测磁盘空间是否足够, 10s
         // 需要掌握的java的知识点：scheduleAtFixedRate, RandomAccessFile
         this.messageStore.start();
     }
 
     if (this.remotingServer != null) {
         // 使用Netty暴露Socket服务处理外部请求的调用
         this.remotingServer.start();
     }
 
     if (this.fastRemotingServer != null) {
         // 使用Netty暴露Socket服务处理外部请求的调用
         this.fastRemotingServer.start();
     }
 
     if (this.fileWatchService != null) {
         // 启动文件监听服务
         this.fileWatchService.start();
     }
 
     if (this.brokerOuterAPI != null) {
         // 启动 brokerOuterAPI 也就是 RemotingClient，使得 Broker 可以调用其它方
         this.brokerOuterAPI.start();
     }
 
     if (this.pullRequestHoldService != null) {
         // 启动 pullRequestHoldService 服务用于处理 Consumer 拉取消息
         this.pullRequestHoldService.start();
     }
 
     if (this.clientHousekeepingService != null) {
         // 启动 clientHousekeepingService 服务用于处理 Producer、Consumer、FilterServer 的存活
         this.clientHousekeepingService.start();
     }
 
     if (this.filterServerManager != null) {
         // 启动 filterServerManager 服务用于定时更新 FilterServer
         this.filterServerManager.start();
     }
 
     if (!messageStoreConfig.isEnableDLegerCommitLog()) {
         startProcessorByHa(messageStoreConfig.getBrokerRole());
         handleSlaveSynchronize(messageStoreConfig.getBrokerRole());
         // 注册 Broker 信息到 NameServer
         this.registerBrokerAll(true, false, true);
     }
 
     // 在注册完后，会创建定时任务发送心跳包
     this.scheduledExecutorService.scheduleAtFixedRate(new Runnable() {
 
         @Override
         public void run() {
             try {
                 // 每10s向NameSrv发送心跳包，NameSrv会定时扫描broker列表，去掉长时间没发送心跳包的broker
                 BrokerController.this.registerBrokerAll(true, false, brokerConfig.isForceRegister());
             } catch (Throwable e) {
                 log.error(&quot;registerBrokerAll Exception&quot;, e);
             }
         }
     }, 1000 * 10, Math.max(10000, Math.min(brokerConfig.getRegisterNameServerPeriod(), 60000)), TimeUnit.MILLISECONDS);
 
     if (this.brokerStatsManager != null) {
         // 启动 Broker 中的指标统计
         this.brokerStatsManager.start();
     }
 
     if (this.brokerFastFailure != null) {
         // 启动 Broker 请求列表的过期请求清除任务
         this.brokerFastFailure.start();
     }
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>调用<strong>this.registerBrokerAll</strong>方法注册broker到NameSrv上，在其内部调用<strong>doRegisterBrokerAll</strong>方法。<strong>doRegisterBrokerAll</strong>方法内部调用<strong>this.brokerOuterAPI.registerBrokerAll</strong>方法封装请求头，然后遍历NameSrv列表，向每个NameSrv发起注册请求。</p><blockquote><p>Broker启动时会向集群中所有NameServer发送心跳语句，每隔30s想集群中所有NameServer发送心跳包，NameServer收到心跳包时会更新brokerLiveTable缓存中BrokerLiveInfo的lastUpdateTimeStamp，然后NameServer每隔10s扫描brokerLiveTable，如果连续120s没有收到心跳包，NameServer将移除broker信息同时关闭Socket连接</p></blockquote><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> public synchronized void registerBrokerAll(final boolean checkOrderConfig, boolean oneway, boolean forceRegister) {
     TopicConfigSerializeWrapper topicConfigWrapper = this.getTopicConfigManager().buildTopicConfigSerializeWrapper();
 
     if (!PermName.isWriteable(this.getBrokerConfig().getBrokerPermission())
         || !PermName.isReadable(this.getBrokerConfig().getBrokerPermission())) {
         ConcurrentHashMap&lt;String, TopicConfig&gt; topicConfigTable = new ConcurrentHashMap&lt;&gt;();
         for (TopicConfig topicConfig : topicConfigWrapper.getTopicConfigTable().values()) {
             TopicConfig tmp =
                 new TopicConfig(topicConfig.getTopicName(), topicConfig.getReadQueueNums(), topicConfig.getWriteQueueNums(),
                                 this.brokerConfig.getBrokerPermission());
             topicConfigTable.put(topicConfig.getTopicName(), tmp);
         }
         topicConfigWrapper.setTopicConfigTable(topicConfigTable);
     }
 
     if (forceRegister || needRegister(this.brokerConfig.getBrokerClusterName(),
                                       this.getBrokerAddr(),
                                       this.brokerConfig.getBrokerName(),
                                       this.brokerConfig.getBrokerId(),
                                       this.brokerConfig.getRegisterBrokerTimeoutMills())) {
         doRegisterBrokerAll(checkOrderConfig, oneway, topicConfigWrapper);
     }
 }
 
 private void doRegisterBrokerAll(boolean checkOrderConfig, boolean oneway,
                                  TopicConfigSerializeWrapper topicConfigWrapper) {
     // 注册broker的信息到NameSrv上
     List&lt;RegisterBrokerResult&gt; registerBrokerResultList = this.brokerOuterAPI.registerBrokerAll(
         this.brokerConfig.getBrokerClusterName(),
         this.getBrokerAddr(),
         this.brokerConfig.getBrokerName(),
         this.brokerConfig.getBrokerId(),
         this.getHAServerAddr(),
         topicConfigWrapper,
         this.filterServerManager.buildNewFilterServerList(),
         oneway,
         this.brokerConfig.getRegisterBrokerTimeoutMills(),
         this.brokerConfig.isCompressedRegister());
 
     if (registerBrokerResultList.size() &gt; 0) {
         RegisterBrokerResult registerBrokerResult = registerBrokerResultList.get(0);
         if (registerBrokerResult != null) {
             if (this.updateMasterHAServerAddrPeriodically &amp;&amp; registerBrokerResult.getHaServerAddr() != null) {
                 this.messageStore.updateHaMasterAddress(registerBrokerResult.getHaServerAddr());
             }
 
             this.slaveSynchronize.setMasterAddr(registerBrokerResult.getMasterAddr());
 
             if (checkOrderConfig) {
                 this.getTopicConfigManager().updateOrderTopicConfig(registerBrokerResult.getKvTable());
             }
         }
     }
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>进入<strong>this.brokerOuterAPI.registerBrokerAll</strong>方法：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> public List&lt;RegisterBrokerResult&gt; registerBrokerAll(
     final String clusterName,
     final String brokerAddr,
     final String brokerName,
     final long brokerId,
     final String haServerAddr,
     final TopicConfigSerializeWrapper topicConfigWrapper,
     final List&lt;String&gt; filterServerList,
     final boolean oneway,
     final int timeoutMills,
     final boolean compressed) {
 
     // 线程安全的List 适用于写操作少的场景，因为每次都要复制副本
     final List&lt;RegisterBrokerResult&gt; registerBrokerResultList = new CopyOnWriteArrayList&lt;&gt;();
     // 获取NameServerAddress列表
     List&lt;String&gt; nameServerAddressList = this.remotingClient.getNameServerAddressList();
     if (nameServerAddressList != null &amp;&amp; nameServerAddressList.size() &gt; 0) {
 
         final RegisterBrokerRequestHeader requestHeader = new RegisterBrokerRequestHeader();
         requestHeader.setBrokerAddr(brokerAddr);
         requestHeader.setBrokerId(brokerId);
         requestHeader.setBrokerName(brokerName);
         requestHeader.setClusterName(clusterName);
         requestHeader.setHaServerAddr(haServerAddr);
         requestHeader.setCompressed(compressed);
 
         RegisterBrokerBody requestBody = new RegisterBrokerBody();
         requestBody.setTopicConfigSerializeWrapper(topicConfigWrapper);
         requestBody.setFilterServerList(filterServerList);
         final byte[] body = requestBody.encode(compressed);
         final int bodyCrc32 = UtilAll.crc32(body);
         requestHeader.setBodyCrc32(bodyCrc32);
         // 多线程批量发送请求，使用CountDownLatch同步返回
         final CountDownLatch countDownLatch = new CountDownLatch(nameServerAddressList.size());
         for (final String namesrvAddr : nameServerAddressList) {
             brokerOuterExecutor.execute(() -&gt; {
                 try {
                     RegisterBrokerResult result = registerBroker(namesrvAddr, oneway, timeoutMills, requestHeader, body);
                     if (result != null) {
                         registerBrokerResultList.add(result);
                     }
 
                     log.info(&quot;register broker[{}]to name server {} OK&quot;, brokerId, namesrvAddr);
                 } catch (Exception e) {
                     log.warn(&quot;registerBroker Exception, {}&quot;, namesrvAddr, e);
                 } finally {
                     countDownLatch.countDown();
                 }
             });
         }
 
         try {
             // 如果等待一定时间后不再等待，主线程继续执行
             countDownLatch.await(timeoutMills, TimeUnit.MILLISECONDS);
         } catch (InterruptedException e) {
         }
     }
 
     return registerBrokerResultList;
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>接下来就是发送网络请求的<strong>registerBroker</strong>方法，主要用到基于Netty封装的<strong>NettyRemotingClient</strong>，该方法设置请求的Code为<strong>REGISTER_BROKER(103)</strong> 。</p><p>然后NameSrv会接收到该注册消息，根据Code是<strong>REGISTER_BROKER(103)</strong> 调用<code>org.apache.rocketmq.namesrv.routeinfo.RouteInfoManager#registerBroker</code>方法将Broker信息保存起来，使用了读写锁。</p><h4 id="nameserver存储信息" tabindex="-1"><a class="header-anchor" href="#nameserver存储信息" aria-hidden="true">#</a> NameServer存储信息</h4><p>先看看NameServer存储了哪些路由信息，在RouteInfoManager类中：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> private final static long BROKER_CHANNEL_EXPIRED_TIME = 1000 * 60 * 2;
 private final ReadWriteLock lock = new ReentrantReadWriteLock();
 private final HashMap&lt;String/* topic */, Map&lt;String /* brokerName */ , QueueData&gt;&gt; topicQueueTable;
 private final HashMap&lt;String/* brokerName */, BrokerData&gt; brokerAddrTable;
 private final HashMap&lt;String/* clusterName */, Set&lt;String/* brokerName */&gt;&gt; clusterAddrTable;
 private final HashMap&lt;String/* brokerAddr */, BrokerLiveInfo&gt; brokerLiveTable;
 private final HashMap&lt;String/* brokerAddr */, List&lt;String&gt;/* Filter Server */&gt; filterServerTable;
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><ul><li>topicQueueTable：Topic消息队列路由信息，消息发送时根据路由表进行负载均衡。</li><li>brokerAddrTable：Broker基础信息，包含brokerName、所属集群名字，主备Broker地址。</li><li>clusterAddrTable：Broker集群信息，存储集群中所有Broker名称。</li><li>brokerLiveTable：Broker状态信息。NameServer每次收到心跳包时会替换该信息。</li><li>filterServerTable：Broker上的FilterServer列表，用于类模式消息过滤。</li></ul><blockquote><p>RocketMQ一个Topic拥有多个消息队列，一个Broker为每一主题默认创建4个读队列4个写队列。多个Broker组成一个集群，BrokerName由相同的多台Broker组成的Master-Slave架构，brokerId为0代表Master，大于0代表Slave。BrokerLiveInfo中的lastUpdateTimestamp存储上次收到Broker心跳包的时间。</p></blockquote><p>类图如下：</p><figure><img src="`+l+'" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><p>topicQueueTable、brokerAddrTable运行时结构如下：</p><figure><img src="'+o+'" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><p>brokerLiveTable、clusterAddrTable运行时结构如下：</p><figure><img src="'+c+`" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><h4 id="nameserver处理心跳包" tabindex="-1"><a class="header-anchor" href="#nameserver处理心跳包" aria-hidden="true">#</a> NameServer处理心跳包</h4><p>RouteInfoManager#registerBroker方法。分为下面几步执行：</p><p><strong>1. clusterAddrTable表维护：</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> // 防止并发修改路由表
 this.lock.writeLock().lockInterruptibly();
 // 该broker集群如果不存在，则创建新的
 Set&lt;String&gt; brokerNames = this.clusterAddrTable.computeIfAbsent(clusterName, k -&gt; new HashSet&lt;&gt;());
 brokerNames.add(brokerName);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2. brokerAddrTable表维护</strong></p><p>首先从bokerAddrTable根据brokerName尝试获取broker信息，如果不存在，则新建BrokerData并放入到bookerAddrTable中，registerFirst设置为true，表示第一次注册，否则直接替换原来的，registerFirst设置为false，表示非第一次注册</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> BrokerData brokerData = this.brokerAddrTable.get(brokerName);
 if (null == brokerData) {
     // 表示第一次注册
     registerFirst = true;
     brokerData = new BrokerData(clusterName, brokerName, new HashMap&lt;&gt;());
     this.brokerAddrTable.put(brokerName, brokerData);
 }
 Map&lt;Long, String&gt; brokerAddrsMap = brokerData.getBrokerAddrs();
 //Switch slave to master: first remove &lt;1, IP:PORT&gt; in namesrv, then add &lt;0, IP:PORT&gt;
 //The same IP:PORT must only have one record in brokerAddrTable
 // 移除旧的broker映射关系
 Iterator&lt;Entry&lt;Long, String&gt;&gt; it = brokerAddrsMap.entrySet().iterator();
 while (it.hasNext()) {
     Entry&lt;Long, String&gt; item = it.next();
     if (null != brokerAddr &amp;&amp; brokerAddr.equals(item.getValue()) &amp;&amp; brokerId != item.getKey()) {
         log.debug(&quot;remove entry {} from brokerData&quot;, item);
         it.remove();
     }
 }
 
 String oldAddr = brokerData.getBrokerAddrs().put(brokerId, brokerAddr);
 if (MixAll.MASTER_ID == brokerId) {
     log.info(&quot;cluster [{}] brokerName [{}] master address change from {} to {}&quot;,
              brokerData.getCluster(), brokerData.getBrokerName(), oldAddr, brokerAddr);
 }
 // 该broker之前是否注册过
 registerFirst = registerFirst || (null == oldAddr);
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>3. topicQueueTable维护</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> if (null != topicConfigWrapper
     &amp;&amp; MixAll.MASTER_ID == brokerId) {
     if (this.isBrokerTopicConfigChanged(brokerAddr, topicConfigWrapper.getDataVersion())
         || registerFirst) {
         ConcurrentMap&lt;String, TopicConfig&gt; tcTable =
             topicConfigWrapper.getTopicConfigTable();
         if (tcTable != null) {
             for (Map.Entry&lt;String, TopicConfig&gt; entry : tcTable.entrySet()) {
                 this.createAndUpdateQueueData(brokerName, entry.getValue());
             }
         }
     }
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>如果broker是Master，并且BrokerTopic的信息发生变化或者是初次注册，则需要创建或更新Topic路由信息，为默认Topic自动注册路由信息。</p><p><strong>4. 更新brokerLiveTable，broker存活信息，是路由删除的重要依据</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> BrokerLiveInfo prevBrokerLiveInfo = this.brokerLiveTable.put(brokerAddr,
         new BrokerLiveInfo(
                 System.currentTimeMillis(),
                 topicConfigWrapper.getDataVersion(),
                 channel,
                 haServerAddr));
 if (null == prevBrokerLiveInfo) {
     log.info(&quot;new broker registered, {} HAServer: {}&quot;, brokerAddr, haServerAddr);
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>5.注册Broker的过滤器Server地址列表</strong></p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> if (filterServerList != null) {
     if (filterServerList.isEmpty()) {
         this.filterServerTable.remove(brokerAddr);
     } else {
         this.filterServerTable.put(brokerAddr, filterServerList);
     }
 }
 
 if (MixAll.MASTER_ID != brokerId) {
     String masterAddr = brokerData.getBrokerAddrs().get(MixAll.MASTER_ID);
     if (masterAddr != null) {
         BrokerLiveInfo brokerLiveInfo = this.brokerLiveTable.get(masterAddr);
         if (brokerLiveInfo != null) {
             result.setHaServerAddr(brokerLiveInfo.getHaServerAddr());
             result.setMasterAddr(masterAddr);
         }
     }
 }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>一个Broker上会关联多个FilterServer消息过滤器。如果此Broker为从节点，则需要查找该Broker的Master节点信息，并更新对应的masterAddr属性。</p><h4 id="设计亮点" tabindex="-1"><a class="header-anchor" href="#设计亮点" aria-hidden="true">#</a> 设计亮点</h4><p>NameServer每收到一个心跳包，都会更细上述表的信息。上面源码更新各种表信息时，使用了锁粒度较小的读写锁，允许多个消息发送者并发读，保证消息高并发。但同一时刻NameServer只处理一个Broker心跳包，多个心跳包请求穿行执行。这是<strong>读写锁经典使用场景</strong>。</p><h3 id="_2-2-路由删除" tabindex="-1"><a class="header-anchor" href="#_2-2-路由删除" aria-hidden="true">#</a> 2.2 路由删除</h3><p>NameServer会每隔10s来扫描<strong>brokerLiveTable</strong>状态表，如果BrokerLive的lastUpdateTimestamp的时间戳距当前时间超过120s，则认为Broker失效，移除该Broker，同时更新<strong>topicQueueTable、brokerAddrTable、brokerLiveTable、filterServerTable</strong></p><p>RocketMQ有两个触发点触发路由删除：</p><ol><li>NameServer定时扫描brokerLiveTable检测上次心跳包与当前系统时间的时间差，如果时间戳大于120s，则需要移除该Broker信息</li><li>Broker在正常被关闭的情况下，会执行unregisterBroker指令</li></ol><p>下面介绍第一种方式：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">int</span> <span class="token function">scanNotActiveBroker</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">int</span> removeCount <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token class-name">Iterator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Entry</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">BrokerLiveInfo</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> it <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>brokerLiveTable<span class="token punctuation">.</span><span class="token function">entrySet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">iterator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>it<span class="token punctuation">.</span><span class="token function">hasNext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Entry</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">BrokerLiveInfo</span><span class="token punctuation">&gt;</span></span> next <span class="token operator">=</span> it<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">long</span> last <span class="token operator">=</span> next<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getLastUpdateTimestamp</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 判断是否</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>last <span class="token operator">+</span> <span class="token constant">BROKER_CHANNEL_EXPIRED_TIME</span><span class="token punctuation">)</span> <span class="token operator">&lt;</span> <span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">RemotingUtil</span><span class="token punctuation">.</span><span class="token function">closeChannel</span><span class="token punctuation">(</span>next<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            it<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&quot;The broker channel expired, {} {}ms&quot;</span><span class="token punctuation">,</span> next<span class="token punctuation">.</span><span class="token function">getKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> <span class="token constant">BROKER_CHANNEL_EXPIRED_TIME</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">onChannelDestroy</span><span class="token punctuation">(</span>next<span class="token punctuation">.</span><span class="token function">getKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> next<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getChannel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            removeCount<span class="token operator">++</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">return</span> removeCount<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>RouteInfoManager#onChannelDestroy</strong>方法核心处理：关闭channel，删除与该broker相关的路由信息。</p><p>第一步：申请写锁，将brokerAddress从brokerLiveTable表和filterServerTable表中移除</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">this</span><span class="token punctuation">.</span>lock<span class="token punctuation">.</span><span class="token function">writeLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">lockInterruptibly</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>brokerLiveTable<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>brokerAddrFound<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">this</span><span class="token punctuation">.</span>filterServerTable<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>brokerAddrFound<span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第二步：维护brokerAddrTable。从brokerData中的brokerAddr中找到具体的broker，从BrokerData中移除。最后如果移除后BrokerData中不再包含其他Broker，则从brokerAddrTable中移除该brokerName对应条目。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">String</span> brokerNameFound <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">boolean</span> removeBrokerName <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token class-name">Iterator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Entry</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">BrokerData</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> itBrokerAddrTable <span class="token operator">=</span>
    <span class="token keyword">this</span><span class="token punctuation">.</span>brokerAddrTable<span class="token punctuation">.</span><span class="token function">entrySet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">iterator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">while</span> <span class="token punctuation">(</span>itBrokerAddrTable<span class="token punctuation">.</span><span class="token function">hasNext</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token punctuation">(</span><span class="token keyword">null</span> <span class="token operator">==</span> brokerNameFound<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">BrokerData</span> brokerData <span class="token operator">=</span> itBrokerAddrTable<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token class-name">Iterator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Entry</span><span class="token punctuation">&lt;</span><span class="token class-name">Long</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> it <span class="token operator">=</span> brokerData<span class="token punctuation">.</span><span class="token function">getBrokerAddrs</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">entrySet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">iterator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>it<span class="token punctuation">.</span><span class="token function">hasNext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Entry</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Long</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> entry <span class="token operator">=</span> it<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Long</span> brokerId <span class="token operator">=</span> entry<span class="token punctuation">.</span><span class="token function">getKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">String</span> brokerAddr <span class="token operator">=</span> entry<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>brokerAddr<span class="token punctuation">.</span><span class="token function">equals</span><span class="token punctuation">(</span>brokerAddrFound<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            brokerNameFound <span class="token operator">=</span> brokerData<span class="token punctuation">.</span><span class="token function">getBrokerName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            it<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;remove brokerAddr[{}, {}] from brokerAddrTable, because channel destroyed&quot;</span><span class="token punctuation">,</span>
                     brokerId<span class="token punctuation">,</span> brokerAddr<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">if</span> <span class="token punctuation">(</span>brokerData<span class="token punctuation">.</span><span class="token function">getBrokerAddrs</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        removeBrokerName <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        itBrokerAddrTable<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;remove brokerName[{}] from brokerAddrTable, because channel destroyed&quot;</span><span class="token punctuation">,</span>
                 brokerData<span class="token punctuation">.</span><span class="token function">getBrokerName</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第三步：根据brokerName，从clusterAddrTable表中找到Broker并从集群中移除。移除后集群（brokerNames）中不包含任何Broker，则将该集群从clusterAddrTable中移除</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">if</span> <span class="token punctuation">(</span>brokerNameFound <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> removeBrokerName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Iterator</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Entry</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Set</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> it <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>clusterAddrTable<span class="token punctuation">.</span><span class="token function">entrySet</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">iterator</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>it<span class="token punctuation">.</span><span class="token function">hasNext</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Entry</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">,</span> <span class="token class-name">Set</span><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span><span class="token punctuation">&gt;</span></span> entry <span class="token operator">=</span> it<span class="token punctuation">.</span><span class="token function">next</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">String</span> clusterName <span class="token operator">=</span> entry<span class="token punctuation">.</span><span class="token function">getKey</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> brokerNames <span class="token operator">=</span> entry<span class="token punctuation">.</span><span class="token function">getValue</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">boolean</span> removed <span class="token operator">=</span> brokerNames<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>brokerNameFound<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>removed<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;remove brokerName[{}], clusterName[{}] from clusterAddrTable, because channel destroyed&quot;</span><span class="token punctuation">,</span>
                     brokerNameFound<span class="token punctuation">,</span> clusterName<span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token keyword">if</span> <span class="token punctuation">(</span>brokerNames<span class="token punctuation">.</span><span class="token function">isEmpty</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;remove the clusterName[{}] from clusterAddrTable, because channel destroyed and no broker in this cluster&quot;</span><span class="token punctuation">,</span>
                         clusterName<span class="token punctuation">)</span><span class="token punctuation">;</span>
                it<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            <span class="token keyword">break</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第四步：根据brokerName，遍历所有主题队列，如果队列中包含了当前Broker的队列，则移除。如果topic只包含待移除Broker的队列，从路由表中删除该topic.</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">if</span> <span class="token punctuation">(</span>removeBrokerName<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">String</span> finalBrokerNameFound <span class="token operator">=</span> brokerNameFound<span class="token punctuation">;</span>
    <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">String</span><span class="token punctuation">&gt;</span></span> needRemoveTopic <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    topicQueueTable<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span><span class="token punctuation">(</span>topic<span class="token punctuation">,</span> queueDataMap<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
        <span class="token class-name">QueueData</span> old <span class="token operator">=</span> queueDataMap<span class="token punctuation">.</span><span class="token function">remove</span><span class="token punctuation">(</span>finalBrokerNameFound<span class="token punctuation">)</span><span class="token punctuation">;</span>
        log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;remove topic[{} {}], from topicQueueTable, because channel destroyed&quot;</span><span class="token punctuation">,</span>
                 topic<span class="token punctuation">,</span> old<span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>queueDataMap<span class="token punctuation">.</span><span class="token function">size</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">info</span><span class="token punctuation">(</span><span class="token string">&quot;remove topic[{}] all queue, from topicQueueTable, because channel destroyed&quot;</span><span class="token punctuation">,</span>
                     topic<span class="token punctuation">)</span><span class="token punctuation">;</span>
            needRemoveTopic<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>topic<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    needRemoveTopic<span class="token punctuation">.</span><span class="token function">forEach</span><span class="token punctuation">(</span>topicQueueTable<span class="token operator">::</span><span class="token function">remove</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>第五步：释放锁</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">this</span><span class="token punctuation">.</span>lock<span class="token punctuation">.</span><span class="token function">writeLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">unlock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><h3 id="_2-3-路由发现" tabindex="-1"><a class="header-anchor" href="#_2-3-路由发现" aria-hidden="true">#</a> 2.3 路由发现</h3><p>启动一个生产者很简单，代码如下：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code> DefaultMQProducer producer = new DefaultMQProducer(&quot;Producer&quot;);
 producer.setNamesrvAddr(&quot;127.0.0.1:9876&quot;);
 producer.start();
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>上面先告知Producer NameSrv 的地址，紧接着调用了<strong>start</strong>启动生产者。</p><figure><img src="`+p+`" alt="image.png" tabindex="0" loading="lazy"><figcaption>image.png</figcaption></figure><p>下面会执行到<strong>org.apache.rocketmq.client.impl.factory.MQClientInstance#startScheduledTask</strong>方法，该方法也启动了一些任务：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>private void startScheduledTask() {
	......

    // 这里主要看这个方法
    this.scheduledExecutorService.scheduleAtFixedRate(new Runnable() {

        @Override
        public void run() {
            try {
                // 更新Topic的路由信息
                MQClientInstance.this.updateTopicRouteInfoFromNameServer();
            } catch (Exception e) {
                log.error(&quot;ScheduledTask updateTopicRouteInfoFromNameServer exception&quot;, e);
            }
        }
    }, 10, this.clientConfig.getPollNameServerInterval(), TimeUnit.MILLISECONDS);

	......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>主要看<strong>updateTopicRouteInfoFromNameServer</strong>这个任务：</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>    public void updateTopicRouteInfoFromNameServer() {
        Set&lt;String&gt; topicList = new HashSet&lt;String&gt;();

        // Consumer
        {
            Iterator&lt;Entry&lt;String, MQConsumerInner&gt;&gt; it = this.consumerTable.entrySet().iterator();
            while (it.hasNext()) {
                Entry&lt;String, MQConsumerInner&gt; entry = it.next();
                MQConsumerInner impl = entry.getValue();
                if (impl != null) {
                    Set&lt;SubscriptionData&gt; subList = impl.subscriptions();
                    if (subList != null) {
                        for (SubscriptionData subData : subList) {
                            topicList.add(subData.getTopic());
                        }
                    }
                }
            }
        }

        // Producer
        {
            Iterator&lt;Entry&lt;String, MQProducerInner&gt;&gt; it = this.producerTable.entrySet().iterator();
            while (it.hasNext()) {
                Entry&lt;String, MQProducerInner&gt; entry = it.next();
                MQProducerInner impl = entry.getValue();
                if (impl != null) {
                    Set&lt;String&gt; lst = impl.getPublishTopicList();
                    topicList.addAll(lst);
                }
            }
        }

        for (String topic : topicList) {
            this.updateTopicRouteInfoFromNameServer(topic);
        }
    }
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>从生产者和消费者收集Topic信息，然后遍历Topic列表，调用<strong>this.updateTopicRouteInfoFromNameServer(topic)</strong> 方法获取每个Topic的路由信息，保存到<strong>TopicRouteData</strong>中，包含Topic对应的Broker和Queue。然后将Brooker信息保存到<strong>brokerAddrTable</strong>表中。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>public class TopicRouteData extends RemotingSerializable {
    private String orderTopicConf;
    private List&lt;QueueData&gt; queueDatas;
    private List&lt;BrokerData&gt; brokerDatas;
    private HashMap&lt;String/* brokerAddr */, List&lt;String&gt;/* Filter Server */&gt; filterServerTable;
    ......
}
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>到这里，<strong>生产者就成功从NameSrv获取到了Broker信息</strong>。</p><h2 id="知识点" tabindex="-1"><a class="header-anchor" href="#知识点" aria-hidden="true">#</a> 知识点</h2><ul><li>ReentrantReadWriteLock读写锁使用</li><li>CopyOnWriteArrayList</li><li>CountDownLatch</li><li>HashMap的computeIfAbsent方法</li><li>scheduleAtFixedRate</li><li>RandomAccessFile</li><li>Runtime.getRuntime().addShutdownHook 关闭线程池</li></ul>`,91),v=[d];function k(m,b){return s(),e("div",null,v)}const h=n(u,[["render",k],["__file","RocketMQ源码解析——服务发现.html.vue"]]);export{h as default};
