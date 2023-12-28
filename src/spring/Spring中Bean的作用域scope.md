---
title: Spring中Bean的作用域
category: [Spring]
tag: [后端]
date: 2023-07-30 20:30:00
---

## 五种模式

### Singleton 单例模式

Spring 默认的 scope，表示 Spring 容器只创建一个 bean 的实例，Spring 在创建第一次后会缓存起来，之后不再创建，就是设计模式中的单例模式。

#### 单例 Bean 优势

- 减少了新生成实例的消耗
- 减少jvm垃圾回收
- 可以快速获取到bean

#### 单例 Bean 的劣势

> 在并发环境下线程不安全？

单例 bean 存在线 程问题，主要是因为当多个线程操作同⼀个对象的时候，对这个对象的⾮静态成员变量的写操作会存在线程安全问题。

常⻅的有两种解决办法：

1. 在 Bean 对象中尽量避免定义可变的成员变量（不太现实）。
2. 在类中定义⼀个 ThreadLocal 成员变量，将需要的可变成员变量保存在 ThreadLocal 中（推荐的⼀种⽅式）。

### Prototype

每次请求都会创建⼀个新的 bean 实例。

### Request

每⼀次 HTTP 请求都会产⽣⼀个新的 bean，该 bean 仅在当前 HTTP request 内有效。

### Session

每⼀次 HTTP 请求都会产⽣⼀个新的 bean，该 bean 仅在当前 HTTP session 内有效。

### GlobalSession

同一个全局 Session 共享一个 Bean，只用于基于 Protlet 的 Web 应用，Spring5 中已经不存在了。

## 在创建bean的时候如何指定呢？

### xml 方式

```xml
<bean id="student" class="Student" scope="prototype" />
```

### 注解方式

```java
@Component
@Scope("prototype")
public class Student{

}
```

