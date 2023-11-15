---
title: RocketMQ面试题
category: [RocketMQ]
tag: [后端, 中间件]
date: 2023-10-30 22:00:00
---

## RocketMQ如何保证消费幂等？

> 也可以理解为RocketMQ如何防止重复消费？

### 消息幂等

当出现消费者对某条消息重复消费的情况时，**重复消费的结果与消费一次的结果是相同**，并且**多次消费并未对业务系统产生任何负面影响**，那么这个消费者的处理过程就是幂等的。

### 适用场景

**1. 发送消息时重复**

当一条消息已被成功发送到服务端并完成持久化，此时出现了网络闪断或者客户端宕机，导致MQ服务端对客户端应答失败。 此时生产者意识到消息发送失败并尝试再次发送消息，消费者后续会收到两条内容相同但Message ID不同的消息。

**2. 投递时消息重复**

消息已投递到消费者并完成业务处理，当客户端给服务端反馈应答的时候网络闪断，导致消费成功的状态无法返回给MQ服务端。为了保证消息至少被消费一次，RocketMQ服务端将在网络恢复后再次尝试投递之前已被处理过的消息，消费者后续会收到两条内容相同并且Message ID也相同的消息。

**3. 负载均衡时消息重复**

当RocketMQ的Broker或客户端重启、扩容或缩容时，会触发Rebalance，此时消费者可能会收到少量重复消息。

### 处理方法

因为**不同的Message ID对应的消息内容可能相同**，有可能出现冲突（重复）的情况，所以真正安全的幂等处理，不建议以Message ID作为处理依据。

最好的方式是**以业务唯一标识作为幂等处理的关键依据**，而业务的唯一标识可以通过消息Key设置。

以支付场景为例，可以将消息的Key设置为订单号，作为幂等处理的依据。具体代码示例如下：

```java
Message message = new Message();
message.setKey("ORDERID_100");
SendResult sendResult = producer.send(message);    
```

消费者收到消息时可以根据消息的Key，即订单号来实现消息幂等：

```java
consumer.subscribe("ons_test", "*", new MessageListener() {
    public Action consume(Message message, ConsumeContext context) {
        String key = message.getKey()
        // 根据业务唯一标识的Key做幂等处理。
    }
});   
```

处理方式如下：

#### 1. 数据库对唯一标识字段设置唯一索引

#### 2. 对数据库使用`select for update`或者乐观锁

```java
select * from t_order where order_no = 'THIS_ORDER_NO' for update  //开启事务
if(order.status != null) {
    return ;//消息重复，直接返回
}
```

#### 3. 基于关系数据库事务插入消息表

在数据库中增加一个消息消费记录表，把消息插入到这个表，并且把原来的订单更新和这个插入的动作放到同一个事务中一起提交，就能保证消息只会被消费一遍了。

1. 开启事务
2. 插入消息表（解决主键冲突，需要选择好唯一标识）
3. 更新订单表（消费逻辑）
4. 提交事务

按照上面步骤：如果消息消费成功，则消息也插入成功。此时就算再次投递该条消息，也会因为插入消息表失败而回滚事务，从而保证消费幂等。

#### 4. 拆解消息

第三个方案基于事务，可能导致锁表时间过长等性能问题。考虑下面这个场景：

1. 检查库存（RPC）
2. 锁库存（RPC）
3. 开启事务，插入订单表（MySQL）
4. 调用某些其他下游服务（RPC）
5. 更新订单状态
6. commit 事务（MySQL）

这种情况下，采取消息表+本地事务的实现方式，消息消费过程中很多子过程是不支持回滚的。特别是RPC调用，如果增加分布式事务，将大大降低系统并发。

**拆解消息过程：**

1. 库存系统消费A：检查库存并做锁库存，发送消息B给订单服务
2. 订单系统消费消息B：插入订单表（MySQL），发送消息C给自己（下游系统）消费
3. 下游系统消费消息C：处理部分逻辑，发送消息D给订单系统
4. 订单系统消费消息D：更新订单状态

上面操作使得每一步的操作都比较原子，意味着使用消息表+事务的方案显得可行。

### 参考：

- https://jaskey.github.io/blog/2020/06/08/rocketmq-message-dedup/

## 如何保证消息不丢失/可靠性？

一条消息从生产到被消费，将会经历三个阶段：

![image-20231031220524727](./assets/image-20231031220524727.png)

### 生产阶段

**概述**：通过请求确认机制保证消息传递可靠性。如果消息发送失败，可以尝试一下操作：

- 直接捕获异常重试
- 将消息存储到db，然后由后台线程定时重试，确保消息一定到达Broker

**同步发送消息**：

