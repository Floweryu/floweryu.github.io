import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,f as t}from"./app-5a4d8ba0.js";const e={},p=t(`<h2 id="概述" tabindex="-1"><a class="header-anchor" href="#概述" aria-hidden="true">#</a> 概述</h2><p>一个服务常常会调用别的模块，可能是另外的一个远程服务、数据库，或者第三方 API 等。例如，支付的时候，可能需要远程调用银联提供的 API；查询某个商品的价格，可能需要进行数据库查询。然而，这个被依赖服务的稳定性是不能保证的。如果依赖的服务出现了不稳定的情况，请求的响应时间变长，那么调用服务的方法的响应时间也会变长，线程会产生堆积，最终可能耗尽业务自身的线程池，服务本身也变得不可用。</p><figure><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202309182244737.png" alt="image-20230918224359647" tabindex="0" loading="lazy"><figcaption>image-20230918224359647</figcaption></figure><p>现代微服务架构都是分布式的，由非常多的服务组成。不同服务之间相互调用，组成复杂的调用链路。以上的问题在链路调用中会产生放大的效果。复杂链路上的某一环不稳定，就可能会层层级联，最终导致整个链路都不可用。因此我们需要对不稳定的<strong>弱依赖服务调用</strong>进行熔断降级，暂时切断不稳定调用，避免局部不稳定因素导致整体的雪崩。熔断降级作为保护自身的手段，通常在客户端（调用端）进行配置。</p><h2 id="熔断策略" tabindex="-1"><a class="header-anchor" href="#熔断策略" aria-hidden="true">#</a> 熔断策略</h2><p>Sentinel 提供以下几种熔断策略：</p><ul><li><p>慢调用比例 (<code>SLOW_REQUEST_RATIO</code>)：选择以慢调用比例作为阈值，需要设置以下参数：</p><ul><li>允许的慢调用 RT（即最大的响应时间）：请求的响应时间大于该值则统计为慢调用。</li><li><strong>单位统计时长（<code>statIntervalMs</code>）内请求数目大于设置的最小请求数目，并且慢调用的比例大于阈值</strong>，则接下来的熔断时长内请求会自动被熔断。经过熔断时长后熔断器会进入探测恢复状态（HALF-OPEN 状态），若接下来的一个请求响应时间小于设置的慢调用 RT 则结束熔断，若大于设置的慢调用 RT 则会再次被熔断。</li></ul></li><li><p>异常比例 (<code>ERROR_RATIO</code>)：当<strong>单位统计时长（<code>statIntervalMs</code>）内请求数目大于设置的最小请求数目，并且异常的比例大于阈值</strong>，则接下来的熔断时长内请求会自动被熔断。经过熔断时长后熔断器会进入探测恢复状态（HALF-OPEN 状态），若接下来的一个请求成功完成（没有错误）则结束熔断，否则会再次被熔断。异常比率的阈值范围是 <code>[0.0, 1.0]</code>，代表 0% - 100%。</p></li><li><p>异常数 (<code>ERROR_COUNT</code>)：当单位统计时长内的<strong>异常数目</strong>超过阈值之后会自动进行熔断。经过熔断时长后熔断器会进入探测恢复状态（HALF-OPEN 状态），若接下来的一个请求成功完成（没有错误）则结束熔断，否则会再次被熔断。</p></li></ul><p>注意异常降级<strong>仅针对业务异常</strong>，对 Sentinel 限流降级本身的异常（<code>BlockException</code>）不生效。为了统计异常比例或异常数，需要通过 <code>Tracer.trace(ex)</code> 记录业务异常。示例：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">Entry</span> entry <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
<span class="token keyword">try</span> <span class="token punctuation">{</span>
  entry <span class="token operator">=</span> <span class="token class-name">SphU</span><span class="token punctuation">.</span><span class="token function">entry</span><span class="token punctuation">(</span>resource<span class="token punctuation">)</span><span class="token punctuation">;</span>

  <span class="token comment">// Write your biz code here.</span>
  <span class="token comment">// &lt;&lt;BIZ CODE&gt;&gt;</span>
<span class="token punctuation">}</span> <span class="token keyword">catch</span> <span class="token punctuation">(</span><span class="token class-name">Throwable</span> t<span class="token punctuation">)</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token class-name">BlockException</span><span class="token punctuation">.</span><span class="token function">isBlockException</span><span class="token punctuation">(</span>t<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Tracer</span><span class="token punctuation">.</span><span class="token function">trace</span><span class="token punctuation">(</span>t<span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span>
  <span class="token keyword">if</span> <span class="token punctuation">(</span>entry <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    entry<span class="token punctuation">.</span><span class="token function">exit</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
  <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="熔断降级规则说明" tabindex="-1"><a class="header-anchor" href="#熔断降级规则说明" aria-hidden="true">#</a> 熔断降级规则说明</h2><p>熔断降级规则（DegradeRule）包含下面几个重要的属性：</p><table><thead><tr><th style="text-align:left;">Field</th><th>说明</th><th>默认值</th></tr></thead><tbody><tr><td style="text-align:left;">resource</td><td>资源名，即规则的作用对象</td><td></td></tr><tr><td style="text-align:left;">grade</td><td>熔断策略，支持<strong>慢调用比例</strong>、<strong>异常比例</strong>、<strong>异常数策略</strong></td><td>慢调用比例</td></tr><tr><td style="text-align:left;">count</td><td><strong>慢调用比例</strong>模式下：慢调用临界 RT（超出该值计为慢调用）；<strong>异常比例/异常数模式</strong>：为对应的阈值</td><td></td></tr><tr><td style="text-align:left;">timeWindow</td><td>熔断时长，单位为 s</td><td></td></tr><tr><td style="text-align:left;">minRequestAmount</td><td>熔断触发的最小请求数，请求数小于该值时即使异常比率超出阈值也不会熔断（1.7.0 引入）</td><td>5</td></tr><tr><td style="text-align:left;">statIntervalMs</td><td>统计时长（单位为 ms），如 60*1000 代表分钟级（1.8.0 引入）</td><td>1000 ms</td></tr><tr><td style="text-align:left;">slowRatioThreshold</td><td>慢调用比例阈值，仅慢调用比例模式有效（1.8.0 引入）</td><td></td></tr></tbody></table><h2 id="熔断器事件监听" tabindex="-1"><a class="header-anchor" href="#熔断器事件监听" aria-hidden="true">#</a> 熔断器事件监听</h2><p>Sentinel 支持注册自定义的事件监听器监听熔断器状态变换事件（state change event）。示例：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">EventObserverRegistry</span><span class="token punctuation">.</span><span class="token function">getInstance</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">.</span><span class="token function">addStateChangeObserver</span><span class="token punctuation">(</span><span class="token string">&quot;logging&quot;</span><span class="token punctuation">,</span>
    <span class="token punctuation">(</span>prevState<span class="token punctuation">,</span> newState<span class="token punctuation">,</span> rule<span class="token punctuation">,</span> snapshotValue<span class="token punctuation">)</span> <span class="token operator">-&gt;</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>newState <span class="token operator">==</span> <span class="token class-name">State</span><span class="token punctuation">.</span><span class="token constant">OPEN</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 变换至 OPEN state 时会携带触发时的值</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>err<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;%s -&gt; OPEN at %d, snapshotValue=%.2f&quot;</span><span class="token punctuation">,</span> prevState<span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                <span class="token class-name">TimeUtil</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> snapshotValue<span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token class-name">System</span><span class="token punctuation">.</span>err<span class="token punctuation">.</span><span class="token function">println</span><span class="token punctuation">(</span><span class="token class-name">String</span><span class="token punctuation">.</span><span class="token function">format</span><span class="token punctuation">(</span><span class="token string">&quot;%s -&gt; %s at %d&quot;</span><span class="token punctuation">,</span> prevState<span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> newState<span class="token punctuation">.</span><span class="token function">name</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span>
                <span class="token class-name">TimeUtil</span><span class="token punctuation">.</span><span class="token function">currentTimeMillis</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,15),o=[p];function c(l,i){return s(),a("div",null,o)}const d=n(e,[["render",c],["__file","Sentinel熔断降级.html.vue"]]);export{d as default};
