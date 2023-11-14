import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,f as t}from"./app-5a4d8ba0.js";const e={},p=t(`<h2 id="一、前言" tabindex="-1"><a class="header-anchor" href="#一、前言" aria-hidden="true">#</a> 一、前言</h2><p>存储方式和效率：文件系统 &gt; KV存储 &gt; 关系型数据库。直接操作文件系统肯定是最快的，但是可靠性低，这一点上关系型数据库与文件系统刚好相反。</p><h2 id="二、消息存储整体架构" tabindex="-1"><a class="header-anchor" href="#二、消息存储整体架构" aria-hidden="true">#</a> 二、消息存储整体架构</h2><p>消息存储架构图中主要有下面三个跟消息存储相关的文件构成：CommitLog、ConsumeQueue、IndexFile。</p><ul><li>CommitLog：<strong>消息存储文件</strong>，所有的主题消息都存储在CommitLog中。消息内容不定长，单个文件大小默认1G，文件名长度为20位，左边补零，剩余为起始偏移量，比如：00000000000000000000代表了第一个文件，起始偏移量为0，文件大小为1G=1073741824；当第一个文件写满了，第二个文件为00000000001073741824，起始偏移量为1073741824，以此类推。消息主要是顺序写入日志文件，当文件满了，写入下一个文件。</li><li>ConsumeQueue：<strong>消息消费索引</strong>，引入的目的主要是提高消息消费的性能。由于RocketMQ是基于主题topic的订阅模式，消息消费是针对主题进行的，如果要遍历commitlog文件，根据topic检索消息是非常低效的。Consumer可根据ConsumeQueue来查找待消费的消息。其中，ConsumeQueue作为消费消息的索引，<strong>保存了指定Topic下的队列消息在CommitLog中的起始物理偏移量offset，消息大小size和消息Tag的HashCode值</strong>。consumequeue文件可以看成是基于topic的commitlog索引文件，故consumequeue文件夹的组织方式如下：topic/queue/file三层组织结构，具体存储路径为：$HOME/store/consumequeue/{topic}/{queueId}/{fileName}。同样consumequeue文件采取定长设计，每一个条目共20个字节，分别为8字节的commitlog物理偏移量、4字节的消息长度、8字节tag hashcode，单个文件由30W个条目组成，可以像数组一样随机访问每一个条目，每个ConsumeQueue文件大小约5.72M；</li><li>IndexFile：<strong>提供了一种可以通过key或时间区间来查询消息的方法</strong>。Index文件的存储位置是：$HOME/store/index/{fileName}，文件名fileName是以创建时的时间戳命名的，固定的单个IndexFile文件大小约为400M，一个IndexFile可以保存 2000W个索引，IndexFile的底层存储设计为在文件系统中实现HashMap结构，故RocketMQ的索引文件其底层实现为hash索引。</li></ul><p>RocketMQ采用的是混合型的存储结构，即为Broker单个实例下所有的队列共用一个日志数据文件（即为CommitLog）来存储。RocketMQ的混合型存储结构(多个Topic的消息实体内容都存储于一个CommitLog中)针对Producer和Consumer分别采用了数据和索引部分相分离的存储结构，Producer发送消息至Broker端，然后Broker端使用同步或者异步的方式对消息刷盘持久化，保存至CommitLog中。只要消息被刷盘持久化至磁盘文件CommitLog中，那么Producer发送的消息就不会丢失。正因为如此，Consumer也就肯定有机会去消费这条消息。当无法拉取到消息后，可以等下一次消息拉取，同时服务端也支持长轮询模式，如果一个消息拉取请求未拉取到消息，Broker允许等待30s的时间，只要这段时间内有新消息到达，将直接返回给消费端。这里，RocketMQ的具体做法是，使用Broker端的后台服务线程—ReputMessageService不停地分发请求并异步构建ConsumeQueue（逻辑消费队列）和IndexFile（索引文件）数据。</p><h2 id="三、消息存储实现类" tabindex="-1"><a class="header-anchor" href="#三、消息存储实现类" aria-hidden="true">#</a> 三、消息存储实现类</h2><p>消息存储实现类：org.apache.rocketmq.store.DefaultMessageStore，操作存储文件的API核心类，介绍一下里面的属性：</p><table><thead><tr><th>字段</th><th style="text-align:left;">含义</th></tr></thead><tbody><tr><td>MessageStoreConfig</td><td style="text-align:left;">消息存储配置属性</td></tr><tr><td>CommitLog</td><td style="text-align:left;">commitLog文件存储实现类</td></tr><tr><td>ConcurrentMap&lt;String/* topic <em>/, ConcurrentMap&lt;Integer/</em> queueId */, ConsumeQueue&gt;&gt; consumeQueueTable</td><td style="text-align:left;">消息队列存储缓存表，按消息主题分组</td></tr><tr><td>FlushConsumeQueueService</td><td style="text-align:left;">消息队列文件ConsumeQueue刷盘线程</td></tr><tr><td>CleanCommitLogService</td><td style="text-align:left;">清楚CommitLog文件服务</td></tr><tr><td>CleanConsumeQueueService</td><td style="text-align:left;">清楚ConsumeQueue文件服务</td></tr><tr><td>IndexService</td><td style="text-align:left;">索引文件实现类</td></tr><tr><td>AllocateMappedFileService</td><td style="text-align:left;">MapedFile分配服务</td></tr><tr><td>ReputMessageService</td><td style="text-align:left;">CommitLog消息分发，根据CommitLog文件构建ConsumeQueue、IndexFile文件</td></tr><tr><td>HAService</td><td style="text-align:left;">存储HA机制</td></tr><tr><td>TransientStorePool</td><td style="text-align:left;">消息堆内存缓存</td></tr><tr><td>MessageArrivingListener</td><td style="text-align:left;">消息拉取长轮询模式消息达到监听器</td></tr><tr><td>BrokerConfig</td><td style="text-align:left;">Broker配置属性</td></tr><tr><td>StoreCheckpoint</td><td style="text-align:left;">文件刷盘检测点</td></tr><tr><td>LinkedList&lt; CommitLogDispatcher &gt;</td><td style="text-align:left;">CommitLog文件转发请求</td></tr></tbody></table><h2 id="四、消息发送存储流程" tabindex="-1"><a class="header-anchor" href="#四、消息发送存储流程" aria-hidden="true">#</a> 四、消息发送存储流程</h2><p>消息存储源码入口：<strong>org.apache.rocketmq.store.DefaultMessageStore#putMessage</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">PutMessageResult</span> <span class="token function">putMessage</span><span class="token punctuation">(</span><span class="token class-name">MessageExtBrokerInner</span> msg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">return</span> <span class="token function">waitForPutResult</span><span class="token punctuation">(</span><span class="token function">asyncPutMessage</span><span class="token punctuation">(</span>msg<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_1-检查存储状态" tabindex="-1"><a class="header-anchor" href="#_1-检查存储状态" aria-hidden="true">#</a> 1. 检查存储状态</h4><p><strong>org.apache.rocketmq.store.DefaultMessageStore#checkStoreStatus</strong>方法，下面几种拒绝消息写入：</p><ul><li>当前Broker停止工作</li><li>当前Broker为SLAVE角色，不能写入</li><li>当前Rocket不支持写入：可能因为broker的磁盘已满、写入逻辑队列错误、写入索引文件错误等原因。</li><li>操作系统页缓存繁忙：broker持有锁的时间超过<strong>osPageCacheBusyTimeOutMills</strong>，则算作操作系统页缓存繁忙。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token class-name">PutMessageStatus</span> <span class="token function">checkStoreStatus</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 当前Broker停止工作</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>shutdown<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&quot;message store has shutdown, so putMessage is forbidden&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">SERVICE_NOT_AVAILABLE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 当前Broker为SLAVE角色，不能写入</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token class-name">BrokerRole</span><span class="token punctuation">.</span><span class="token constant">SLAVE</span> <span class="token operator">==</span> <span class="token keyword">this</span><span class="token punctuation">.</span>messageStoreConfig<span class="token punctuation">.</span><span class="token function">getBrokerRole</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">long</span> value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>printTimes<span class="token punctuation">.</span><span class="token function">getAndIncrement</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>value <span class="token operator">%</span> <span class="token number">50000</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&quot;broke role is slave, so putMessage is forbidden&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">SERVICE_NOT_AVAILABLE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 当前Rocket不支持写入：可能因为broker的磁盘已满、写入逻辑队列错误、写入索引文件错误等原因。</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token keyword">this</span><span class="token punctuation">.</span>runningFlags<span class="token punctuation">.</span><span class="token function">isWriteable</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">long</span> value <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>printTimes<span class="token punctuation">.</span><span class="token function">getAndIncrement</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token punctuation">(</span>value <span class="token operator">%</span> <span class="token number">50000</span><span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&quot;the message store is not writable. It may be caused by one of the following reasons: &quot;</span> <span class="token operator">+</span>
                     <span class="token string">&quot;the broker&#39;s disk is full, write to logic queue error, write to index file error, etc&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">SERVICE_NOT_AVAILABLE</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token keyword">this</span><span class="token punctuation">.</span>printTimes<span class="token punctuation">.</span><span class="token function">set</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 操作系统页缓存繁忙：broker持有锁的时间超过**osPageCacheBusyTimeOutMills**，则算作操作系统页缓存繁忙。</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">isOSPageCacheBusy</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">OS_PAGECACHE_BUSY</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">PUT_OK</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token annotation punctuation">@Override</span>
<span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">isOSPageCacheBusy</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">long</span> begin <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getCommitLog</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getBeginTimeInLock</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">long</span> diff <span class="token operator">=</span> <span class="token keyword">this</span><span class="token punctuation">.</span>systemClock<span class="token punctuation">.</span><span class="token function">now</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> begin<span class="token punctuation">;</span>

    <span class="token keyword">return</span> diff <span class="token operator">&lt;</span> <span class="token number">10000000</span>
        <span class="token operator">&amp;&amp;</span> diff <span class="token operator">&gt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>messageStoreConfig<span class="token punctuation">.</span><span class="token function">getOsPageCacheBusyTimeOutMills</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_2-检查消息是否合法" tabindex="-1"><a class="header-anchor" href="#_2-检查消息是否合法" aria-hidden="true">#</a> 2. 检查消息是否合法</h4><p><strong>org.apache.rocketmq.store.DefaultMessageStore#checkMessage</strong>方法，判断条件：</p><ul><li>topic的字符串长度不能大于127</li><li>消息字符串长度不能大于32767</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token class-name">PutMessageStatus</span> <span class="token function">checkMessage</span><span class="token punctuation">(</span><span class="token class-name">MessageExtBrokerInner</span> msg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// topic的字符串长度不能大于127</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getTopic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token class-name">Byte</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&quot;putMessage message topic length too long &quot;</span> <span class="token operator">+</span> msg<span class="token punctuation">.</span><span class="token function">getTopic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">MESSAGE_ILLEGAL</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 消息字符串长度不能大于32767</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getPropertiesString</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> msg<span class="token punctuation">.</span><span class="token function">getPropertiesString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token class-name">Short</span><span class="token punctuation">.</span><span class="token constant">MAX_VALUE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        log<span class="token punctuation">.</span><span class="token function">warn</span><span class="token punctuation">(</span><span class="token string">&quot;putMessage message properties length too long &quot;</span> <span class="token operator">+</span> msg<span class="token punctuation">.</span><span class="token function">getPropertiesString</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">length</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">MESSAGE_ILLEGAL</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">PUT_OK</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_3-检查-light-message-queue-lmq-即微消息队列" tabindex="-1"><a class="header-anchor" href="#_3-检查-light-message-queue-lmq-即微消息队列" aria-hidden="true">#</a> 3. 检查 light message queue(LMQ)，即微消息队列</h4><p><strong>org.apache.rocketmq.store.DefaultMessageStore#checkLmqMessage</strong>方法：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token class-name">PutMessageStatus</span> <span class="token function">checkLmqMessage</span><span class="token punctuation">(</span><span class="token class-name">MessageExtBrokerInner</span> msg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getProperties</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">!=</span> <span class="token keyword">null</span>
        <span class="token operator">&amp;&amp;</span> <span class="token class-name">StringUtils</span><span class="token punctuation">.</span><span class="token function">isNotBlank</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getProperty</span><span class="token punctuation">(</span><span class="token class-name">MessageConst</span><span class="token punctuation">.</span><span class="token constant">PROPERTY_INNER_MULTI_DISPATCH</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">isLmqConsumeQueueNumExceeded</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">LMQ_CONSUME_QUEUE_NUM_EXCEEDED</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token class-name">PutMessageStatus</span><span class="token punctuation">.</span><span class="token constant">PUT_OK</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token keyword">private</span> <span class="token keyword">boolean</span> <span class="token function">isLmqConsumeQueueNumExceeded</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getMessageStoreConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">isEnableLmq</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span><span class="token function">getMessageStoreConfig</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">isEnableMultiDispatch</span><span class="token punctuation">(</span><span class="token punctuation">)</span>
        <span class="token operator">&amp;&amp;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>lmqConsumeQueueNum<span class="token punctuation">.</span><span class="token function">get</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>messageStoreConfig<span class="token punctuation">.</span><span class="token function">getMaxLmqConsumeQueueNum</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="_4-开始存储消息到commitlog" tabindex="-1"><a class="header-anchor" href="#_4-开始存储消息到commitlog" aria-hidden="true">#</a> 4. 开始存储消息到commitLog</h4><p><strong>org.apache.rocketmq.store.CommitLog#asyncPutMessage</strong>方法：</p><p><strong>1. 设置消息存储时间和CRC(速度快)</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code>msg<span class="token punctuation">.</span><span class="token function">setStoreTimestamp</span><span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token comment">// Set the message body BODY CRC (consider the most appropriate setting</span>
<span class="token comment">// on the client)</span>
msg<span class="token punctuation">.</span><span class="token function">setBodyCRC</span><span class="token punctuation">(</span><span class="token class-name">UtilAll</span><span class="token punctuation">.</span><span class="token function">crc32</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getBody</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>2. 如果消息有延迟级别并且不是事务消息</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">final</span> <span class="token keyword">int</span> tranType <span class="token operator">=</span> <span class="token class-name">MessageSysFlag</span><span class="token punctuation">.</span><span class="token function">getTransactionValue</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getSysFlag</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token keyword">if</span> <span class="token punctuation">(</span>tranType <span class="token operator">==</span> <span class="token class-name">MessageSysFlag</span><span class="token punctuation">.</span><span class="token constant">TRANSACTION_NOT_TYPE</span>
    <span class="token operator">||</span> tranType <span class="token operator">==</span> <span class="token class-name">MessageSysFlag</span><span class="token punctuation">.</span><span class="token constant">TRANSACTION_COMMIT_TYPE</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Delay Delivery</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getDelayTimeLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 提供以下延迟级别： 1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h 不得大于最大值</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getDelayTimeLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&gt;</span> <span class="token keyword">this</span><span class="token punctuation">.</span>defaultMessageStore<span class="token punctuation">.</span><span class="token function">getScheduleMessageService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getMaxDelayLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            msg<span class="token punctuation">.</span><span class="token function">setDelayTimeLevel</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">.</span>defaultMessageStore<span class="token punctuation">.</span><span class="token function">getScheduleMessageService</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getMaxDelayLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 将topic换成RMQ_SYS_SCHEDULE_TOPIC延迟消息</span>
        topic <span class="token operator">=</span> <span class="token class-name">TopicValidator</span><span class="token punctuation">.</span><span class="token constant">RMQ_SYS_SCHEDULE_TOPIC</span><span class="token punctuation">;</span>
        <span class="token comment">// 消息队列id换成延迟消息队列id</span>
        <span class="token keyword">int</span> queueId <span class="token operator">=</span> <span class="token class-name">ScheduleMessageService</span><span class="token punctuation">.</span><span class="token function">delayLevel2QueueId</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getDelayTimeLevel</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// Backup real topic, queueId</span>
        <span class="token class-name">MessageAccessor</span><span class="token punctuation">.</span><span class="token function">putProperty</span><span class="token punctuation">(</span>msg<span class="token punctuation">,</span> <span class="token class-name">MessageConst</span><span class="token punctuation">.</span><span class="token constant">PROPERTY_REAL_TOPIC</span><span class="token punctuation">,</span> msg<span class="token punctuation">.</span><span class="token function">getTopic</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">MessageAccessor</span><span class="token punctuation">.</span><span class="token function">putProperty</span><span class="token punctuation">(</span>msg<span class="token punctuation">,</span> <span class="token class-name">MessageConst</span><span class="token punctuation">.</span><span class="token constant">PROPERTY_REAL_QUEUE_ID</span><span class="token punctuation">,</span> <span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">valueOf</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getQueueId</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        msg<span class="token punctuation">.</span><span class="token function">setPropertiesString</span><span class="token punctuation">(</span><span class="token class-name">MessageDecoder</span><span class="token punctuation">.</span><span class="token function">messageProperties2String</span><span class="token punctuation">(</span>msg<span class="token punctuation">.</span><span class="token function">getProperties</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        msg<span class="token punctuation">.</span><span class="token function">setTopic</span><span class="token punctuation">(</span>topic<span class="token punctuation">)</span><span class="token punctuation">;</span>
        msg<span class="token punctuation">.</span><span class="token function">setQueueId</span><span class="token punctuation">(</span>queueId<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,29),o=[p];function c(u,l){return s(),a("div",null,o)}const r=n(e,[["render",c],["__file","RocketMQ源码解析——消息存储.html.vue"]]);export{r as default};