```java
try {
    SendResult sendResult = mqProducer.send(msg);
} catch (RemotingException e) {
    e.printStackTrace();
} catch (MQBrokerException e) {
    e.printStackTrace();
} catch (InterruptedException e) {
    e.printStackTrace();
} catch (MQClientException e) {
    e.printStackTrace();
}
```

`send`方法不抛出异常就表示消息发送成功，业务中可以对异常进行捕获进行重试。

**异步发送消息**：

```java
try {
    // 异步发送消息到，主线程不会被阻塞，立刻会返回
    mqProducer.send(msg, new SendCallback() {
        @Override
        public void onSuccess(SendResult sendResult) {
            // 消息发送成功，
        }

        @Override
        public void onException(Throwable e) {
            // 消息发送失败，可以持久化这条数据，后续进行补偿处理
        }
    });
} catch (RemotingException e) {
    e.printStackTrace();
} catch (InterruptedException e) {
    e.printStackTrace();
} catch (MQClientException e) {
    e.printStackTrace();
}
```

异步发送一定要重新回调方法，可以在消息发送失败回调`onException()`方法中进行重试处理。

可以通过下面两个参数设置重试次数：

```java
// 同步发送消息重试次数，默认为 2
mqProducer.setRetryTimesWhenSendFailed(3);
// 异步发送消息重试次数，默认为 2
mqProducer.setRetryTimesWhenSendAsyncFailed(3);
```

### 存储阶段

**同步刷盘**：只有在消息真正持久化至磁盘后 RocketMQ 的 Broker 端才会真正返回给 Producer 端一个成功的 ACK 响应。同步刷盘对 MQ 消息可靠性来说是一种不错的保障，但是性能上会有较大影响，一般适用于金融业务应用该模式较多。

**异步刷盘（默认）**：能够充分利用 OS 的 **PageCache** 的优势，只要消息写入 **PageCache** 即可将成功的 ACK 返回给 Producer 端。消息刷盘采用后台异步线程提交的方式进行，降低了读写延迟，提高了 MQ 的性能和吞吐量。

所以，为了保证 `Broker` 端不丢消息，可以设置为**同步刷盘**：

```java
## 默认情况为 ASYNC_FLUSH 
flushDiskType = SYNC_FLUSH 
```

当`Broker`服务器未在同步刷盘时间内（**默认为5s**）完成刷盘，则将返回该状态——刷盘超时。

**集群部署**：

为了保证可用性，`Broker `通常采用一主（**master**）多从（**slave**）部署方式。为了保证消息不丢失，消息还需要复制到 **slave** 节点。

默认方式下，消息写入 **master** 成功，就可以返回确认响应给生产者，接着消息将会异步复制到 **slave** 节点。

> flushDiskType 默认值是ASYNC_FLUSH（异步刷盘）

若 master 突然**宕机且不可恢复**，那么还未复制到 **slave** 的消息将会丢失。

所以为了提高消息的可靠性，采用**同步刷盘**方式，**master** 节点将会同步等待 **slave** 节点复制完成，才会返回确认响应。

**小结**：

结合生产阶段与存储阶段，若需要**严格保证消息不丢失**，broker 需要采用如下配置：

```bash
## master 节点配置
# 同步刷盘
flushDiskType = SYNC_FLUSH
# 同步master服务器
brokerRole = SYNC_MASTER

## slave 节点配置
brokerRole = slave
# 同步刷盘
flushDiskType = SYNC_FLUSH
```

### 消费阶段

消费者从 broker 拉取消息，然后执行相应的业务逻辑。一旦执行成功，将会返回 `ConsumeConcurrentlyStatus.CONSUME_SUCCESS` 状态给 Broker。

如果 Broker 未收到消费确认响应或收到其他状态，消费者下次还会再次拉取到该条消息，进行重试。这样的方式有效避免了消费者消费过程发生异常，或者消息在网络传输中丢失的情况。**但业务方需要考虑是否保证消息幂等**。具体方案见上文。

### 参考

- https://github.com/apache/rocketmq/blob/master/docs/cn/best_practice.md

## 如何处理消息积压？

### 产生原因

#### 消费耗时

代码中如果没有复杂的递归和循环的话，内部计算耗时相对外部 I/O 操作来说几乎可以忽略。外部 I/O 操作通常包括如下业务逻辑：

- 读写外部数据库，例如 MySQL 数据库读写。
- 读写外部缓存等系统，例如 Redis 读写。
- 下游系统调用，例如 Dubbo 调用或者下游 HTTP 接口调用。

#### 消费逻辑异常

消费者业务异常或者宕机，导致生产者不停投递消息到 Broker，消息被积压在 Broker 没有被消费

### 如何避免消息堆积？

