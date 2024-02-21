import{_ as n}from"./plugin-vue_export-helper-c27b6911.js";import{o as s,c as a,a as e}from"./app-998b7412.js";const t={},p=e(`<h2 id="公平锁策略" tabindex="-1"><a class="header-anchor" href="#公平锁策略" aria-hidden="true">#</a> 公平锁策略</h2><p><strong>ReentrantLock</strong>类中 <strong>FairSync</strong> 类源码解读：</p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">class</span> <span class="token class-name">FairSync</span> <span class="token keyword">extends</span> <span class="token class-name">Sync</span> <span class="token punctuation">{</span>
    <span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">final</span> <span class="token keyword">long</span> serialVersionUID <span class="token operator">=</span> <span class="token operator">-</span><span class="token number">3000897897090466540L</span><span class="token punctuation">;</span>

    <span class="token comment">// 公平锁入口</span>
    <span class="token comment">// 不响应中断的加锁</span>
    <span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">lock</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token function">acquire</span><span class="token punctuation">(</span><span class="token number">1</span><span class="token punctuation">)</span><span class="token punctuation">;</span>		<span class="token comment">// （1）</span>
    <span class="token punctuation">}</span>

    <span class="token doc-comment comment">/**
         * Fair version of tryAcquire.  Don&#39;t grant access unless
         * recursive call or no waiters or is first.
         * 抢占成功：返回true, 包含重入锁
         * 抢占失败：返回false
         */</span>
    <span class="token keyword">protected</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">tryAcquire</span><span class="token punctuation">(</span><span class="token keyword">int</span> acquires<span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 获取当前线程</span>
        <span class="token keyword">final</span> <span class="token class-name">Thread</span> current <span class="token operator">=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 获取AQS中当前status状态</span>
        <span class="token keyword">int</span> c <span class="token operator">=</span> <span class="token function">getState</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

        <span class="token comment">// 条件成立: c == 0 表示  当前AQS处于无锁的状态</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>c <span class="token operator">==</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 条件一: hasQueuedPredecessors()</span>
            <span class="token comment">// 因为FairSync是公平锁，任何时候获取锁都需要检查一下队列中在当前需要获取锁的线程前有无等待者</span>
            <span class="token comment">// hasQueuedPredecessors()方法返回true表示当前线程前面有等待者, 当前线程需要入队等待</span>
            <span class="token comment">// hasQueuedPredecessors()方法返回false表示当前线程前面无等待者, 直接可以获取锁</span>

            <span class="token comment">// 条件二: compareAndSetState(0, acquires) CAS设置state值, 由于是从条件一进入的此处, 队列中没有线程, CAS的预期值是0</span>
            <span class="token comment">// 成功: 说明当前线程抢占锁成功</span>
            <span class="token comment">// 失败: 说明存在竞争, 且当前线程竞争锁失败</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">hasQueuedPredecessors</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
                <span class="token function">compareAndSetState</span><span class="token punctuation">(</span><span class="token number">0</span><span class="token punctuation">,</span> acquires<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// 如果当前线程前面没有等待线程, 并且成功获取到锁</span>
                <span class="token comment">// 设置当前线程为独占锁的线程</span>
                <span class="token function">setExclusiveOwnerThread</span><span class="token punctuation">(</span>current<span class="token punctuation">)</span><span class="token punctuation">;</span>
                <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
        <span class="token comment">// 执行到此处的情况：c != 0 或 c &gt; 0</span>
        <span class="token comment">// 这种情况需要判断当前线程是不是独占锁的线程, 因为ReentrantLock是可重入锁</span>
        <span class="token keyword">else</span> <span class="token keyword">if</span> <span class="token punctuation">(</span>current <span class="token operator">==</span> <span class="token function">getExclusiveOwnerThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 可重入锁的逻辑</span>
            <span class="token comment">// nextc 是更新AQS的state的值</span>
            <span class="token keyword">int</span> nextc <span class="token operator">=</span> c <span class="token operator">+</span> acquires<span class="token punctuation">;</span>
            <span class="token comment">// 越界判断, 当重入的深度很深时, 会导致nextc&lt;0, state的最大值是int, int值达到最大之后 再+1...变负数..</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>nextc <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span>
                <span class="token keyword">throw</span> <span class="token keyword">new</span> <span class="token class-name">Error</span><span class="token punctuation">(</span><span class="token string">&quot;Maximum lock count exceeded&quot;</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token comment">// 设置state的值</span>
            <span class="token function">setState</span><span class="token punctuation">(</span>nextc<span class="token punctuation">)</span><span class="token punctuation">;</span>
            <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        <span class="token comment">// 执行到这里的情况</span>
        <span class="token comment">// 1. c==0时, CAS失败, CAS修改state时未抢过其他线程</span>
        <span class="token comment">// 2. c!=0或c&gt;0时, 当前线程不是独占锁线程</span>
        <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">hasQueuedPredecessors</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// The correctness of this depends on head being initialized</span>
    <span class="token comment">// before tail and on head.next being accurate if the current</span>
    <span class="token comment">// thread is first in queue.</span>
    <span class="token class-name">Node</span> t <span class="token operator">=</span> tail<span class="token punctuation">;</span> <span class="token comment">// Read fields in reverse initialization order</span>
    <span class="token class-name">Node</span> h <span class="token operator">=</span> head<span class="token punctuation">;</span>
    <span class="token class-name">Node</span> s<span class="token punctuation">;</span>
    <span class="token comment">// 条件一: h!=t 成立, 说明队列中有节点, 既然有节点, 为什么会出现条件二的判断呢？</span>
    <span class="token comment">// 条件二: h.next == null, 在向空队列中新插入节点时, 新插入的节点的前驱与前置节点(这里就是tail)建立了关联，但在head.next还未与新节点连接之前, b会出现这种情况</span>
    <span class="token keyword">return</span> h <span class="token operator">!=</span> t <span class="token operator">&amp;&amp;</span>
        <span class="token punctuation">(</span><span class="token punctuation">(</span>s <span class="token operator">=</span> h<span class="token punctuation">.</span>next<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> s<span class="token punctuation">.</span>thread <span class="token operator">!=</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p>点击上述(1)处代码进入<strong>AbstractQueuedSynchronizer</strong>源码中的<strong>acquire方法</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">void</span> <span class="token function">acquire</span><span class="token punctuation">(</span><span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 条件一: tryAcquire(arg) 该方法在ReentrantLock类中重写, 尝试获取锁, 获取成功后返回true, 获取失败返回false</span>
    <span class="token comment">// 条件二: acquireQueued(addWaiter(Node.EXCLUSIVE), arg)</span>
    <span class="token comment">// 2.1: addWaiter(Node.EXCLUSIVE) 将当前线程封装成node添加到队列中</span>
    <span class="token comment">// </span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token operator">!</span><span class="token function">tryAcquire</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
        <span class="token function">acquireQueued</span><span class="token punctuation">(</span><span class="token function">addWaiter</span><span class="token punctuation">(</span><span class="token class-name">Node</span><span class="token punctuation">.</span><span class="token constant">EXCLUSIVE</span><span class="token punctuation">)</span><span class="token punctuation">,</span> arg<span class="token punctuation">)</span><span class="token punctuation">)</span>
        <span class="token comment">//再次设置中断标记为true</span>
        <span class="token comment">//此处为什么要selfInterrupt()?，原因是，如果acquireQueued()返回了true，说明线程是被interrupt醒的，不是被unpark醒的，</span>
        <span class="token comment">//如果是被interrupt醒的，由于acquireQueued里面判断线程到底是怎么醒的，用的是Thread.interrupted()，该方法判断后，还会清除interrupt标记，因此这里要重新加上中断标记为。具体见https://www.zhihu.com/question/399039232</span>
        <span class="token function">selfInterrupt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * Creates and enqueues node for current thread and given mode.
 *
 * <span class="token keyword">@param</span> <span class="token parameter">mode</span> Node.EXCLUSIVE for exclusive, Node.SHARED for shared
 * <span class="token keyword">@return</span> the new node
 * 返回当前线程形成的node
 */</span>
<span class="token keyword">private</span> <span class="token class-name">Node</span> <span class="token function">addWaiter</span><span class="token punctuation">(</span><span class="token class-name">Node</span> mode<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 构建node, 将当前线程封装到node中</span>
    <span class="token class-name">Node</span> node <span class="token operator">=</span> <span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token punctuation">(</span><span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">currentThread</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">,</span> mode<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// Try the fast path of enq; backup to full enq on failure</span>
    <span class="token comment">// 将节点入队</span>
    <span class="token comment">// 获取队尾节点, 保存到pred变量中</span>
    <span class="token class-name">Node</span> pred <span class="token operator">=</span> tail<span class="token punctuation">;</span>
    <span class="token comment">// 条件成立: 当队列中已经有node了</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>pred <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 当前节点的prev指向前置节点, 因为此时pred是tail</span>
        node<span class="token punctuation">.</span>prev <span class="token operator">=</span> pred<span class="token punctuation">;</span>
        <span class="token comment">// CAS 如果成功, 说明node入队成功</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetTail</span><span class="token punctuation">(</span>pred<span class="token punctuation">,</span> node<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
            <span class="token comment">// 前置节点指向当前节点, 完成双向绑定</span>
            pred<span class="token punctuation">.</span>next <span class="token operator">=</span> node<span class="token punctuation">;</span>
            <span class="token keyword">return</span> node<span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 什么时候执行这里?</span>
    <span class="token comment">// 1. 当前队列是空队列 tail = null</span>
    <span class="token comment">// 2. CAS竞争失败</span>
    <span class="token function">enq</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token keyword">return</span> node<span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * Inserts node into queue, initializing if necessary. See picture above.
 * <span class="token keyword">@param</span> <span class="token parameter">node</span> the node to insert
 * <span class="token keyword">@return</span> node&#39;s predecessor
 */</span>
<span class="token keyword">private</span> <span class="token class-name">Node</span> <span class="token function">enq</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">Node</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 自旋入队, 只有当前节点入队成功后才会跳出循环</span>
    <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token class-name">Node</span> t <span class="token operator">=</span> tail<span class="token punctuation">;</span>
        <span class="token comment">// 1. 当前队列是空队列 tail = null</span>
        <span class="token comment">// 说明当前锁被占用, 且当前线程可能是第一个获取锁失败的线程（当前时刻可能存在一批获取锁失败的线程...）</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>t <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span> <span class="token comment">// Must initialize</span>
            <span class="token comment">// 作为当前持锁线程的第一个后继线程, 需要做什么事</span>
            <span class="token comment">// 1. 因为当前持锁的线程, 在它获取锁时, 直接tryAcquire成功了, 没有向阻塞队列中添加任何node, 所以作为后继第一个进入阻塞队列的线程,需要额外处理一些事情</span>
            <span class="token comment">// 2. 在自己这个节点之前追加一个线程为空的node</span>
            <span class="token comment">// CAS成功, 说明当前节点成为head.next节点</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetHead</span><span class="token punctuation">(</span><span class="token keyword">new</span> <span class="token class-name">Node</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                tail <span class="token operator">=</span> head<span class="token punctuation">;</span>
            <span class="token comment">// 注意这里执行完后并没有跳出for循环....</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">// 普通的入队方式, 在队列不为null时进入, 由于for是无限循环, 所以可以一直入队成功</span>
            <span class="token comment">// 要入队的节点前驱和tail绑定</span>
            node<span class="token punctuation">.</span>prev <span class="token operator">=</span> t<span class="token punctuation">;</span>
            <span class="token comment">// CAS设置tail指针</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">compareAndSetTail</span><span class="token punctuation">(</span>t<span class="token punctuation">,</span> node<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// 当前节点和前置节点的后驱绑定</span>
                t<span class="token punctuation">.</span>next <span class="token operator">=</span> node<span class="token punctuation">;</span>
                <span class="token keyword">return</span> t<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * Acquires in exclusive uninterruptible mode for thread already in
 * queue. Used by condition wait methods as well as acquire.
 *
 * <span class="token keyword">@param</span> <span class="token parameter">node</span> the node 当前线程包装出来的node，且当前时刻已经入队成功了
 * <span class="token keyword">@param</span> <span class="token parameter">arg</span> the acquire argument  当前线程抢占资源成功后，设置state值时会用到
 * <span class="token keyword">@return</span> <span class="token punctuation">{</span><span class="token keyword">@code</span> <span class="token code-section"><span class="token code language-java"><span class="token boolean">true</span></span></span><span class="token punctuation">}</span> if interrupted while waiting
 * true:当前线程抢占成功，普通情况下，当前线程早晚会拿到锁
 * false:表示失败，需要执行出队的逻辑
 */</span>
<span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">acquireQueued</span><span class="token punctuation">(</span><span class="token keyword">final</span> <span class="token class-name">Node</span> node<span class="token punctuation">,</span> <span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token keyword">boolean</span> failed <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token keyword">try</span> <span class="token punctuation">{</span>
        <span class="token comment">// 当前线程是否被中断</span>
        <span class="token keyword">boolean</span> interrupted <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token punctuation">;</span><span class="token punctuation">;</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>  
            <span class="token comment">// 为什么会执行到这里</span>
            <span class="token comment">// 1. 进行for循环时, 在线程尚未park前会执行</span>
            <span class="token comment">// 2. 线程park之后, 被唤醒后, 也会执行到这里</span>

            <span class="token comment">// 获取当前节点的前置节点</span>
            <span class="token keyword">final</span> <span class="token class-name">Node</span> p <span class="token operator">=</span> node<span class="token punctuation">.</span><span class="token function">predecessor</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

            <span class="token comment">// 条件一成立：p==head, 说明当前节点为head.next节点, head.next节点在任何时候都有权力去争夺锁</span>
            <span class="token comment">// 条件二成立: tryAcquire(arg) 说明head对应的线程已经释放锁了, head.next节点对应的线程正好获取到锁</span>
            <span class="token comment">// 条件二不成立：head对应的线程还没有释放锁.. head.next仍然需要park</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>p <span class="token operator">==</span> head <span class="token operator">&amp;&amp;</span> <span class="token function">tryAcquire</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
                <span class="token comment">// 拿到锁之后需要做什么？</span>
                <span class="token comment">// 设置自己为head节点</span>
                <span class="token function">setHead</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>

                <span class="token comment">// 将上个线程对应的node节点的next引用指向null, 使之出队</span>
                p<span class="token punctuation">.</span>next <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span> <span class="token comment">// help GC</span>
                <span class="token comment">// 当前线程获取锁的过程没有异常</span>
                failed <span class="token operator">=</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
                <span class="token comment">// 返回当前线程的中断标记</span>
                <span class="token keyword">return</span> interrupted<span class="token punctuation">;</span>
            <span class="token punctuation">}</span>

            <span class="token comment">//shouldParkAfterFailedAcquire这个方法是干嘛的？ 当前线程获取锁资源失败后，是否需要挂起呢？</span>
            <span class="token comment">//返回值：true -&gt;当前线程需要挂起  false-&gt; 不需要</span>
            <span class="token comment">//parkAndCheckInterrupt()作用：挂起当前线程，并且唤醒之后返回当前线程的中断标记</span>
            <span class="token comment">//唤醒：1：正常唤醒 其他线程unpark 2:其他线程给当前挂起的线程一个中断信号</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">shouldParkAfterFailedAcquire</span><span class="token punctuation">(</span>p<span class="token punctuation">,</span> node<span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
                <span class="token function">parkAndCheckInterrupt</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">)</span>
                <span class="token comment">//interruped=true表示当前node对应的线程是被中断信号唤醒的</span>
                interrupted <span class="token operator">=</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>
    <span class="token punctuation">}</span> <span class="token keyword">finally</span> <span class="token punctuation">{</span> <span class="token comment">// 什么时候会走到这？感觉不会走，应该是保险措施</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>failed<span class="token punctuation">)</span>
            <span class="token function">cancelAcquire</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * 总结：
 * 1：当前节点的前置节点是取消状态，第一次来到这个方法时会越过取消状态的节点，第二次会返回true，然后park当前线程
 * 2：当前节点的前置节点状态是0，当前线程会设置前置节点的状态为-1，第二次自旋来到这个方法时会返回true，然后park当前线程
 * <span class="token keyword">@param</span> <span class="token parameter">pred</span> 当前线程node的前置节点
 * <span class="token keyword">@param</span> <span class="token parameter">node</span> 当前线程对应node
 * <span class="token keyword">@return</span> <span class="token punctuation">{</span><span class="token keyword">@code</span> <span class="token code-section"><span class="token code language-java"><span class="token boolean">true</span></span></span><span class="token punctuation">}</span> if thread should block
 * 返回值：boolean true 表示当前线程需要挂起
 */</span>
<span class="token keyword">private</span> <span class="token keyword">static</span> <span class="token keyword">boolean</span> <span class="token function">shouldParkAfterFailedAcquire</span><span class="token punctuation">(</span><span class="token class-name">Node</span> pred<span class="token punctuation">,</span> <span class="token class-name">Node</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 获取前置节点的状态</span>
    <span class="token comment">// waitStatus: 0 默认状态 -1 Signal状态,表示当前节点释放锁之后会唤醒它的第一个后继节点 &gt;0 表示当前节点是CANCELED状态</span>
    <span class="token keyword">int</span> ws <span class="token operator">=</span> pred<span class="token punctuation">.</span>waitStatus<span class="token punctuation">;</span>

    <span class="token comment">// 条件成立：表示前置节点是个可以唤醒当前节点的节点, 返回 true  ==&gt;parkAndCheckInterrupt() park当前线程</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>ws <span class="token operator">==</span> <span class="token class-name">Node</span><span class="token punctuation">.</span><span class="token constant">SIGNAL</span><span class="token punctuation">)</span>
        <span class="token comment">/*
             * This node has already set status asking a release
             * to signal it, so it can safely park.
             */</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token comment">//条件成立：&gt;0,表示前置节点是CANCELED状态</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>ws <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">/*
             * Predecessor was cancelled. Skip over predecessors and
             * indicate retry.
             */</span>
        <span class="token comment">// 寻找节点的waitStatus大于0的前置节点, 这些节点是取消的状态</span>
        <span class="token keyword">do</span> <span class="token punctuation">{</span>
            node<span class="token punctuation">.</span>prev <span class="token operator">=</span> pred <span class="token operator">=</span> pred<span class="token punctuation">.</span>prev<span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">while</span> <span class="token punctuation">(</span>pred<span class="token punctuation">.</span>waitStatus <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token comment">// 找到waitStatus不是大于0的节点后, 将waitStatus &gt; 0 的节点剔除队列</span>
        pred<span class="token punctuation">.</span>next <span class="token operator">=</span> node<span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">/*
             * waitStatus must be 0 or PROPAGATE.  Indicate that we
             * need a signal, but don&#39;t park yet.  Caller will need to
             * retry to make sure it cannot acquire before parking.
             */</span>
        <span class="token comment">// 当前节点的前置节点是0或&lt;0的情况</span>
        <span class="token comment">// 将当前线程node的前置node状态强制设置为SIGNAL，表示前置节点释放锁之后需要唤醒我...</span>
        <span class="token comment">// 说白了就是，当某个线程的node想排队的时候，它会把它的前置node的status设置为-1</span>
        <span class="token function">compareAndSetWaitStatus</span><span class="token punctuation">(</span>pred<span class="token punctuation">,</span> ws<span class="token punctuation">,</span> <span class="token class-name">Node</span><span class="token punctuation">.</span><span class="token constant">SIGNAL</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * Convenience method to park and then check if interrupted
 * 将当前线程挂起，唤醒后返回当前线程是否为&quot;中断信号&quot;唤醒
 * <span class="token keyword">@return</span> <span class="token punctuation">{</span><span class="token keyword">@code</span> <span class="token code-section"><span class="token code language-java"><span class="token boolean">true</span></span></span><span class="token punctuation">}</span> if interrupted
 */</span>
<span class="token keyword">private</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">parkAndCheckInterrupt</span><span class="token punctuation">(</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 将当前线程挂起</span>
    <span class="token class-name">LockSupport</span><span class="token punctuation">.</span><span class="token function">park</span><span class="token punctuation">(</span><span class="token keyword">this</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token comment">// 唤醒后执行下面操作</span>
    <span class="token keyword">return</span> <span class="token class-name">Thread</span><span class="token punctuation">.</span><span class="token function">interrupted</span><span class="token punctuation">(</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * Cancels an ongoing attempt to acquire.
 * 取消指定node参与竞争
 * <span class="token keyword">@param</span> <span class="token parameter">node</span> the node
 */</span>
<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">cancelAcquire</span><span class="token punctuation">(</span><span class="token class-name">Node</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// Ignore if node doesn&#39;t exist</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>node <span class="token operator">==</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
        <span class="token keyword">return</span><span class="token punctuation">;</span>

    <span class="token comment">// 因为已经取消排队了，所以node内部关联的当前线程置为null就好了</span>
    node<span class="token punctuation">.</span>thread <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>

    <span class="token comment">// Skip cancelled predecessors</span>
    <span class="token comment">// 获取当前取消排队node的前驱</span>
    <span class="token class-name">Node</span> pred <span class="token operator">=</span> node<span class="token punctuation">.</span>prev<span class="token punctuation">;</span>
    <span class="token comment">// 跳过需要需要排队的节点</span>
    <span class="token keyword">while</span> <span class="token punctuation">(</span>pred<span class="token punctuation">.</span>waitStatus <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span>
        node<span class="token punctuation">.</span>prev <span class="token operator">=</span> pred <span class="token operator">=</span> pred<span class="token punctuation">.</span>prev<span class="token punctuation">;</span>

    <span class="token comment">// predNext is the apparent node to unsplice. CASes below will</span>
    <span class="token comment">// fail if not, in which case, we lost race vs another cancel</span>
    <span class="token comment">// or signal, so no further action is necessary.</span>
    <span class="token comment">// 拿到前驱的next节点, 有一下情况</span>
    <span class="token comment">// 1.当前node</span>
    <span class="token class-name">Node</span> predNext <span class="token operator">=</span> pred<span class="token punctuation">.</span>next<span class="token punctuation">;</span>

    <span class="token comment">// Can use unconditional write instead of CAS here.</span>
    <span class="token comment">// After this atomic step, other Nodes can skip past us.</span>
    <span class="token comment">// Before, we are free of interference from other threads.</span>
    <span class="token comment">// 将当前node状态设置为取消状态1</span>
    node<span class="token punctuation">.</span>waitStatus <span class="token operator">=</span> <span class="token class-name">Node</span><span class="token punctuation">.</span><span class="token constant">CANCELLED</span><span class="token punctuation">;</span>

    <span class="token comment">// If we are the tail, remove ourselves.</span>
    <span class="token doc-comment comment">/**
         * 当前取消排队的node所在队列的位置不同，执行出队策略是不一样的，一共分为3种情况。
         * 1:当前node是队尾 tail -&gt; node
         * 2:当前node不是head.next节点，也不是tail节点
         * 3:当前node是head.next节点。
         */</span>

    <span class="token comment">// 第一种情况</span>
    <span class="token comment">// 条件一: node=tail成立，当前node是队尾 tail -&gt; node</span>
    <span class="token comment">// 条件二:compareAndSetTail(node,pred)成功的话, 说明修改tail完成, 即将当前节点的前驱设置为tail</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>node <span class="token operator">==</span> tail <span class="token operator">&amp;&amp;</span> <span class="token function">compareAndSetTail</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> pred<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 修改pred.next -&gt; null,完成node出队</span>
        <span class="token function">compareAndSetNext</span><span class="token punctuation">(</span>pred<span class="token punctuation">,</span> predNext<span class="token punctuation">,</span> <span class="token keyword">null</span><span class="token punctuation">)</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
        <span class="token comment">// If successor needs signal, try to set pred&#39;s next-link</span>
        <span class="token comment">// so it will get one. Otherwise wake it up to propagate.</span>
        <span class="token comment">// 保存节点状态</span>
        <span class="token keyword">int</span> ws<span class="token punctuation">;</span>

        <span class="token comment">// 第二种情况：当前node不是head.next节点，也不是tail</span>
        <span class="token comment">// 条件一：pred!=head 说明当前node不是head.next节点，也不是tail节点</span>
        <span class="token comment">// 条件二： ((ws = pred.waitStatus) == Node.SIGNAL || (ws &lt;= 0 &amp;&amp; compareAndSetWaitStatus(pred, ws, Node.SIGNAL)))</span>
        <span class="token comment">// 条件2.1 (ws = pred.waitStatus) == Node.SIGNAL 成立:说明node的前驱状态是Signal状态. 不成立：前驱状态可能是0，</span>
        <span class="token comment">// 极端情况下：前驱也取消排队了</span>
        <span class="token comment">// 条件2.2: (ws &lt;= 0 &amp;&amp; compareAndSetWaitStatus(pred, ws, Node.SIGNAL))</span>
        <span class="token comment">// 假设前驱状态 ws&lt;=0 则设置前驱状态为Signal状态，表示要唤醒后继节点</span>

        <span class="token comment">// if里面做的事情，就是让pred.next -&gt; node.next, 所有需要保证pred节点状态为Signal状态</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>pred <span class="token operator">!=</span> head <span class="token operator">&amp;&amp;</span>
            <span class="token punctuation">(</span><span class="token punctuation">(</span>ws <span class="token operator">=</span> pred<span class="token punctuation">.</span>waitStatus<span class="token punctuation">)</span> <span class="token operator">==</span> <span class="token class-name">Node</span><span class="token punctuation">.</span><span class="token constant">SIGNAL</span> <span class="token operator">||</span>
             <span class="token punctuation">(</span>ws <span class="token operator">&lt;=</span> <span class="token number">0</span> <span class="token operator">&amp;&amp;</span> <span class="token function">compareAndSetWaitStatus</span><span class="token punctuation">(</span>pred<span class="token punctuation">,</span> ws<span class="token punctuation">,</span> <span class="token class-name">Node</span><span class="token punctuation">.</span><span class="token constant">SIGNAL</span><span class="token punctuation">)</span><span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token operator">&amp;&amp;</span>
            pred<span class="token punctuation">.</span>thread <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>

            <span class="token comment">// 情况2：当前node不是head.next节点，也不是tail</span>
            <span class="token comment">// 出队: pred.next -&gt; node.next 节点后，当node.next节点被唤醒后，调用shouldParkAfterFailedAcquire会让node.next节点越过取消状态的节点，完成真正的出队</span>
            <span class="token class-name">Node</span> next <span class="token operator">=</span> node<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>next <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> next<span class="token punctuation">.</span>waitStatus <span class="token operator">&lt;=</span> <span class="token number">0</span><span class="token punctuation">)</span>
                <span class="token function">compareAndSetNext</span><span class="token punctuation">(</span>pred<span class="token punctuation">,</span> predNext<span class="token punctuation">,</span> next<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span> <span class="token keyword">else</span> <span class="token punctuation">{</span>
            <span class="token comment">// 当前node是head.next节点</span>
            <span class="token comment">// 类似情况2，后继节点唤醒后，会调用shouldParkAfterFailedAcquire会让node.next节点越过取消状态的节点</span>
            <span class="token comment">// 队列的第三个节点会直接与head建立双重指向的关系，head.next-&gt;第三个node 中间就是被出队的head.next节点 第三个node.prev -&gt; head</span>
            <span class="token function">unparkSuccessor</span><span class="token punctuation">(</span>node<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token punctuation">}</span>

        node<span class="token punctuation">.</span>next <span class="token operator">=</span> node<span class="token punctuation">;</span> <span class="token comment">// help GC</span>
    <span class="token punctuation">}</span>
<span class="token punctuation">}</span>

<span class="token doc-comment comment">/**
 * Wakes up node&#39;s successor, if one exists.
 *
 * <span class="token keyword">@param</span> <span class="token parameter">node</span> the node
 */</span>
<span class="token keyword">private</span> <span class="token keyword">void</span> <span class="token function">unparkSuccessor</span><span class="token punctuation">(</span><span class="token class-name">Node</span> node<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">/*
         * If status is negative (i.e., possibly needing signal) try
         * to clear in anticipation of signalling.  It is OK if this
         * fails or if status is changed by waiting thread.
         */</span>
    <span class="token comment">// 获取当前节点的状态</span>
    <span class="token keyword">int</span> ws <span class="token operator">=</span> node<span class="token punctuation">.</span>waitStatus<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>ws <span class="token operator">&lt;</span> <span class="token number">0</span><span class="token punctuation">)</span>
        <span class="token comment">//-1 Signal 改成0的原因：因为当前节点已经完成喊后续节点的任务了。</span>
        <span class="token function">compareAndSetWaitStatus</span><span class="token punctuation">(</span>node<span class="token punctuation">,</span> ws<span class="token punctuation">,</span> <span class="token number">0</span><span class="token punctuation">)</span><span class="token punctuation">;</span>

    <span class="token comment">/*
         * Thread to unpark is held in successor, which is normally
         * just the next node.  But if cancelled or apparently null,
         * traverse backwards from tail to find the actual
         * non-cancelled successor.
         */</span>

    <span class="token comment">// 条件一：</span>
    <span class="token comment">// s什么时候等于null？</span>
    <span class="token comment">// 1.当前节点就是tail节点时，s==null</span>

    <span class="token comment">// 条件二： s.waitStatus&gt;0 前提：s!=null</span>
    <span class="token comment">// 成立：说明当前node节点的后续节点是取消状态... 需要找一个合适的可以被唤醒的节点。此处可以画图看看。</span>
    <span class="token comment">/*
            head指向节点0，s指向节点1，t指向节点5。 则最终s指向节点3
             0       1      2       3       4      5
            node -&gt; [1] -&gt; [1] -&gt; [-1] -&gt; [-1] -&gt; [0]
         */</span>
    <span class="token class-name">Node</span> s <span class="token operator">=</span> node<span class="token punctuation">.</span>next<span class="token punctuation">;</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>s <span class="token operator">==</span> <span class="token keyword">null</span> <span class="token operator">||</span> s<span class="token punctuation">.</span>waitStatus <span class="token operator">&gt;</span> <span class="token number">0</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// 查找可以被唤醒的节点...</span>
        s <span class="token operator">=</span> <span class="token keyword">null</span><span class="token punctuation">;</span>
        <span class="token keyword">for</span> <span class="token punctuation">(</span><span class="token class-name">Node</span> t <span class="token operator">=</span> tail<span class="token punctuation">;</span> t <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> t <span class="token operator">!=</span> node<span class="token punctuation">;</span> t <span class="token operator">=</span> t<span class="token punctuation">.</span>prev<span class="token punctuation">)</span>
            <span class="token keyword">if</span> <span class="token punctuation">(</span>t<span class="token punctuation">.</span>waitStatus <span class="token operator">&lt;=</span> <span class="token number">0</span><span class="token punctuation">)</span>
                s <span class="token operator">=</span> t<span class="token punctuation">;</span>
        <span class="token comment">// 上面循环，会找到一个离当前node最近的一个可以被唤醒的node，node可能找不到，node可能是null</span>
    <span class="token punctuation">}</span>
    <span class="token comment">// 如果找到合适的可以被唤醒的node，则唤醒..，找不到啥也不做</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span>s <span class="token operator">!=</span> <span class="token keyword">null</span><span class="token punctuation">)</span>
        <span class="token class-name">LockSupport</span><span class="token punctuation">.</span><span class="token function">unpark</span><span class="token punctuation">(</span>s<span class="token punctuation">.</span>thread<span class="token punctuation">)</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>

</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div><p><strong>释放锁的源码</strong></p><div class="language-java line-numbers-mode" data-ext="java"><pre class="language-java"><code><span class="token keyword">public</span> <span class="token keyword">final</span> <span class="token keyword">boolean</span> <span class="token function">release</span><span class="token punctuation">(</span><span class="token keyword">int</span> arg<span class="token punctuation">)</span> <span class="token punctuation">{</span>
    <span class="token comment">// 尝试释放锁，tryRelease返回true表示当前线程已经完全释放锁</span>
    <span class="token comment">// 返回false，说明当前线程尚未完全释放锁</span>
    <span class="token keyword">if</span> <span class="token punctuation">(</span><span class="token function">tryRelease</span><span class="token punctuation">(</span>arg<span class="token punctuation">)</span><span class="token punctuation">)</span> <span class="token punctuation">{</span>
        <span class="token comment">// head什么情况下会被创建出来？</span>
        <span class="token comment">// 当持锁线程未释放线程时，且持锁期间有其他线程想要获取锁时，其他线程发现获取不了锁，而且队列是空队列，此时后续线程会为当前持锁中的线程构建出来一个head节点。后续线程会追加到head节点后面</span>
        <span class="token class-name">Node</span> h <span class="token operator">=</span> head<span class="token punctuation">;</span>
        <span class="token comment">// 条件一成立：说明队列中head已经初始化过了，ReentrantLock在使用期间发生过多线程竞争了</span>
        <span class="token comment">// 条件二成立：说明head后面一定插入过node节点</span>
        <span class="token keyword">if</span> <span class="token punctuation">(</span>h <span class="token operator">!=</span> <span class="token keyword">null</span> <span class="token operator">&amp;&amp;</span> h<span class="token punctuation">.</span>waitStatus <span class="token operator">!=</span> <span class="token number">0</span><span class="token punctuation">)</span>
            <span class="token comment">// 唤醒后继节点</span>
            <span class="token function">unparkSuccessor</span><span class="token punctuation">(</span>h<span class="token punctuation">)</span><span class="token punctuation">;</span>
        <span class="token keyword">return</span> <span class="token boolean">true</span><span class="token punctuation">;</span>
    <span class="token punctuation">}</span>
    <span class="token keyword">return</span> <span class="token boolean">false</span><span class="token punctuation">;</span>
<span class="token punctuation">}</span>
</code></pre><div class="line-numbers" aria-hidden="true"><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div><div class="line-number"></div></div></div>`,7),o=[p];function c(l,i){return s(),a("div",null,o)}const r=n(t,[["render",c],["__file","AQS源码理解——ReentrantLock.html.vue"]]);export{r as default};
