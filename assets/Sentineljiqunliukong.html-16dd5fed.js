import{_ as a,r,o as t,c as o,a as e,b as i,e as l,d as c}from"./app-2cf1bcb2.js";const s={},d=c('<h2 id="介绍" tabindex="-1"><a class="header-anchor" href="#介绍" aria-hidden="true">#</a> 介绍</h2><p>为什么要使用集群流控呢？假设我们希望给某个用户限制调用某个 API 的总 QPS 为 50，但机器数可能很多（比如有 100 台）。这时候我们很自然地就想到，找一个 server 来专门来统计总的调用量，其它的实例都与这台 server 通信来判断是否可以调用。这就是最基础的集群流控的方式。</p><p>另外集群流控还可以解决流量不均匀导致总体限流效果不佳的问题。假设集群中有 10 台机器，我们给每台机器设置单机限流阈值为 10 QPS，理想情况下整个集群的限流阈值就为 100 QPS。不过实际情况下流量到每台机器可能会不均匀，会导致总量没有到的情况下某些机器就开始限流。因此仅靠单机维度去限制的话会无法精确地限制总体流量。而集群流控可以精确地控制整个集群的调用总量，结合单机限流兜底，可以更好地发挥流量控制的效果。</p><p>集群流控中共有两种身份：</p><ul><li>Token Client：集群流控客户端，用于向所属 Token Server 通信请求 token。集群限流服务端会返回给客户端结果，决定是否限流。</li><li>Token Server：即集群流控服务端，处理来自 Token Client 的请求，根据配置的集群规则判断是否应该发放 token（是否允许通过）。</li></ul><h2 id="此处先省略" tabindex="-1"><a class="header-anchor" href="#此处先省略" aria-hidden="true">#</a> 此处先省略</h2><h2 id="参考" tabindex="-1"><a class="header-anchor" href="#参考" aria-hidden="true">#</a> 参考</h2>',7),h={href:"https://github.com/alibaba/Sentinel/wiki/%E9%9B%86%E7%BE%A4%E6%B5%81%E6%8E%A7",target:"_blank",rel:"noopener noreferrer"};function _(u,k){const n=r("ExternalLinkIcon");return t(),o("div",null,[d,e("ul",null,[e("li",null,[e("a",h,[i("集群流控官方文档"),l(n)])])])])}const f=a(s,[["render",_],["__file","Sentineljiqunliukong.html.vue"]]);export{f as default};