- 梳理消息的消费耗时

  主要关注一下信息：

  - 消息消费逻辑的计算复杂度是否过高，代码是否存在无限循环和递归等缺陷。
  - 消息消费逻辑中的 I/O 操作（如：外部调用、读写存储等）是否是必须的，能否用本地缓存等方案规避。
  - 消费逻辑中的复杂耗时的操作是否可以做异步化处理，如果可以是否会造成逻辑错乱（消费完成但异步操作未完成）。

- 设置消息的消费并发度
  - 逐步调大线程的单个节点的线程数，并观测节点的系统指标，得到单个节点最优的消费线程数和消息吞吐量。
  - 得到单个节点的最优线程数和消息吞吐量后，根据上下游链路的流量峰值计算出需要设置的节点数，节点数=流量峰值/单线程消息吞吐量。

### 如何处理消息堆积？

消费逻辑无问题并且消费耗时正常情况下，可以考虑下面方案：

- **消费者扩容**

  Topic 中 MessageQueue 的数量大于 Comsumer 实例数量时，可以增加 Consumer 实例数量。MessageQueue 会进行 Rebalance重新分配给 Consumer 实例。但要考虑 DB 读写压力。

- **消息迁移到新 Topic，然后扩容 MessageQueue**

  Topic 的 MessageQueue 的数量小于或者等于消费者数量，这种情况，再扩容消费者就没什么用，就得考虑扩容 MessageQueue。可以新建一个临时的 Topic，临时的Topic多设置一些 MessageQueue，然后先用一些消费者把消费的数据丢到临时的Topic，因为不用业务处理，只是转发一下消息，速度很快。接下来用扩容的消费者去消费新的 Topic 里的数据，消费完了之后，恢复原状。

- **根据具体业务能否限制消息发送速率**

  结合具体业务，使用令牌桶等限流算法限制消息发送速率。

### 参考：

- https://help.aliyun.com/zh/apsaramq-for-rocketmq/cloud-message-queue-rocketmq-4-x-series/use-cases/how-do-i-handle-accumulated-messages

## 如何实现顺序消息？

### 局部顺序
- 一个 Topic 下相同标识消息放入同一个分区队列
- Consumer 同一队列只能有一个线程消费

### 全局顺序

- 一个 Topic 下只能有一个队列
- Consumer 只能有一个线程消费

**综上所述**：保证一组消息发送到同一分区队列，Consumer 保证同一队列只有一个线程消费。

**代码示例（来自官方）**：

生产者使用 `MessageQueueSelector ` 类来控制 把消息发往哪个 `Message Queue` 。

```java
public static void main(String[] args) throws Exception {
    DefaultMQProducer producer = new DefaultMQProducer("order_producer_group");
    producer.setNamesrvAddr("106.15.42.148:9876");
    producer.start();

    String[] tags = new String[]{"TagA", "TagB", "TagC"};

    // 订单列表
    List<OrderStep> orderList = new Producer().buildOrders();

    Date date = new Date();
    SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
    String dateStr = sdf.format(date);
    for (int i = 0; i < 10; i++) {
        // 添加时间前缀
        String body = dateStr + " Hello RocketMQ " + orderList.get(i);
        Message msg = new Message("TopicTestInorder", tags[i % tags.length], "KEY" + i, body.getBytes(StandardCharsets.UTF_8));

        SendResult sendResult = producer.send(msg, new MessageQueueSelector() {
            @Override
            public MessageQueue select(List<MessageQueue> mqs, Message msg, Object arg) {
                // 根据订单id选择发送的queue
                Long id = (Long) arg;
                long index = id % mqs.size();
                return mqs.get((int) index);
            }
        }, orderList.get(i).getOrderId());

        System.out.printf("SendResult status:%s, queueId:%d, body:%s%n",
                          sendResult.getSendStatus(),
                          sendResult.getMessageQueue().getQueueId(),
                          body);
    }
    producer.shutdown();
}
```

消费端通过使用 `MessageListenerOrderly `来解决单 `MessageQueue` 的消息被并发处理的问题。

```java
 consumer.registerMessageListener(new MessageListenerOrderly() {
            final Random random = new Random();
            
            @Override
            public ConsumeOrderlyStatus consumeMessage(List<MessageExt> msgs, ConsumeOrderlyContext context) {
                context.setAutoCommit(true);
                for (MessageExt msg : msgs) {
                    // 可以看到每个queue有唯一的consume线程来消费, 订单对每个queue(分区)有序
                    System.out.println("consumeThread=" + Thread.currentThread().getName() + "queueId=" + msg.getQueueId() + ", content:" + new String(msg.getBody()));
                }
                
                try {
                    TimeUnit.SECONDS.sleep(random.nextInt(10));
                } catch (Exception e) {
                    e.printStackTrace();
                }
                return ConsumeOrderlyStatus.SUCCESS;
            }
        });
```

