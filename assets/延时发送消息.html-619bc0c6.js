import{_ as a}from"./plugin-vue_export-helper-c27b6911.js";import{r as t,o as e,c as p,a as n,b as o,d as c,f as l}from"./app-5a4d8ba0.js";const u={},i=l(`<h4 id="发送延时消息" tabindex="-1"><a class="header-anchor" href="#发送延时消息" aria-hidden="true">#</a> 发送延时消息</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ScheduledMessageProducer</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token class-name">DefaultMQProducer</span> producer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultMQProducer</span><span class="token punctuation">(</span><span class="token string">&quot;delay_producer_group&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        producer<span class="token punctuation">.</span><span class="token function">setNamesrvAddr</span><span class="token punctuation">(</span><span class="token string">&quot;106.15.42.999:9876&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        producer<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token keyword">int</span> totalMessageToSend <span class="token operator">=</span> <span class="token number">100</span><span class="token punctuation">;</span>
        
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> totalMessageToSend<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">Message</span> message <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Message</span><span class="token punctuation">(</span><span class="token string">&quot;TopicTest&quot;</span><span class="token punctuation">,</span> <span class="token punctuation">(</span><span class="token string">&quot;Hello scheduled message &quot;</span> <span class="token operator">+</span> i<span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">getBytes</span><span class="token punctuation">(</span><span class="token class-name">StandardCharsets</span><span class="token punctuation">.</span><span class="token constant">UTF_8</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 设置延时等级3，这个消息将在10s后发送（现在只支持固定的几个时间，详情查看delayTimeLevel）</span>
            message<span class="token punctuation">.</span><span class="token function">setDelayTimeLevel</span><span class="token punctuation">(</span><span class="token number">3</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            producer<span class="token punctuation">.</span><span class="token function">send</span><span class="token punctuation">(</span>message<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        producer<span class="token punctuation">.</span><span class="token function">shutdown</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="消费消息" tabindex="-1"><a class="header-anchor" href="#消费消息" aria-hidden="true">#</a> 消费消息</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">ScheduledMessageConsumer</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">static</span> <span class="token keyword">void</span> <span class="token function">main</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">[</span><span class="token punctuation">]</span> args<span class="token punctuation">)</span> <span class="token keyword">throws</span> <span class="token class-name">Exception</span> <span class="token punctuation">{</span>
        <span class="token comment">// 实例化消费者</span>
        <span class="token class-name">DefaultMQPushConsumer</span> consumer <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">DefaultMQPushConsumer</span><span class="token punctuation">(</span><span class="token string">&quot;delay_consumer_group&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        consumer<span class="token punctuation">.</span><span class="token function">setNamesrvAddr</span><span class="token punctuation">(</span><span class="token string">&quot;106.15.42.999:9876&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        consumer<span class="token punctuation">.</span><span class="token function">subscribe</span><span class="token punctuation">(</span><span class="token string">&quot;TopicTest&quot;</span><span class="token punctuation">,</span> <span class="token string">&quot;*&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token comment">// 注册消息监听者</span>
        consumer<span class="token punctuation">.</span><span class="token function">registerMessageListener</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">MessageListenerConcurrently</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token annotation punctuation">@Override</span>
            <span class="token keyword">public</span> <span class="token class-name">ConsumeConcurrentlyStatus</span> <span class="token function">consumeMessage</span><span class="token punctuation">(</span><span class="token class-name">List</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">MessageExt</span><span class="token punctuation">&gt;</span></span> messages<span class="token punctuation">,</span> <span class="token class-name">ConsumeConcurrentlyContext</span> context<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">MessageExt</span> message <span class="token operator">:</span> messages<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    <span class="token comment">// Print approximate delay time period</span>
                    <span class="token class-name">System</span><span class="token punctuation">.</span>out<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token string">&quot;Receive message[msgId=&quot;</span> <span class="token operator">+</span> message<span class="token punctuation">.</span><span class="token function">getMsgId</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;] &quot;</span> <span class="token operator">+</span> <span class="token punctuation">(</span><span class="token class-name">System</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">-</span> message<span class="token punctuation">.</span><span class="token function">getBornTimestamp</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">+</span> <span class="token string">&quot;ms later&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">return</span> <span class="token class-name">ConsumeConcurrentlyStatus</span><span class="token punctuation">.</span><span class="token constant">CONSUME_SUCCESS</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        consumer<span class="token punctuation">.</span><span class="token function">start</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="验证" tabindex="-1"><a class="header-anchor" href="#验证" aria-hidden="true">#</a> 验证</h4><p>消息的消费比存储时间晚10秒。</p><p>####　延时消息的使用场景</p><p>比如电商里，提交了一个订单就可以发送一个延时消息，1h后去检查这个订单的状态，如果还是未付款就取消订单释放库存。</p><h4 id="延时消息的使用限制" tabindex="-1"><a class="header-anchor" href="#延时消息的使用限制" aria-hidden="true">#</a> 延时消息的使用限制</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">private</span> <span class="token class-name">String</span> messageDelayLevel <span class="token operator">=</span> <span class="token string">&quot;1s 5s 10s 30s 1m 2m 3m 4m 5m 6m 7m 8m 9m 10m 20m 30m 1h 2h&quot;</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div></div></div><p>现在RocketMq并不支持任意时间的延时，需要设置几个固定的延时等级，从1s到2h分别对应着等级1到18 消息消费失败会进入延时消息队列，消息发送时间与设置的延时等级和重试次数有关，详见代码<code>SendMessageProcessor.java</code></p><h4 id="原文链接" tabindex="-1"><a class="header-anchor" href="#原文链接" aria-hidden="true">#</a> 原文链接</h4>`,12),r={href:"https://github.com/apache/rocketmq/blob/master/docs/cn/RocketMQ_Example.md",target:"_blank",rel:"noopener noreferrer"};function k(d,m){const s=t("ExternalLinkIcon");return e(),p("div",null,[i,n("ul",null,[n("li",null,[n("a",r,[o("RocketMQ官方文档"),c(s)])])])])}const g=a(u,[["render",k],["__file","延时发送消息.html.vue"]]);export{g as default};
