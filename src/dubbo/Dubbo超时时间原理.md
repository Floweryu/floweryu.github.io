---
title: Dubbo超时时间原理
category: [Dubbo]
tag: [后端, 中间件]
date: 2023-09-25 16:30:00
---

## 超时设置

服务端：方法控制——>接口控制——>全局控制
消费端：方法控制——>接口控制——>全局控制

**超时设置的优先级**

> 可以这样理解：如果服务端设置了超时，则消费端可以不用设置超时时间，默认会使用服务端超时配置

优先级为：**消费端方法级 > 消费端接口级 > 消费端全局 > 服务端方法级 > 服务端接口级 > 服务端全局**