## 如何实现消息过滤？

消息过滤主要通过以下几个关键流程实现：

- 生产者：生产者在初始化消息时预先为消息设置一些属性和标签，用于后续消费时指定过滤目标。
- 消费者：消费者在初始化及后续消费流程中通过调用订阅关系注册接口，向服务端上报需要订阅指定主题的哪些消息，即过滤条件。
- 服务端：消费者获取消息时会触发服务端的动态过滤计算，Apache RocketMQ 服务端根据消费者上报的过滤条件的表达式进行匹配，并将符合条件的消息投递给消费者。

**消息过滤分类**

RocketMQ 支持 Tag 标签过滤和 SQL 属性过滤，这两种过滤方式对比如下：

| 对比项   | Tag标签过滤                      | SQL属性过滤                                                  |
| -------- | -------------------------------- | ------------------------------------------------------------ |
| 过滤目标 | 消息的 Tag 标签。                | 消息的属性，包括用户自定义属性以及系统属性（ Tag 是一种系统属性）。 |
| 过滤能力 | 精准匹配。                       | SQL 语法匹配。                                               |
| 适用场景 | 简单过滤场景、计算逻辑简单轻量。 | 复杂过滤场景、计算逻辑较复杂。                               |

### Tag 标签过滤

生产者在发送消息时，设置消息的 Tag 标签，消费者需指定已有的 Tag 标签来进行匹配订阅。

**Tag 标签设置**

- Tag 由生产者发送消息时设置，每条消息允许设置一个 Tag 标签。
- Tag 使用可见字符，建议长度不超过128字符。

**Tag标签过滤规则**

Tag 标签过滤为精准字符串匹配，过滤规则设置格式如下：

- 单 Tag 匹配：过滤表达式为目标 Tag 。表示只有消息标签为指定目标 Tag 的消息符合匹配条件，会被发送给消费者。
- 多 Tag 匹配：多个 Tag 之间为或的关系。不同 Tag 间使用两个竖线（||）隔开。例如，Tag1||Tag2||Tag3，表示标签为 Tag1 或 Tag2 或 Tag3 的消息都满足匹配条件，都会被发送给消费者进行消费。
- 全部匹配：使用星号（*）作为全匹配表达式。表示 Topic 下的所有消息都将被发送给消费者进行消费。

### SQL 属性过滤

生产者为消息设置的属性（Key）及属性值（Value）进行匹配。生产者在发送消息时可设置多个属性，消费者订阅时可设置SQL语法的过滤表达式过滤多个属性。

> :pushpin: Tag 是一种系统属性，所以 SQL 过滤方式也兼容 Tag 标签过滤。在 SQL 语法中，Tag 的属性名称为 TAGS。

**消息属性设置**

生产者发送消息时可以自定义消息属性，每个属性都是一个自定义的键值对（Key-Value）。

每条消息支持设置多个属性。

**SQL属性过滤规则**

SQL 属性过滤使用 SQL92 语法作为过滤规则表达式，语法规范如下：

| 语法                    | 说明                                                         | 示例                                                         |
| ----------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| IS NULL                 | 判断属性不存在。                                             | `a IS NULL` ：属性a不存在。                                  |
| IS NOT NULL             | 判断属性存在。                                               | `a IS NOT NULL`：属性a存在。                                 |
| *>* >= *<* <=           | 用于比较数字，不能用于比较字符串，否则消费者客户端启动时会报错。 **说明** 可转化为数字的字符串也被认为是数字。 | *`a IS NOT NULL AND a > 100`：属性a存在且属性a的值大于100。* `a IS NOT NULL AND a > 'abc'`：错误示例，abc为字符串，不能用于比较大小。 |
| BETWEEN xxx AND xxx     | 用于比较数字，不能用于比较字符串，否则消费者客户端启动时会报错。等价于>= xxx AND \<= xxx。表示属性值在两个数字之间。 | `a IS NOT NULL AND (a BETWEEN 10 AND 100)`：属性a存在且属性a的值大于等于10且小于等于100。 |
| NOT BETWEEN xxx AND xxx | 用于比较数字，不能用于比较字符串，否则消费者客户端启动会报错。等价于\< xxx OR > xxx，表示属性值在两个值的区间之外。 | `a IS NOT NULL AND (a NOT BETWEEN 10 AND 100)`：属性a存在且属性a的值小于10或大于100。 |
| IN (xxx, xxx)           | 表示属性的值在某个集合内。集合的元素只能是字符串。           | `a IS NOT NULL AND (a IN ('abc', 'def'))`：属性a存在且属性a的值为abc或def。 |
| *=* <>                  | 等于和不等于。可用于比较数字和字符串。                       | `a IS NOT NULL AND (a = 'abc' OR a<>'def')`：属性a存在且属性a的值为abc或a的值不为def。 |
| *AND* OR                | 逻辑与、逻辑或。可用于组合任意简单的逻辑判断，需要将每个逻辑判断内容放入括号内。 | `a IS NOT NULL AND (a > 100) OR (b IS NULL)`：属性a存在且属性a的值大于100或属性b不存在。 |

