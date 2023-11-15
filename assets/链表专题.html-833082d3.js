import{_ as t}from"./plugin-vue_export-helper-c27b6911.js";import{r as p,o,c,a as s,b as n,e as l,d as a}from"./app-681ce575.js";const i={},u=a(`<h2 id="_92-反转链表-ii" tabindex="-1"><a class="header-anchor" href="#_92-反转链表-ii" aria-hidden="true">#</a> 92. 反转链表 II</h2><blockquote><p>给你单链表的头指针 <code>head</code> 和两个整数 <code>left</code> 和 <code>right</code> ，其中 <code>left &lt;= right</code> 。请你反转从位置 <code>left</code> 到位置 <code>right</code> 的链表节点，返回 <strong>反转后的链表</strong> 。</p><figure><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092110833.jpg" alt="img" tabindex="0" loading="lazy"><figcaption>img</figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,2,3,4,5], left = 2, right = 4
输出：[1,4,3,2,5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [5], left = 1, right = 1
输出：[5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解-穿针引线" tabindex="-1"><a class="header-anchor" href="#题解-穿针引线" aria-hidden="true">#</a> 题解：穿针引线</h4><p>思路很简单，分两步：</p><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092110158.png" alt="image-20230328124651700" style="zoom:50%;"><ol><li>先将区间部分链表反转</li><li>把<code>pre.next</code>的<code>next</code>指向反转以后的链表头结点，把反转以后的链表尾结点 <code>next</code>指针指向<code>succ</code>。</li></ol><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Definition for singly-linked list.
 * public class ListNode <span class="token punctuation">{</span>
 *     int val;
 *     ListNode next;
 *     ListNode() <span class="token punctuation">{</span><span class="token punctuation">}</span>
 *     ListNode(int val) <span class="token punctuation">{</span> this.val = val; <span class="token punctuation">}</span>
 *     ListNode(int val, ListNode next) <span class="token punctuation">{</span> this.val = val; this.next = next; <span class="token punctuation">}</span>
 * <span class="token punctuation">}</span>
 */</span>
<span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">reverseBetween</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">,</span> <span class="token keyword">int</span> left<span class="token punctuation">,</span> <span class="token keyword">int</span> right<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ListNode</span> header <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        header<span class="token punctuation">.</span>next <span class="token operator">=</span> head<span class="token punctuation">;</span>
        
        <span class="token class-name">ListNode</span> pre <span class="token operator">=</span> header<span class="token punctuation">;</span>
        <span class="token comment">// 寻找到left的前一个节点</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> left <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            pre <span class="token operator">=</span> pre<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        
        <span class="token class-name">ListNode</span> rightNode <span class="token operator">=</span> pre<span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> left<span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> right<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            rightNode <span class="token operator">=</span> rightNode<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        
        <span class="token comment">// 记录区间左节点</span>
        <span class="token class-name">ListNode</span> leftNode <span class="token operator">=</span> pre<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token comment">// 记录区间右节点</span>
        <span class="token class-name">ListNode</span> tailNode <span class="token operator">=</span> rightNode<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token comment">// 切断链表关系</span>
        pre<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        rightNode<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        
        <span class="token function">reverseLink</span><span class="token punctuation">(</span>leftNode<span class="token punctuation">)</span><span class="token punctuation">;</span>
        
        <span class="token comment">// 经过反转后, rightNode变成了头结点</span>
        pre<span class="token punctuation">.</span>next <span class="token operator">=</span> rightNode<span class="token punctuation">;</span>
        <span class="token comment">// 尾结点变成了头结点</span>
        leftNode<span class="token punctuation">.</span>next <span class="token operator">=</span> tailNode<span class="token punctuation">;</span>
        <span class="token keyword">return</span> header<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token keyword">public</span> <span class="token keyword">void</span> <span class="token function">reverseLink</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ListNode</span> pre <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 先将下一个节点保存</span>
            <span class="token class-name">ListNode</span> next <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token comment">// 当前节点的next指向尾结点</span>
            cur<span class="token punctuation">.</span>next <span class="token operator">=</span> pre<span class="token punctuation">;</span>
            <span class="token comment">// pre指向当前节点, 作为尾结点</span>
            pre <span class="token operator">=</span> cur<span class="token punctuation">;</span>
            <span class="token comment">// 当前指针后移一个节点</span>
            cur <span class="token operator">=</span> next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_25-k-个一组翻转链表" tabindex="-1"><a class="header-anchor" href="#_25-k-个一组翻转链表" aria-hidden="true">#</a> 25. K 个一组翻转链表</h2><blockquote><p>https://leetcode.cn/problems/reverse-nodes-in-k-group/</p><p>给你链表的头节点 <code>head</code> ，每 <code>k</code> 个节点一组进行翻转，请你返回修改后的链表。</p><p><code>k</code> 是一个正整数，它的值小于或等于链表的长度。如果节点总数不是 <code>k</code> 的整数倍，那么请将最后剩余的节点保持原有顺序。</p><p>你不能只是单纯的改变节点内部的值，而是需要实际进行节点交换。</p><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092110295.png" alt="image-20230328210057463" style="zoom:50%;"><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,2,3,4,5], k = 2
输出：[2,1,4,3,5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092110585.png" alt="image-20230328210121946" style="zoom:50%;"><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,2,3,4,5], k = 3
输出：[3,2,1,4,5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解-寻找区间后反转区间链表" tabindex="-1"><a class="header-anchor" href="#题解-寻找区间后反转区间链表" aria-hidden="true">#</a> 题解：寻找区间后反转区间链表</h4><p><strong>思路</strong>：</p><ul><li>初始需要两个变量<code>pre</code>和<code>end</code>：<code>pre</code>记录每次需要反转链表的前一个节点，<code>end</code>记录每次反转链表的尾结点。</li><li>每次寻找k个节点，<code>end</code>指向每次反转链表的尾结点。如果<code>end</code>为<code>null</code>，说明不足k个。</li><li><code>next</code>指向<code>end.next</code>：目的是为了反转后将链表接回到原链表。</li><li><code>end.next = null</code>：每次反转前要断开与原链表的联系。</li><li><code>start</code>指向反转链表头结点：目的是为了反转链表和将反转链表链接回原链表。</li><li>一次反转后，连接反转链表注意：原来的<code>next</code>变成了头结点；原来的<code>start</code>变成了尾结点。</li><li>一次反转后，<code>pre</code>和<code>end</code>指向<code>start</code>，即下一次反转链表的前一个节点。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">reverseKGroup</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">,</span> <span class="token keyword">int</span> k<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>head <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> head<span class="token punctuation">.</span>next <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> head<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 构建一个假节点</span>
        <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        dummy<span class="token punctuation">.</span>next <span class="token operator">=</span> head<span class="token punctuation">;</span>
        
        <span class="token comment">// 指向每次要反转链表的头结点的上一个节点</span>
        <span class="token class-name">ListNode</span> pre <span class="token operator">=</span> dummy<span class="token punctuation">;</span>
        <span class="token comment">// 指向每次要反转链表的尾结点</span>
        <span class="token class-name">ListNode</span> end <span class="token operator">=</span> dummy<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>end<span class="token punctuation">.</span>next <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 循环k次, 找到需要反转的链表的结尾, 需要判断end是否为空, 不然end.next会报错</span>
            <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> k <span class="token operator">&amp;&amp;</span> end <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                end <span class="token operator">=</span> end<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token comment">// end为null则说明反转的链表的节点数小于k, 不执行反转</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>end <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">break</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            
            <span class="token comment">// 记录需要反转的链表的下一个节点</span>
            <span class="token class-name">ListNode</span> next <span class="token operator">=</span> end<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token comment">// 断开要反转的链表</span>
            end<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
            <span class="token comment">// 记录要反转的链表的头结点</span>
            <span class="token class-name">ListNode</span> start <span class="token operator">=</span> pre<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token comment">// 反转链表, pre.next指向反转后的链表</span>
            pre<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token function">reverse</span><span class="token punctuation">(</span>start<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 反转后, 原来的链表头结点变成了尾结点, 需要链接到之前的next</span>
            start<span class="token punctuation">.</span>next <span class="token operator">=</span> next<span class="token punctuation">;</span>
            <span class="token comment">// pre和end指向下一次要反转链表的前一个节点</span>
            pre <span class="token operator">=</span> start<span class="token punctuation">;</span>
            end <span class="token operator">=</span> start<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    
    <span class="token comment">// 要求背诵</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">reverse</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> pre <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">ListNode</span> next <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            cur<span class="token punctuation">.</span>next <span class="token operator">=</span> pre<span class="token punctuation">;</span>
            pre <span class="token operator">=</span> cur<span class="token punctuation">;</span>
            cur <span class="token operator">=</span> next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> pre<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="剑指-offer-25-合并两个排序的链表" tabindex="-1"><a class="header-anchor" href="#剑指-offer-25-合并两个排序的链表" aria-hidden="true">#</a> 剑指 Offer 25. 合并两个排序的链表</h2><blockquote><p>https://leetcode.cn/problems/he-bing-liang-ge-pai-xu-de-lian-biao-lcof/description/</p><p>输入两个递增排序的链表，合并这两个链表并使新链表中的节点仍然是递增排序的。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：1-&gt;2-&gt;4, 1-&gt;3-&gt;4
输出：1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解-归并排序思路" tabindex="-1"><a class="header-anchor" href="#题解-归并排序思路" aria-hidden="true">#</a> 题解：归并排序思路</h4><p>设置一个虚拟头结点，遍历比较两个链表，最后记得将剩余链表直接添加上去。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Definition for singly-linked list.
 * public class ListNode <span class="token punctuation">{</span>
 *     int val;
 *     ListNode next;
 *     ListNode(int x) <span class="token punctuation">{</span> val = x; <span class="token punctuation">}</span>
 * <span class="token punctuation">}</span>
 */</span>
<span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">mergeTwoLists</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> l1<span class="token punctuation">,</span> <span class="token class-name">ListNode</span> l2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> cur1 <span class="token operator">=</span> l1<span class="token punctuation">,</span> cur2 <span class="token operator">=</span> l2<span class="token punctuation">,</span> cur <span class="token operator">=</span> dummy<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur1 <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> cur2 <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>cur1<span class="token punctuation">.</span>val <span class="token operator">&lt;</span> cur2<span class="token punctuation">.</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                cur<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span>cur1<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
                cur1 <span class="token operator">=</span> cur1<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                cur<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span>cur2<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
                cur2 <span class="token operator">=</span> cur2<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        
        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur1 <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            cur<span class="token punctuation">.</span>next <span class="token operator">=</span> cur1<span class="token punctuation">;</span>
            cur1 <span class="token operator">=</span> cur1<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur2 <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            cur<span class="token punctuation">.</span>next <span class="token operator">=</span> cur2<span class="token punctuation">;</span>
            cur2 <span class="token operator">=</span> cur2<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="剑指-offer-ii-078-合并排序链表" tabindex="-1"><a class="header-anchor" href="#剑指-offer-ii-078-合并排序链表" aria-hidden="true">#</a> 剑指 Offer II 078. 合并排序链表</h2><blockquote><p>https://leetcode.cn/problems/vvXgSW/description/</p><p>给定一个链表数组，每个链表都已经按升序排列。</p><p>请将所有链表合并到一个升序链表中，返回合并后的链表。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：lists = [[1,4,5],[1,3,4],[2,6]]
输出：[1,1,2,3,4,4,5,6]
解释：链表数组如下：
[
  1-&gt;4-&gt;5,
  1-&gt;3-&gt;4,
  2-&gt;6
]
将它们合并到一个有序链表中得到。
1-&gt;1-&gt;2-&gt;3-&gt;4-&gt;4-&gt;5-&gt;6
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：lists = []
输出：[]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：lists = [[]]
输出：[]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解一-遍历-两个有序链表合并" tabindex="-1"><a class="header-anchor" href="#题解一-遍历-两个有序链表合并" aria-hidden="true">#</a> 题解一：遍历+两个有序链表合并</h4><ul><li>已经有两个有序链表合并的算法，所以直接遍历这个链表数组进行合并即可。</li><li>初始化一个空链表，让它与第一个链表合并。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">mergeKLists</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span><span class="token punctuation">[</span><span class="token punctuation">]</span> lists<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 初始化一个空链表，用来和第一个链表合并</span>
        <span class="token class-name">ListNode</span> ans <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">ListNode</span> list <span class="token operator">:</span> lists<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 用每次合并后的链表去和下一个链表合并</span>
            ans <span class="token operator">=</span> <span class="token function">mergTwoList</span><span class="token punctuation">(</span>ans<span class="token punctuation">,</span> list<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> ans<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 合并两个有序链表</span>
    <span class="token keyword">private</span> <span class="token class-name">ListNode</span> <span class="token function">mergTwoList</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> a<span class="token punctuation">,</span> <span class="token class-name">ListNode</span> b<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>a <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> b <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> a <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> b <span class="token operator">:</span> a<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> head <span class="token operator">=</span> dummy<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>a <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> b <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>a<span class="token punctuation">.</span>val <span class="token operator">&lt;</span> b<span class="token punctuation">.</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                head<span class="token punctuation">.</span>next <span class="token operator">=</span> a<span class="token punctuation">;</span>
                a <span class="token operator">=</span> a<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                head<span class="token punctuation">.</span>next <span class="token operator">=</span> b<span class="token punctuation">;</span>
                b <span class="token operator">=</span> b<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            head <span class="token operator">=</span> head<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 注意这里处理，直接将剩余链表连接即可</span>
        head<span class="token punctuation">.</span>next <span class="token operator">=</span> a <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> b <span class="token operator">:</span> a<span class="token punctuation">;</span>
        <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="题解二-归并" tabindex="-1"><a class="header-anchor" href="#题解二-归并" aria-hidden="true">#</a> 题解二：归并</h4><ul><li>既然每个数组都是有序，那自然可以想到归并的思路来解。</li><li>归并排序到最后也是合并两个链表，所以核心算法还是合并两个有序链表（已有）</li><li>分而治之：考虑将k个链表配对，每两个合并，这就使用到递归分治。</li><li>递归退出的条件：参考归并排序 <ul><li>当<code>left &lt; right</code>：继续递归。</li><li>当<code>left &gt; right</code>：范围不对，直接返回<code>null</code>。</li><li>当<code>left == right</code>： 说明两个链表一样，此时直接返回任意一个即可。</li></ul></li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Definition for singly-linked list.
 * public class ListNode <span class="token punctuation">{</span>
 *     int val;
 *     ListNode next;
 *     ListNode() <span class="token punctuation">{</span><span class="token punctuation">}</span>
 *     ListNode(int val) <span class="token punctuation">{</span> this.val = val; <span class="token punctuation">}</span>
 *     ListNode(int val, ListNode next) <span class="token punctuation">{</span> this.val = val; this.next = next; <span class="token punctuation">}</span>
 * <span class="token punctuation">}</span>
 */</span>
<span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">mergeKLists</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span><span class="token punctuation">[</span><span class="token punctuation">]</span> lists<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">mergeSort</span><span class="token punctuation">(</span>lists<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">,</span> lists<span class="token punctuation">.</span>length <span class="token operator">-</span> <span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">mergeSort</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span><span class="token punctuation">[</span><span class="token punctuation">]</span> list<span class="token punctuation">,</span> <span class="token keyword">int</span> i<span class="token punctuation">,</span> <span class="token keyword">int</span> j<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 边界出错，直接返回null</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">&gt;</span> j<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 两个链表一样，此时直接返回任意一个即可</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>i <span class="token operator">==</span> j<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> list<span class="token punctuation">[</span>i<span class="token punctuation">]</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">int</span> mid <span class="token operator">=</span> <span class="token punctuation">(</span>i <span class="token operator">+</span> j<span class="token punctuation">)</span> <span class="token operator">/</span> <span class="token number">2</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> l1 <span class="token operator">=</span> <span class="token function">mergeSort</span><span class="token punctuation">(</span>list<span class="token punctuation">,</span> i<span class="token punctuation">,</span> mid<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> l2 <span class="token operator">=</span> <span class="token function">mergeSort</span><span class="token punctuation">(</span>list<span class="token punctuation">,</span> mid <span class="token operator">+</span> <span class="token number">1</span><span class="token punctuation">,</span> j<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 两两合并</span>
        <span class="token keyword">return</span> <span class="token function">mergeTwoList</span><span class="token punctuation">(</span>l1<span class="token punctuation">,</span> l2<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">mergeTwoList</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> a<span class="token punctuation">,</span> <span class="token class-name">ListNode</span> b<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>a <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> b <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> a <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> b <span class="token operator">:</span> a<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> head <span class="token operator">=</span> dummy<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>a <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> b <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>a<span class="token punctuation">.</span>val <span class="token operator">&lt;</span> b<span class="token punctuation">.</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                head<span class="token punctuation">.</span>next <span class="token operator">=</span> a<span class="token punctuation">;</span>
                a <span class="token operator">=</span> a<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                head<span class="token punctuation">.</span>next <span class="token operator">=</span> b<span class="token punctuation">;</span>
                b <span class="token operator">=</span> b<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            head <span class="token operator">=</span> head<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        head<span class="token punctuation">.</span>next <span class="token operator">=</span> a <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> b <span class="token operator">:</span> a<span class="token punctuation">;</span>
        <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="剑指-offer-ii-022-链表中环的入口节点" tabindex="-1"><a class="header-anchor" href="#剑指-offer-ii-022-链表中环的入口节点" aria-hidden="true">#</a> 剑指 Offer II 022. 链表中环的入口节点</h2><blockquote><p>https://leetcode.cn/problems/c32eOV/description/</p><p>给定一个链表，返回链表开始入环的第一个节点。 从链表的头节点开始沿着 <code>next</code> 指针进入环的第一个节点为环的入口节点。如果链表无环，则返回 <code>null</code>。</p><p>为了表示给定链表中的环，我们使用整数 <code>pos</code> 来表示链表尾连接到链表中的位置（索引从 0 开始）。 如果 <code>pos</code> 是 <code>-1</code>，则在该链表中没有环。<strong>注意，<code>pos</code> 仅仅是用于标识环的情况，并不会作为参数传递到函数中。</strong></p><p>**说明：**不允许修改给定的链表。</p><figure><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092111315.png" alt="image-20230406224639579" tabindex="0" loading="lazy"><figcaption>image-20230406224639579</figcaption></figure></blockquote><h4 id="题解-快慢指针" tabindex="-1"><a class="header-anchor" href="#题解-快慢指针" aria-hidden="true">#</a> 题解：快慢指针</h4><p>快慢指针找到相遇位置并且同时能够判断是否有环。</p><p><strong>关键点</strong>： 在相等节点处, 相遇指针继续向下走的距离就等于起始指针走到环入口的距离。</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Definition for singly-linked list.
 * class ListNode <span class="token punctuation">{</span>
 *     int val;
 *     ListNode next;
 *     ListNode(int x) <span class="token punctuation">{</span>
 *         val = x;
 *         next = null;
 *     <span class="token punctuation">}</span>
 * <span class="token punctuation">}</span>
 */</span>
<span class="token keyword">public</span> <span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">detectCycle</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 定义一个快慢指针</span>
        <span class="token class-name">ListNode</span> fast <span class="token operator">=</span> head<span class="token punctuation">,</span> slow <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token comment">// 遇到节点为空说明没有环</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>fast <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> fast<span class="token punctuation">.</span>next <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 快指针每次走两步</span>
            fast <span class="token operator">=</span> fast<span class="token punctuation">.</span>next<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token comment">// 慢指针每次走一步</span>
            slow <span class="token operator">=</span> slow<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token comment">// 如果两个指针相等，说明有环</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>fast <span class="token operator">==</span> slow<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// 在相等节点处, 相遇指针继续向下走的距离就等于起始指针走到环入口的距离</span>
                <span class="token class-name">ListNode</span> res <span class="token operator">=</span> head<span class="token punctuation">;</span>
                <span class="token keyword">while</span> <span class="token punctuation">(</span>res <span class="token operator">!=</span> slow<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    res <span class="token operator">=</span> res<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
                    slow <span class="token operator">=</span> slow<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token keyword">return</span> res<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="剑指-offer-22-链表中倒数第k个节点" tabindex="-1"><a class="header-anchor" href="#剑指-offer-22-链表中倒数第k个节点" aria-hidden="true">#</a> 剑指 Offer 22. 链表中倒数第k个节点</h2><blockquote><p>https://leetcode.cn/problems/lian-biao-zhong-dao-shu-di-kge-jie-dian-lcof/description/</p><p>输入一个链表，输出该链表中倒数第k个节点。为了符合大多数人的习惯，本题从1开始计数，即链表的尾节点是倒数第1个节点。</p><p>例如，一个链表有 <code>6</code> 个节点，从头节点开始，它们的值依次是 <code>1、2、3、4、5、6</code>。这个链表的倒数第 <code>3</code> 个节点是值为 <code>4</code> 的节点。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>给定一个链表: 1-&gt;2-&gt;3-&gt;4-&gt;5, 和 k = 2.

返回链表 4-&gt;5.
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解-遍历" tabindex="-1"><a class="header-anchor" href="#题解-遍历" aria-hidden="true">#</a> 题解：遍历</h4><p>先求链表长度，然后再计算走到k需要几步</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">getKthFromEnd</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">,</span> <span class="token keyword">int</span> k<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token comment">// 先求链表长度, 这里是0，因为结束条件是cur!=null, 会多遍历一次</span>
        <span class="token keyword">int</span> len <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            len<span class="token operator">++</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        cur <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token comment">// 计算从头到k需要走几步: len - k</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> len <span class="token operator">-</span> k<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> cur<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="剑指-offer-ii-021-删除链表的倒数第-n-个结点" tabindex="-1"><a class="header-anchor" href="#剑指-offer-ii-021-删除链表的倒数第-n-个结点" aria-hidden="true">#</a> 剑指 Offer II 021. 删除链表的倒数第 n 个结点</h2><blockquote><p>https://leetcode.cn/problems/SLwz0R/description/</p><p>给定一个链表，删除链表的倒数第 <code>n</code> 个结点，并且返回链表的头结点。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,2,3,4,5], n = 2
输出：[1,2,3,5]

输入：head = [1], n = 1
输出：[]

输入：head = [1,2], n = 1
输出：[1]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解-寻找待删除节点的前一个节点" tabindex="-1"><a class="header-anchor" href="#题解-寻找待删除节点的前一个节点" aria-hidden="true">#</a> 题解：寻找待删除节点的前一个节点</h4><ul><li>链表删除节点，必须之前待删除节点的前一个节点。</li><li>删除节点操作：<code>pre.next = cur.next;</code>注意判空。</li><li>为了方便处理一个节点和空链表的情况，初始化一个虚拟节点作为<code>pre</code>。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">removeNthFromEnd</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">,</span> <span class="token keyword">int</span> n<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token keyword">int</span> len <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            len<span class="token operator">++</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 方便处理一个节点的情况</span>
        <span class="token class-name">ListNode</span> dumy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        dumy<span class="token punctuation">.</span>next <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> pre <span class="token operator">=</span> dumy<span class="token punctuation">;</span>
        <span class="token comment">// 寻找到要删除节点的前一个节点</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;=</span> len <span class="token operator">-</span> n<span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            pre <span class="token operator">=</span> pre<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 得到要删除的节点</span>
        cur <span class="token operator">=</span> pre<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token comment">// 这里需要判空</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            pre<span class="token punctuation">.</span>next <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> dumy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="剑指-offer-52-两个链表的第一个公共节点" tabindex="-1"><a class="header-anchor" href="#剑指-offer-52-两个链表的第一个公共节点" aria-hidden="true">#</a> 剑指 Offer 52. 两个链表的第一个公共节点</h2><blockquote><p>https://leetcode.cn/problems/liang-ge-lian-biao-de-di-yi-ge-gong-gong-jie-dian-lcof/description/</p><p>输入两个链表，找出它们的第一个公共节点。</p><figure><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092111816.png" alt="image-20230418232817164" tabindex="0" loading="lazy"><figcaption>image-20230418232817164</figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：intersectVal = 8, listA = [4,1,8,4,5], listB = [5,0,1,8,4,5], skipA = 2, skipB = 3
输出：Reference of the node with value = 8
输入解释：相交节点的值为 8 （注意，如果两个列表相交则不能为 0）。从各自的表头开始算起，链表 A 为 [4,1,8,4,5]，链表 B 为 [5,0,1,8,4,5]。在 A 中，相交节点前有 2 个节点；在 B 中，相交节点前有 3 个节点。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><figure><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092111800.png" alt="image-20230418232839444" tabindex="0" loading="lazy"><figcaption>image-20230418232839444</figcaption></figure><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：intersectVal = 0, listA = [2,6,4], listB = [1,5], skipA = 3, skipB = 2
输出：null
输入解释：从各自的表头开始算起，链表 A 为 [2,6,4]，链表 B 为 [1,5]。由于这两个链表不相交，所以 intersectVal 必须为 0，而 skipA 和 skipB 可以是任意值。
解释：这两个链表不相交，因此返回 null。
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>注意：</strong></p><ul><li>如果两个链表没有交点，返回 <code>null</code>.</li><li>在返回结果后，两个链表仍须保持原有的结构。</li><li>可假定整个链表结构中没有循环。</li><li>程序尽量满足 O(<em>n</em>) 时间复杂度，且仅用 O(<em>1</em>) 内存。</li><li>本题与主站 160 题相同：https://leetcode-cn.com/problems/intersection-of-two-linked-lists/</li></ul></blockquote><h4 id="题解-双指针" tabindex="-1"><a class="header-anchor" href="#题解-双指针" aria-hidden="true">#</a> 题解：双指针</h4><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token class-name">ListNode</span> <span class="token function">getIntersectionNode</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> headA<span class="token punctuation">,</span> <span class="token class-name">ListNode</span> headB<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">ListNode</span> pA <span class="token operator">=</span> headA<span class="token punctuation">,</span> pB <span class="token operator">=</span> headB<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>pA <span class="token operator">!=</span> pB<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 这里如果对pA.next进行判空，就会进入无限循环出不来</span>
        <span class="token comment">// 假设链表如下：</span>
        <span class="token comment">// 1 -&gt; 3 -&gt; 5 -&gt; null</span>
        <span class="token comment">//      2 -&gt; 4 -&gt; null</span>
        <span class="token comment">// 如果对pA.next判空，则每次指针到5或4都会跳转到2或1,</span>
        <span class="token comment">// 但如果对pA本身判空，则总会存在一个null相等跳出循环</span>
        <span class="token comment">// pA = pA.next == null ? headB : pA.next;</span>
        <span class="token comment">// pB = pB.next == null ? headA : pB.next;</span>
        pA <span class="token operator">=</span> pA <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> headB <span class="token operator">:</span> pA<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        pB <span class="token operator">=</span> pB <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> headA <span class="token operator">:</span> pB<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> pA<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="剑指-offer-ii-077-链表排序" tabindex="-1"><a class="header-anchor" href="#剑指-offer-ii-077-链表排序" aria-hidden="true">#</a> 剑指 Offer II 077. 链表排序</h2><blockquote><p>给定链表的头结点 <code>head</code> ，请将其按 <strong>升序</strong> 排列并返回 <strong>排序后的链表</strong> 。</p><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092111945.png" alt="image-20230426124533401" style="zoom:50%;"><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [-1,5,3,4,0]
输出：[-1,0,3,4,5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解一-自定向下归并排序" tabindex="-1"><a class="header-anchor" href="#题解一-自定向下归并排序" aria-hidden="true">#</a> 题解一：自定向下归并排序</h4><p><strong>思路</strong>：</p><ol><li>找到链表中点，以中点为分界。找链表中点方法：快慢指针，快指针每次移2步、慢指针每次移1步，当快指针到达链表末尾时，慢指针到达链表中点</li><li>对两个子链表进行排序</li><li>将两个排序后的子链表合并，得到排序后的链表</li></ol><blockquote><p>时间复杂度：nlog(n)，空间复杂度：log(n)</p></blockquote><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Definition for singly-linked list.
 * public class ListNode <span class="token punctuation">{</span>
 *     int val;
 *     ListNode next;
 *     ListNode() <span class="token punctuation">{</span><span class="token punctuation">}</span>
 *     ListNode(int val) <span class="token punctuation">{</span> this.val = val; <span class="token punctuation">}</span>
 *     ListNode(int val, ListNode next) <span class="token punctuation">{</span> this.val = val; this.next = next; <span class="token punctuation">}</span>
 * <span class="token punctuation">}</span>
 */</span>
<span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
<span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">sortList</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">return</span> <span class="token function">sortList</span><span class="token punctuation">(</span>head<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">sortList</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">,</span> <span class="token class-name">ListNode</span> tail<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>head <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">return</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token keyword">if</span> <span class="token punctuation">(</span>head<span class="token punctuation">.</span>next <span class="token operator">==</span> tail<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            head<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> head<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 快慢指针寻找链表中间节点</span>
        <span class="token comment">// fast速度是slow两倍, 所以当fast到tail节点时, slow在中间节点</span>
        <span class="token class-name">ListNode</span> slow <span class="token operator">=</span> head<span class="token punctuation">,</span> fast <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>fast <span class="token operator">!=</span> tail<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 慢指针走一步</span>
            slow <span class="token operator">=</span> slow<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token comment">// 快指针走两步</span>
            fast <span class="token operator">=</span> fast<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>fast <span class="token operator">!=</span> tail<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                fast <span class="token operator">=</span> fast<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">ListNode</span> mid <span class="token operator">=</span> slow<span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> l1 <span class="token operator">=</span> <span class="token function">sortList</span><span class="token punctuation">(</span>head<span class="token punctuation">,</span> mid<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> l2 <span class="token operator">=</span> <span class="token function">sortList</span><span class="token punctuation">(</span>mid<span class="token punctuation">,</span> tail<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> res <span class="token operator">=</span> <span class="token function">merge</span><span class="token punctuation">(</span>l1<span class="token punctuation">,</span> l2<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> res<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">merge</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> l1<span class="token punctuation">,</span> <span class="token class-name">ListNode</span> l2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> dummy<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>l1 <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> l2 <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>l1<span class="token punctuation">.</span>val <span class="token operator">&gt;</span> l2<span class="token punctuation">.</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                cur<span class="token punctuation">.</span>next <span class="token operator">=</span> l2<span class="token punctuation">;</span>
                l2 <span class="token operator">=</span> l2<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                cur<span class="token punctuation">.</span>next <span class="token operator">=</span> l1<span class="token punctuation">;</span>
                l1 <span class="token operator">=</span> l1<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        cur<span class="token punctuation">.</span>next <span class="token operator">=</span> l1 <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> l2 <span class="token operator">:</span> l1<span class="token punctuation">;</span>
        <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="题解二-自底向上归并排序" tabindex="-1"><a class="header-anchor" href="#题解二-自底向上归并排序" aria-hidden="true">#</a> 题解二： 自底向上归并排序</h4><p><strong>思路</strong>：每次将链表分成子链表进行两两合并排序，最初是1, 后面依次为[2, 4, 8, ...]</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token doc-comment comment">/**
 * Definition for singly-linked list.
 * public class ListNode <span class="token punctuation">{</span>
 *     int val;
 *     ListNode next;
 *     ListNode() <span class="token punctuation">{</span><span class="token punctuation">}</span>
 *     ListNode(int val) <span class="token punctuation">{</span> this.val = val; <span class="token punctuation">}</span>
 *     ListNode(int val, ListNode next) <span class="token punctuation">{</span> this.val = val; this.next = next; <span class="token punctuation">}</span>
 * <span class="token punctuation">}</span>
 */</span>
<span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
<span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">sortList</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">int</span> length <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            length<span class="token operator">++</span><span class="token punctuation">;</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        dummy<span class="token punctuation">.</span>next <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> subLength <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> subLength <span class="token operator">&lt;</span> length<span class="token punctuation">;</span> subLength <span class="token operator">&lt;&lt;=</span> <span class="token number">1</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">ListNode</span> curr <span class="token operator">=</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">,</span> prev <span class="token operator">=</span> dummy<span class="token punctuation">;</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span>curr <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// 寻找一个链表头结点head1</span>
                <span class="token class-name">ListNode</span> head1 <span class="token operator">=</span> curr<span class="token punctuation">;</span>
                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> subLength <span class="token operator">&amp;&amp;</span> curr<span class="token punctuation">.</span>next <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    curr <span class="token operator">=</span> curr<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token comment">// 寻找另一个链表头结点</span>
                <span class="token class-name">ListNode</span> head2 <span class="token operator">=</span> curr<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
                <span class="token comment">// 剪断第一个链表head1与原始链表关系</span>
                curr<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
                curr <span class="token operator">=</span> head2<span class="token punctuation">;</span>
                <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token keyword">int</span> i <span class="token operator">=</span> <span class="token number">1</span><span class="token punctuation">;</span> i <span class="token operator">&lt;</span> subLength <span class="token operator">&amp;&amp;</span> curr <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> curr<span class="token punctuation">.</span>next <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> i<span class="token operator">++</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    curr <span class="token operator">=</span> curr<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token comment">// 先记录第二个链表head2的下一个节点, 然后减掉第二个链表head2与原始链表关系</span>
                <span class="token class-name">ListNode</span> next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
                <span class="token keyword">if</span> <span class="token punctuation">(</span>curr <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    next <span class="token operator">=</span> curr<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
                    curr<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token comment">// 合并两个子链表</span>
                <span class="token class-name">ListNode</span> merge <span class="token operator">=</span> <span class="token function">merge</span><span class="token punctuation">(</span>head1<span class="token punctuation">,</span> head2<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token comment">// 将合并后的新链表接到结果链表上</span>
                prev<span class="token punctuation">.</span>next <span class="token operator">=</span> merge<span class="token punctuation">;</span>
                <span class="token keyword">while</span> <span class="token punctuation">(</span>prev<span class="token punctuation">.</span>next <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                    prev <span class="token operator">=</span> prev<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
                <span class="token punctuation">}</span>
                <span class="token comment">// 重新赋值curr，准备开始当前长度subLength的下一次链表排序合并</span>
                curr <span class="token operator">=</span> next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">merge</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> l1<span class="token punctuation">,</span> <span class="token class-name">ListNode</span> l2<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> dummy<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>l1 <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> l2 <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>l1<span class="token punctuation">.</span>val <span class="token operator">&gt;</span> l2<span class="token punctuation">.</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                cur<span class="token punctuation">.</span>next <span class="token operator">=</span> l2<span class="token punctuation">;</span>
                l2 <span class="token operator">=</span> l2<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
                cur<span class="token punctuation">.</span>next <span class="token operator">=</span> l1<span class="token punctuation">;</span>
                l1 <span class="token operator">=</span> l1<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        cur<span class="token punctuation">.</span>next <span class="token operator">=</span> l1 <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">?</span> l2 <span class="token operator">:</span> l1<span class="token punctuation">;</span>
        <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="剑指-offer-ii-027-回文链表" tabindex="-1"><a class="header-anchor" href="#剑指-offer-ii-027-回文链表" aria-hidden="true">#</a> 剑指 Offer II 027. 回文链表</h2><blockquote><p>https://leetcode.cn/problems/aMhZSa/</p><p>给定一个链表的 <strong>头节点</strong> <code>head</code> **，**请判断其是否为回文链表。</p><p>如果一个链表是回文，那么链表节点序列从前往后看和从后往前看是相同的。</p><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092111747.png" alt="image-20230428154907613" style="zoom:50%;"><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入: head = [1,2,3,3,2,1]
输出: true
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解-中点后反转链表" tabindex="-1"><a class="header-anchor" href="#题解-中点后反转链表" aria-hidden="true">#</a> 题解：中点后反转链表</h4><p><strong>思路</strong>：</p><ul><li>快慢指针寻找链表中点</li><li>反转中点后面的链表，然后和中点前链表对比，判断值是否一样</li></ul><blockquote><p><strong>注意</strong>：</p><p>这题不能直接将整个链表反转然后比较，因为反转整个链表后head指针就变了（即原链表就变了）</p><p>例如： 1-&gt;2-&gt;3-&gt;4， 反转后：1&lt;-2&lt;-3&lt;-4，反转后head指向1，但是head.next为空了</p></blockquote><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">class</span> <span class="token class-name">Solution</span> <span class="token punctuation">{</span>
    <span class="token keyword">public</span> <span class="token keyword">boolean</span> <span class="token function">isPalindrome</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 找中点</span>
        <span class="token class-name">ListNode</span> slow <span class="token operator">=</span> head<span class="token punctuation">,</span> fast <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>slow <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> fast <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            slow <span class="token operator">=</span> slow<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            fast <span class="token operator">=</span> fast<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>fast <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                fast <span class="token operator">=</span> fast<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 反转中点以后的链表</span>
        <span class="token class-name">ListNode</span> reverseLink <span class="token operator">=</span> <span class="token function">reverseLink</span><span class="token punctuation">(</span>slow<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> head<span class="token punctuation">,</span> reverseCur <span class="token operator">=</span> reverseLink<span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> reverseCur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>cur<span class="token punctuation">.</span>val <span class="token operator">!=</span> reverseCur<span class="token punctuation">.</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            reverseCur <span class="token operator">=</span> reverseCur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>

    <span class="token comment">// 反转链表</span>
    <span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">reverseLink</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> head<span class="token punctuation">,</span> pre <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token class-name">ListNode</span> next <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            cur<span class="token punctuation">.</span>next <span class="token operator">=</span> pre<span class="token punctuation">;</span>
            pre <span class="token operator">=</span> cur<span class="token punctuation">;</span>
            cur <span class="token operator">=</span> next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token keyword">return</span> pre<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_328-奇偶链表" tabindex="-1"><a class="header-anchor" href="#_328-奇偶链表" aria-hidden="true">#</a> 328. 奇偶链表</h2><blockquote><p>给定单链表的头节点 <code>head</code> ，将所有索引为奇数的节点和索引为偶数的节点分别组合在一起，然后返回重新排序的列表。</p><p><strong>第一个</strong>节点的索引被认为是 <strong>奇数</strong> ， <strong>第二个</strong>节点的索引为 <strong>偶数</strong> ，以此类推。</p><p>请注意，偶数组和奇数组内部的相对顺序应该与输入时保持一致。</p><p>你必须在 <code>O(1)</code> 的额外空间复杂度和 <code>O(n)</code> 的时间复杂度下解决这个问题。</p><img src="https://floweryu-image.oss-cn-shanghai.aliyuncs.com/image202307092111082.png" alt="image-20230428155628067" style="zoom:50%;"><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入: head = [1,2,3,4,5]
输出: [1,3,5,2,4]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解-正常思路" tabindex="-1"><a class="header-anchor" href="#题解-正常思路" aria-hidden="true">#</a> 题解：正常思路</h4><ul><li>一次遍历链表，分别将奇数偶数挑出来存储到新链表中</li><li>将偶数链表接到奇数链表后面</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">oddEvenList</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 存储奇数链表</span>
    <span class="token class-name">ListNode</span> odd <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 存储偶数链表</span>
    <span class="token class-name">ListNode</span> even <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 判断当前是奇数索引节点还是偶数索引节点</span>
    <span class="token keyword">int</span> index <span class="token operator">=</span> <span class="token number">0</span><span class="token punctuation">;</span>
    <span class="token comment">// cur: 遍历链表; oddRes: 接收奇数节点; evenRes: 接收偶数节点</span>
    <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> head<span class="token punctuation">,</span> oddRes <span class="token operator">=</span> odd<span class="token punctuation">,</span> evenRes <span class="token operator">=</span> even<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        index<span class="token operator">++</span><span class="token punctuation">;</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>index <span class="token operator">%</span> <span class="token number">2</span> <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 如果是奇数索引节点, 连接到奇数链表中</span>
            oddRes<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span>cur<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
            oddRes <span class="token operator">=</span> oddRes<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">// 如果是偶数索引节点, 连接到偶数链表中</span>
            evenRes<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span>cur<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
            evenRes <span class="token operator">=</span> evenRes<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 最后将偶数结果链表接到奇数结果链表中返回</span>
    oddRes<span class="token punctuation">.</span>next <span class="token operator">=</span> even<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">return</span> odd<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_83-删除排序链表中的重复元素" tabindex="-1"><a class="header-anchor" href="#_83-删除排序链表中的重复元素" aria-hidden="true">#</a> 83. 删除排序链表中的重复元素</h2><blockquote><p>https://leetcode.cn/problems/remove-duplicates-from-sorted-list/description/</p><p>给定一个已排序的链表的头 <code>head</code> ， <em>删除所有重复的元素，使每个元素只出现一次</em> 。返回 <em>已排序的链表</em> 。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,1,2]
输出：[1,2]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,1,2,3,3]
输出：[1,2,3]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解-set集合-链表删除" tabindex="-1"><a class="header-anchor" href="#题解-set集合-链表删除" aria-hidden="true">#</a> 题解：Set集合+链表删除</h4><ul><li>删除链表元素需要一个前置指针<code>pre</code></li><li>遍历判断元素是否在集合中，在就删除元素，不再则添加到集合中，把当前元素作为前置节点</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">deleteDuplicates</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> set <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    dummy<span class="token punctuation">.</span>next <span class="token operator">=</span> head<span class="token punctuation">;</span>
    <span class="token comment">// cur: 遍历指针; pre: 因为要删除元素，所以需要一个前置指针指向第一个不重复元素, 如: [1, 1, 1] pre指向第一个1</span>
    <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> head<span class="token punctuation">,</span> pre <span class="token operator">=</span> cur<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>set<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>cur<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 遇到重复元素, 直接删除</span>
            pre<span class="token punctuation">.</span>next <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">// 遇到不重复元素, 将pre指针指向当前</span>
            set<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>cur<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
            pre <span class="token operator">=</span> cur<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 遍历</span>
        cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h2 id="_82-删除排序链表中的重复元素-ii" tabindex="-1"><a class="header-anchor" href="#_82-删除排序链表中的重复元素-ii" aria-hidden="true">#</a> 82. 删除排序链表中的重复元素 II</h2><blockquote><p>https://leetcode.cn/problems/remove-duplicates-from-sorted-list-ii/description/</p><p>给定一个已排序的链表的头 <code>head</code> ， <em>删除原始链表中所有重复数字的节点，只留下不同的数字</em> 。返回 <em>已排序的链表</em> 。</p><div class="language-text line-numbers-mode" data-ext="text"><pre class="language-text"><code>输入：head = [1,2,3,3,4,4,5]
输出：[1,2,5]
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div></div></div></blockquote><h4 id="题解一-遍历两次删除两遍" tabindex="-1"><a class="header-anchor" href="#题解一-遍历两次删除两遍" aria-hidden="true">#</a> 题解一：遍历两次删除两遍</h4>`,76),d={href:"https://leetcode.cn/problems/remove-duplicates-from-sorted-list/description/",target:"_blank",rel:"noopener noreferrer"},r=a(`<ul><li>两个<code>set</code>，第一个<code>set</code>用于删除重复节点，保留一个。第二个<code>set</code>用于存储重复的节点，用在第二次遍历中删除。</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">deleteDuplicates</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    dummy<span class="token punctuation">.</span>next <span class="token operator">=</span> head<span class="token punctuation">;</span>
    <span class="token comment">// 先去一遍重: 例如原链表: [1, 1, 1, 2, 2, 3, 4, 5]</span>
    <span class="token comment">// 第一遍去重后: [1, 2, 3, 4, 5], 同时将重复元素记录到tSet中</span>
    <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">,</span> pre <span class="token operator">=</span> cur<span class="token punctuation">;</span>
    <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> set <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token class-name">Set</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token class-name">Integer</span><span class="token punctuation">&gt;</span></span> tSet <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">HashSet</span><span class="token generics"><span class="token punctuation">&lt;</span><span class="token punctuation">&gt;</span></span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>cur <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>set<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>cur<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            pre<span class="token punctuation">.</span>next <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            tSet<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>cur<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            set<span class="token punctuation">.</span><span class="token function">add</span><span class="token punctuation">(</span>cur<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">;</span>
            pre <span class="token operator">=</span> cur<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 第二遍去重: 遍历第一遍去重后链表判断元素是否在tSet中, 有则需要再去掉该元素</span>
    <span class="token comment">// 由于链表第一个元素有可能需要去掉, 所以需要记录-1节点位置</span>
    <span class="token class-name">ListNode</span> ptr <span class="token operator">=</span> dummy<span class="token punctuation">,</span> pro <span class="token operator">=</span> ptr<span class="token punctuation">;</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>ptr <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>tSet<span class="token punctuation">.</span><span class="token function">contains</span><span class="token punctuation">(</span>ptr<span class="token punctuation">.</span>val<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            pro<span class="token punctuation">.</span>next <span class="token operator">=</span> ptr<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            pro <span class="token operator">=</span> ptr<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
        ptr <span class="token operator">=</span> ptr<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><h4 id="题解二-遍历一次删除" tabindex="-1"><a class="header-anchor" href="#题解二-遍历一次删除" aria-hidden="true">#</a> 题解二：遍历一次删除</h4><ul><li>每次遍历<code>cur</code>指向留下的节点并表示前置节点。</li><li>比较cur.next和cur.next.next值是否相等：相等就说明这是个重复节点，需要删除，但需要寻找出所有等于该值的节点全部删除，所以再加个<code>while</code>循环遍历寻找相等的节点</li></ul><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token class-name">ListNode</span> <span class="token function">deleteDuplicates</span><span class="token punctuation">(</span><span class="token class-name">ListNode</span> head<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token class-name">ListNode</span> dummy <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">ListNode</span><span class="token punctuation">(</span><span class="token operator">-</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    dummy<span class="token punctuation">.</span>next <span class="token operator">=</span> head<span class="token punctuation">;</span>
    <span class="token class-name">ListNode</span> cur <span class="token operator">=</span> dummy<span class="token punctuation">;</span>
    <span class="token doc-comment comment">/**
         * 关键点: cur指针始终指向前置元素
         * 由于是升序链表, 设当前节点是cur, 直接比较cur.next和cur.next.next值是否相等即可确定是否需要删除
         *      -1 -&gt; 1 -&gt; 1 -&gt; 1 -&gt; 2 -&gt; 3
         *      cur  ptr ...........ptr
         */</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>cur<span class="token punctuation">.</span>next <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">.</span>next <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>cur<span class="token punctuation">.</span>next<span class="token punctuation">.</span>val <span class="token operator">==</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">.</span>next<span class="token punctuation">.</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 遍历指针, 跳出循环指向下一个不重复元素</span>
            <span class="token class-name">ListNode</span> ptr <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token keyword">while</span> <span class="token punctuation">(</span>ptr <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> ptr<span class="token punctuation">.</span>val <span class="token operator">==</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">.</span>val<span class="token punctuation">)</span> <span class="token punctuation">{</span>
                ptr <span class="token operator">=</span> ptr<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
            <span class="token doc-comment comment">/**
                 * 考虑到下面这种情况, 下一次循环仍需要丢弃2元素
                 *      -1 -&gt; 1 -&gt; 1 -&gt; 1 -&gt; 2 -&gt; 2
                 *      cur  ptr ...........ptr
                 */</span>
            cur<span class="token punctuation">.</span>next <span class="token operator">=</span> ptr<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">// 不是重复元素, cur后移</span>
            cur <span class="token operator">=</span> cur<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> dummy<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,5);function k(v,m){const e=p("ExternalLinkIcon");return o(),c("div",null,[u,s("p",null,[n("在"),s("a",d,[n("删除排序链表中的重复元素"),l(e)]),n("中是留下一个重复元素，可以在此基础上再把剩下的重复元素删除。")]),r])}const g=t(i,[["render",k],["__file","链表专题.html.vue"]]);export{g as default};