由于 SQL 属性过滤是生产者定义消息属性，消费者设置 SQL 过滤条件，因此过滤条件的计算结果具有不确定性，服务端的处理方式如下：

- 异常情况处理：如果过滤条件的表达式计算抛异常，消息默认被过滤，不会被投递给消费者。例如比较数字和非数字类型的值。
- 空值情况处理：如果过滤条件的表达式计算值为 null 或不是布尔类型（true和false），则消息默认被过滤，不会被投递给消费者。例如发送消息时未定义某个属性，在订阅时过滤条件中直接使用该属性，则过滤条件的表达式计算结果为 null。
- 数值类型不符处理：如果消息自定义属性为浮点型，但过滤条件中使用整数进行判断，则消息默认被过滤，不会被投递给消费者。

**使用示例**

发送消息，同时设置消息Tag标签和自定义属性：

```java
Message message = messageBuilder.setTopic("topic")
//设置消息索引键，可根据关键字精确查找某条消息。
.setKeys("messageKey")
//设置消息Tag，用于消费端根据指定Tag过滤消息。
//该示例表示消息的Tag设置为"messageTag"。
.setTag("messageTag")
//消息也可以设置自定义的分类属性，例如环境标签、地域、逻辑分支。
//该示例表示为消息自定义一个属性，该属性为地域，属性值为杭州。
.addProperty("Region", "Hangzhou")
//消息体。
.setBody("messageBody".getBytes())
.build();
```

订阅消息，同时根据多个自定义属性匹配消息:

```java
String topic = "topic";
//只订阅地域属性为杭州且价格属性大于30的消息。
FilterExpression filterExpression = new FilterExpression("Region IS NOT NULL AND price IS NOT NULL AND Region = 'Hangzhou' AND price > 30", FilterExpressionType.SQL92);
simpleConsumer.subscribe(topic, filterExpression);
```

### 参考

- https://rocketmq.apache.org/zh/docs/featureBehavior/07messagefilter/

## 延时消息

### 功能原理

**定时时间设置原则**

- RocketMQ 定时消息设置的定时时间是一个预期触发的系统时间戳，延时时间也需要转换成当前系统时间后的某一个时间戳，而不是一段延时时长。
- 定时时间的格式为毫秒级的 Unix 时间戳。
- 定时时间必须设置在定时时长范围内，超过范围则定时不生效，服务端会立即投递消息。
- 定时时长最大值默认为24小时，不支持自定义修改。
- 定时时间必须设置为当前时间之后，若设置到当前时间之前，则定时不生效，服务端会立即投递消息。

**示例如下：**

- 定时消息：例如，当前系统时间为 2022-06-09 17:30:00，您希望消息在下午 19:20:00 定时投递，则定时时间为 2022-06-09 19:20:00，转换成时间戳格式为1654773600000。
- 延时消息：例如，当前系统时间为 2022-06-09 17:30:00 ，您希望延时1个小时后投递消息，则您需要根据当前时间和延时时长换算成定时时刻，即消息投递时间为 2022-06-09 18:30:00，转换为时间戳格式为 1654770600000。

**定时消息生命周期**

![image-20231101225737392](./assets/image-20231101225737392.png)

- 初始化：消息被生产者构建并完成初始化，待发送到服务端的状态。
- 定时中：消息被发送到服务端，和普通消息不同的是，服务端不会直接构建消息索引，而是会将定时消息单独存储在**定时存储系统**中，等待定时时刻到达。
- 待消费：定时时刻到达后，服务端将消息重新写入**普通存储引擎**，对下游消费者可见，等待消费者消费的状态。

- 消费中：消息被消费者获取，并按照消费者本地的业务逻辑进行处理的过程。 此时服务端会等待消费者完成消费并提交消费结果，如果一定时间后没有收到消费者的响应，RocketMQ 会对消息进行重试处理。
- 消费提交：消费者完成消费处理，并向服务端提交消费结果，服务端标记当前消息已经被处理（包括消费成功和失败）。RocketMQ 默认支持保留所有消息，此时消息数据并不会立即被删除，只是逻辑标记已消费。消息在保存时间到期或存储空间不足被删除前，消费者仍然可以回溯消息重新消费。
- 消息删除：Apache RocketMQ按照消息保存机制滚动清理最早的消息数据，将消息从物理文件中删除。

### 使用限制

**消息类型一致性**

定时消息仅支持在 MessageType 为 **Delay** 的主题内使用，即定时消息只能发送至类型为定时消息的主题中，发送的消息的类型必须和主题的类型一致。

**定时精度约束**

Apache RocketMQ 定时消息的定时时长参数精确到毫秒级，但是默认精度为1000ms，即定时消息为**秒级精度**。

Apache RocketMQ 定时消息的状态支持持久化存储，系统由于故障重启后，仍支持按照原来设置的定时时间触发消息投递。若存储系统异常重启，可能会导致定时消息投递出现一定延迟。

### 参考

- https://rocketmq.apache.org/zh/docs/featureBehavior/02delaymessage

## 死信队列

### 背景

当一条消息消费失败会进行重试，达到最大重试次数后（默认16次，客户端可配置），如果消费依然失败，会将该消息存储到死信队列中。

### 特性

**死信消息**：
- 不会再被消费者消费。
- 有效期与正常消息相同，默认为3天，3天后会被自动删除。

**死信队列**：
- 一个死信队列对应一个 Group ID，而不是单个消费者实例。
- 如果一个 Group ID 未产生死信消息，则不会创建死信队列。
- 一个死信队列包含了对应 Group ID 产生的所游死信消息，不论消息属于哪个 Topic。

## 如何保证高可用？

### NameServer 高可用

NameServer 节点无状态，并且各节点的数据一致，故存在多个 NameServer 节点的情况下，部分 NameServer 不可用也可以保证 MQ 服务正常执行。

### BrokerServer 高可用

一个 Master 可以配置多个 Slave，同时也支持配置多个 Master-Slave 组。

**当其中一个 Master 出现问题时：**

- 由于 Slave 只负责读，当 Master 不可用，它对应的 Slave 仍能保证消息被正常消费。
- 由于配置多组 Master-Slave 组，其他的 Master-Slave 组也会保证消息的正常发送和消费。

**新版本RocketMQ 4.5.0以后，支持 Slave 自动转成 Master**。

### Consumer 高可用

 Consumer 的高可用是依赖于 Master-Slave 配置的，由于 Master 能够支持读写消息，Slave 支持读消息，当 Master 不可用或繁忙时， Consumer 会被自动切换到从 Slave 读取(自动切换，无需配置)。

### Producer高可用

在创建 Topic 的时候，把 Topic 的多个 Message Queue 创建在多个 Broker 组上（相同Broker名称，不同 brokerId的机器组成一个Broker组）.

这样当一个 Broker 组的 Master 不可用后，其他组的 Master 仍然可用，Producer 仍然可以发送消息。

![image-20231105140930804](./assets/image-20231105140930804.png)

### 参考：

- https://www.cnblogs.com/crazymakercircle/p/15426300.html



## RocketMQ 整体工作流程

![image-20231105142614501](./assets/image-20231105142614501.png)

集群工作流程：

- 启动 NameServer，NameServer 起来后监听端口，等待 Broker、Producer、Consumer连上来，相当于一个路由控制中心。
- Broker 启动，跟所有的NameServer保持长连接，定时发送心跳包。心跳包中包含当前 Broker 信息( IP +端口等)以及存储所有 Topic 信息。注册成功后，NameServer 集群中就有 Topic 跟 Broker 的映射关系。
- 收发消息前，先创建 Topic，创建 Topic 时需要指定该 Topic 要存储在哪些 Broker 上，也可以在发送消息时自动创建 Topic。
- Producer 发送消息，启动时先跟 NameServer 集群中的其中一台建立长连接，并从 NameServer 中获取当前发送的 Topic 存在哪些 Broker 上，轮询从队列列表中选择一个队列，然后与队列所在的 Broker 建立长连接从而向 Broker 发消息。
- Consumer 跟 Producer 类似，跟其中一台 NameServer 建立长连接，获取当前订阅 Topic 存在哪些 Broker 上，然后直接跟 Broker 建立连接通道，开始消费消息。

## RocketMQ为什么不使用Zookeeper作为注册中心？

可能有以下几点原因：

- 根据 CAP 理论，Zk 满足的是 CP，并不能保证服务的可用性。
- Zk 存放数据的处理逻辑太复杂（为了保证数据一致性），这点对于一个注册中心来说没必要。
- 消息发送弱依赖于注册中心，仅在第一次发送消息从 NameServer 获取 Broker 地址后就缓存在本地，如果 NameServer 集群不可用，短时间内也不影响消费发送和消费。

## RocketMQ 如何对文件进行读写？

使用**零拷贝技术**：RocketMQ 主要通过 Java 的 MappedByteBuffer 对文件进行读写操作，利用了NIO中的FileChannel模型将磁盘上的物理文件直接映射到用户态的内存地址中。

## RocketMQ 的负载均衡

### 生产者负载均衡

Producer 端在发送消息的时候，默认方式下`selectOneMessageQueue()`方法会从`messageQueueList`中选择一个队列（MessageQueue）进行发送消息。具这里有一个`sendLatencyFaultEnable`开关变量，如果开启，在随机递增取模的基础上，再过滤掉`not available` 的 Broker 代理。

```java
public MessageQueue selectOneMessageQueue(final String lastBrokerName) {
    // lastBrokerName 是上一次选择的执行发送消息失败的 Broker
    // 第一次发送消息 lastBrokerName 是null，直接自增索引与当前路由表队列个数取模，返回该位置的消息队列
    if (lastBrokerName == null) {
        return selectOneMessageQueue();
    } else {
        // 上一次选择的执行发送消息的 Broker 失败
        for (int i = 0; i < this.messageQueueList.size(); i++) {
            // 这里自增是为了排除掉失败的 Broker 对应的队列
            int index = this.sendWhichQueue.incrementAndGet();
            int pos = Math.abs(index) % this.messageQueueList.size();
            if (pos < 0)
                pos = 0;
            MessageQueue mq = this.messageQueueList.get(pos);
            // 假如找到一个队列的 Broker 不是上一次失败的，则返回该队列
            if (!mq.getBrokerName().equals(lastBrokerName)) {
                return mq;
            }
        }
        return selectOneMessageQueue();
    }
}

public MessageQueue selectOneMessageQueue() {
    int index = this.sendWhichQueue.incrementAndGet();
    int pos = Math.abs(index) % this.messageQueueList.size();
    if (pos < 0)
        pos = 0;
    return this.messageQueueList.get(pos);
}
```

### 消费者负载均衡

根据消费者类型的不同，消费者负载均衡策略分为以下两种模式：

- 消息粒度负载均衡：PushConsumer和SimpleConsumer默认负载策略。
- 队列粒度负载均衡：PullConsumer默认负载策略。

#### 消息粒度负载均衡

**使用范围**

对于 PushConsumer 和 SimpleConsumer 类型的消费者，默认且仅使用消息粒度负载均衡策略。

**策略原理**

消息粒度负载均衡策略中，同一消费者分组内的多个消费者将按照消息粒度平均分摊主题中的所有消息，即同一个队列中的消息，可被平均分配给多个消费者共同消费。

![image-20231105191920204](./assets/image-20231105191920204.png)

如上图所示，消费者分组 Group A 中有三个消费者 A1、A2 和 A3，这三个消费者将共同消费主题中同一队列 Queue1 中的多条消息。

**注意**： 消息粒度负载均衡策略**保证同一个队列的消息可以被多个消费者共同处理**，但是该策略使用的消息分配算法结果是随机的，并不能指定消息被哪一个特定的消费者处理。

消息粒度的负载均衡机制，是基于内部的单条消息确认语义实现的。消费者获取某条消息后，服务端会将该消息加锁，保证这条消息对其他消费者不可见，直到该消息消费成功或消费超时。因此，即使多个消费者同时消费同一队列的消息，服务端也可保证消息不会被多个消费者重复消费。

**顺序消息负载机制**

在顺序消息中，消息的顺序性指的是同一消息组内的多个消息之间的先后顺序。因此，顺序消息场景下，消息粒度负载均衡策略还需要保证同一消息组内的消息，按照服务端存储的先后顺序进行消费。不同消费者处理同一个消息组内的消息时，会严格按照先后顺序锁定消息状态，确保同一消息组的消息串行消费。

![image-20231105192138636](./assets/image-20231105192138636.png)

如上图所述，队列 Queue1 中有4条顺序消息，这4条消息属于同一消息组 G1，存储顺序由 M1 到 M4。在消费过程中，前面的消息 M1、M2 被消费者 Consumer A1 处理时，只要消费状态没有提交，消费者 A2 是无法并行消费后续的 M3、M4 消息的，必须等前面的消息提交消费状态后才能消费后面的消息。

**策略特点**

相对于队列粒度负载均衡策略，消息粒度负载均衡策略有以下特点：

- **消费分摊更均衡**：对于传统队列级的负载均衡策略，如果队列数量和消费者数量不均衡，则可能会出现部分消费者空闲，或部分消费者处理过多消息的情况。消息粒度负载均衡策略无需关注消费者和队列的相对数量，能够更均匀地分摊消息。
- **对非对等消费者更友好**：在线上生产环境中，由于网络机房分区延迟、消费者物理资源规格不一致等原因，消费者的处理能力可能会不一致，如果按照队列分配消息，则可能出现部分消费者消息堆积、部分消费者空闲的情况。消息粒度负载均衡策略按需分配，消费者处理任务更均衡。
- **队列分配运维更方便**：传统基于绑定队列的负载均衡策略必须保证队列数量大于等于消费者数量，以免产生部分消费者获取不到队列出现空转的情况，而消息粒度负载均衡策略则无需关注队列数。

#### 队列粒度负载均衡

**使用范围**

对于历史版本（服务端4.x/3.x版本）的消费者，包括 PullConsumer、DefaultPushConsumer、DefaultPullConsumer、LitePullConsumer 等，默认且仅能使用队列粒度负载均衡策略。

**策略原理**

队列粒度负载均衡策略中，同一消费者分组内的多个消费者将按照队列粒度消费消息，即**每个队列仅被一个消费者消费**。

![image-20231105192403406](./assets/image-20231105192403406.png)

如上图所示，主题中的三个队列 Queue1、Queue2、Queue3 被分配给消费者分组中的两个消费者，每个队列只能分配给一个消费者消费，该示例中由于队列数大于消费者数，因此，消费者 A2 被分配了两个队列。若队列数小于消费者数量，可能会出现部分消费者无绑定队列的情况。

队列粒度的负载均衡，基于队列数量、消费者数量等运行数据进行统一的算法分配，将每个队列绑定到特定的消费者，然后每个消费者按照取消息 > 提交消费位点 > 持久化消费位点的消费语义处理消息，取消息过程不提交消费状态，因此，为了避免消息被多个消费者重复消费，每个队列仅支持被一个消费者消费。

**策略特点**

相对于消息粒度负载均衡策略，队列粒度负载均衡策略分配粒度较大，不够灵活。但该策略在**流式处理场景**下有天然优势，能够保证同一队列的消息被相同的消费者处理，对于批量处理、聚合处理更友好。

**适用场景**

队列粒度负载均衡策略适用于流式计算、数据聚合等需要明确对消息进行聚合、批处理的场景。

### 参考

- https://rocketmq.apache.org/zh/docs/featureBehavior/08consumerloadbalance#section-n9m-6xy-y77

## RocketMQ消息长轮询

Consumer 发送拉取请求到 Broker 端，如果 Broker 有数据则返回，Consumer 端再次拉取。如果 Broker 端没有数据，不立即返回，而是等待一段时间（默认5s）。

- 如果在等待的这段时间，有要拉取的消息，则将消息返回，Consumer 端再次拉取。
- 如果等待超时，也会直接返回，不会将这个请求一直 hold 住，Consumer 端再次拉取。

>  PullMessageProcessor#processRequest

```java
case ResponseCode.PULL_NOT_FOUND:
// 没有拉取到消息时，通过长轮询方式拉取消息
if (brokerAllowSuspend && hasSuspendFlag) {
    long pollingTimeMills = suspendTimeoutMillisLong;
    if (!this.brokerController.getBrokerConfig().isLongPollingEnable()) {
        pollingTimeMills = this.brokerController.getBrokerConfig().getShortPollingTimeMills();
    }

    String topic = requestHeader.getTopic();
    long offset = requestHeader.getQueueOffset();
    int queueId = requestHeader.getQueueId();
    PullRequest pullRequest = new PullRequest(request, channel, pollingTimeMills,
                                              this.brokerController.getMessageStore().now(), offset, subscriptionData, messageFilter);
    this.brokerController.getPullRequestHoldService().suspendPullRequest(topic, queueId, pullRequest);
    response = null;
    break;
}
```

`PullRequestHoldService`会不断查看`pullRequestTable`中的请求是否需要结束挂起。

当开启长轮询的时候，先等待5s，然后再去看是否有新消息：

> PullRequestHoldService#run

```java
public void run() {
    log.info("{} service started", this.getServiceName());
    while (!this.isStopped()) {
        try {
            // 开启长轮询，等待5s再尝试拉取
            if (this.brokerController.getBrokerConfig().isLongPollingEnable()) {
                this.waitForRunning(5 * 1000);
            } else {
                // 不开启长轮询，等待1s再尝试拉取
                this.waitForRunning(this.brokerController.getBrokerConfig().getShortPollingTimeMills());
            }

            long beginLockTimestamp = this.systemClock.now();
            // 检查是否有消息
            this.checkHoldRequest();
            long costTime = this.systemClock.now() - beginLockTimestamp;
            if (costTime > 5 * 1000) {
                log.info("[NOTIFYME] check hold request cost {} ms.", costTime);
            }
        } catch (Throwable e) {
            log.warn(this.getServiceName() + " service has exception. ", e);
        }
    }

    log.info("{} service end", this.getServiceName());
}
```

