---
title: 深入理解Java序列化
category: [Java]
tag: [后端, Java基础]
date: 2024-01-04 17:20:00
---

## 序列化简介

- **序列化（serialize）**：序列化是将对象转换为字节流。
- **反序列化（deserialize）** ： 反序列化是将字节流转换为对象。
- **序列化用途**：
  - 序列化可以将对象的字节序列持久化——保存在内存、文件、数据库中。
  - 在网络上传送对象的字节序列。

> **对象序列化不会关注类中的静态变量**。

## Java 序列化和反序列化

Java 通过对象输入输出流来实现序列化和反序列化：

- `java.io.ObjectOutputStream` 类的 `writeObject()` 方法可以实现序列化；
- `java.io.ObjectInputStream` 类的 `readObject()` 方法用于实现反序列化。

序列化和反序列化示例：

```java
public class SerializeDemo01 {
    enum Sex {
        MALE,
        FEMALE
    }


    static class Person implements Serializable {
        private static final long serialVersionUID = 1L;
        private String name = null;
        private Integer age = null;
        private Sex sex;

        public Person() { }

        public Person(String name, Integer age, Sex sex) {
            this.name = name;
            this.age = age;
            this.sex = sex;
        }

        @Override
        public String toString() {
            return "Person{" + "name='" + name + '\'' + ", age=" + age + ", sex=" + sex + '}';
        }
    }

    /**
     * 序列化
     */
    private static void serialize(String filename) throws IOException {
        File f = new File(filename); // 定义保存路径
        OutputStream out = new FileOutputStream(f); // 文件输出流
        ObjectOutputStream oos = new ObjectOutputStream(out); // 对象输出流
        oos.writeObject(new Person("Jack", 30, Sex.MALE)); // 保存对象
        oos.close();
        out.close();
    }

    /**
     * 反序列化
     */
    private static void deserialize(String filename) throws IOException, ClassNotFoundException {
        File f = new File(filename); // 定义保存路径
        InputStream in = new FileInputStream(f); // 文件输入流
        ObjectInputStream ois = new ObjectInputStream(in); // 对象输入流
        Object obj = ois.readObject(); // 读取对象
        ois.close();
        in.close();
        System.out.println(obj);
    }

    public static void main(String[] args) throws IOException, ClassNotFoundException {
        final String filename = "d:/text.dat";
        serialize(filename);
        deserialize(filename);
    }
}
// Output:
// Person{name='Jack', age=30, sex=MALE}
```

## Serializable 接口

**被序列化的类必须属于 Enum、Array 和 Serializable 类型其中的任何一种，否则将抛出 `NotSerializableException` 异常**。

这是因为：在序列化操作过程中会对类型进行检查，如果不满足序列化类型要求，就会抛出异常。

### `serialVersionUID`

请注意 `serialVersionUID` 字段，你可以在 Java 世界的无数类中看到这个字段。

> **问题**：`serialVersionUID` 有什么作用，如何使用 `serialVersionUID`？

**`serialVersionUID` 是 Java 为每个序列化类产生的版本标识**。它可以用来保证在反序列时，发送方发送的和接受方接收的是可兼容的对象。如果接收方接收的类的 `serialVersionUID` 与发送方发送的 `serialVersionUID` 不一致，会抛出 `InvalidClassException`。

如果可序列化类没有显式声明 `serialVersionUID`，则序列化运行时将基于该类的各个方面计算该类的默认 `serialVersionUID` 值。尽管这样，还是**建议在每一个序列化的类中显式指定 `serialVersionUID` 的值**。因为不同的 jdk 编译很可能会生成不同的 `serialVersionUID` 默认值，从而导致在反序列化时抛出 `InvalidClassExceptions` 异常。

**`serialVersionUID` 字段必须是 `static final long` 类型**。

1. 有一个可序列化类 Person

```java
public class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private Integer age;
    private String address;
    // 构造方法、get、set 方法略
}
```

2. 开发过程中，对 Person 做了修改，增加了一个字段 email，如下：

```java
public class Person implements Serializable {
    private static final long serialVersionUID = 1L;
    private String name;
    private Integer age;
    private String address;
    private String email;
    // 构造方法、get、set 方法略
}
```

由于这个类和老版本不兼容，我们需要修改版本号：

```java
private static final long serialVersionUID = 2L;
```

再次进行反序列化，则会抛出 `InvalidClassException` 异常。

综上所述，我们大概可以清楚：**`serialVersionUID` 用于控制序列化版本是否兼容**。若我们认为修改的可序列化类是向后兼容的，则不修改 `serialVersionUID`。

### 默认序列化机制

如果仅仅只是让某个类实现 `Serializable` 接口，而没有其它任何处理的话，那么就会使用默认序列化机制。

使用默认机制，在序列化对象时，不仅会序列化当前对象本身，还会对其父类的字段以及该对象引用的其它对象也进行序列化。同样地，这些其它对象引用的另外对象也将被序列化，以此类推。所以，如果一个对象包含的成员变量是容器类对象，而这些容器所含有的元素也是容器类对象，那么这个序列化的过程就会较复杂，开销也较大。

> 🔔 注意：这里的父类和引用对象既然要进行序列化，那么它们当然也要满足序列化要求：**被序列化的类必须属于 Enum、Array 和 Serializable 类型其中的任何一种**。

### `transient`

**当某个字段被声明为 `transient` 后，默认序列化机制就会忽略该字段的内容,该字段的内容在序列化后无法获得访问**。

我们将 SerializeDemo01 示例中的内部类 Person 的 age 字段声明为 `transient`，如下所示：

```java
public class SerializeDemo02 {
    static class Person implements Serializable {
        transient private Integer age = null;
        // 其他内容略
    }
    // 其他内容略
}
// Output:
// name: Jack, age: null, sex: MALE
```

从输出结果可以看出，age 字段没有被序列化。

例如，`hashMap`源码中的`transient int modCount;`

## Externalizable 接口

无论是使用 `transient` 关键字，还是使用 `writeObject()` 和 `readObject()` 方法，其实都是基于 `Serializable` 接口的序列化。

JDK 中提供了另一个序列化接口：`Externalizable`。

**可序列化类实现 `Externalizable` 接口之后，基于 `Serializable` 接口的默认序列化机制就会失效**。同时必须实现``writeExternal、readExternal` 方法。而且必须加上 `public` 无参构造器，因为反序列化时需要反射创建对象。

### Externalizable 接口的替代方法

实现 `Externalizable` 接口可以控制序列化和反序列化的细节。它有一个替代方法：实现 `Serializable` 接口，并添加 `writeObject(ObjectOutputStream out)` 与 `readObject(ObjectInputStream in)` 方法。序列化和反序列化过程中会自动回调这两个方法。

示例如下所示：

```java
public class SerializeDemo03 {
    static class Person implements Serializable {
        transient private Integer age = null;
        // 其他内容略

        private void writeObject(ObjectOutputStream out) throws IOException {
            out.defaultWriteObject();
            out.writeInt(age);
        }

        private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
            in.defaultReadObject();
            age = in.readInt();
        }
        // 其他内容略
    }
    // 其他内容略
}
```

在 `writeObject()` 方法中会先调用 `ObjectOutputStream` 中的 `defaultWriteObject()` 方法，该方法会执行默认的序列化机制，如上节所述，此时会忽略掉 age 字段。然后再调用 `writeInt()` 方法显示地将 age 字段写入到 `ObjectOutputStream` 中。``readObject()`` 的作用则是针对对象的读取，其原理与 `writeObject()` 方法相同。

> 🔔 注意：`writeObject()` 与 `readObject()` 都是 `private` 方法，那么它们是如何被调用的呢？毫无疑问，是使用反射。详情可见 `ObjectOutputStream` 中的 `writeSerialData` 方法，以及 `ObjectInputStream` 中的 `readSerialData` 方法。

## `readResolve()` 方法

使用 Singleton 模式时，应该是期望某个类的实例应该是唯一的，但如果该类是可序列化的，那么情况可能会略有不同。此时对第 2 节使用的 Person 类进行修改，使其实现 Singleton 模式，如下所示：

```java
public class SerializeDemo04 {

    enum Sex {
        MALE, FEMALE
    }

    static class Person implements Serializable {
        private static final long serialVersionUID = 1L;
        private String name = null;
        transient private Integer age = null;
        private Sex sex;
        static final Person instatnce = new Person("Tom", 31, Sex.MALE);

        private Person() {
            System.out.println("call Person()");
        }

        private Person(String name, Integer age, Sex sex) {
            this.name = name;
            this.age = age;
            this.sex = sex;
        }

        public static Person getInstance() {
            return instatnce;
        }

        private void writeObject(ObjectOutputStream out) throws IOException {
            out.defaultWriteObject();
            out.writeInt(age);
        }

        private void readObject(ObjectInputStream in) throws IOException, ClassNotFoundException {
            in.defaultReadObject();
            age = in.readInt();
        }

        public String toString() {
            return "name: " + this.name + ", age: " + this.age + ", sex: " + this.sex;
        }
    }

    /**
     * 序列化
     */
    private static void serialize(String filename) throws IOException {
        File f = new File(filename); // 定义保存路径
        OutputStream out = new FileOutputStream(f); // 文件输出流
        ObjectOutputStream oos = new ObjectOutputStream(out); // 对象输出流
        oos.writeObject(new Person("Tom", 31, Sex.MALE)); // 保存对象
        oos.close();
        out.close();
    }

    /**
     * 反序列化
     */
    private static void deserialize(String filename) throws IOException, ClassNotFoundException {
        File f = new File(filename); // 定义保存路径
        InputStream in = new FileInputStream(f); // 文件输入流
        ObjectInputStream ois = new ObjectInputStream(in); // 对象输入流
        Object obj = ois.readObject(); // 读取对象
        ois.close();
        in.close();
        System.out.println(obj);
        System.out.println(obj == Person.getInstance());
    }

    public static void main(String[] args) throws IOException, ClassNotFoundException {
        final String filename = "test.txt";
        serialize(filename);
        deserialize(filename);
    }
}
// Output:
// name: Tom, age: 31, sex: MALE
// false
```

值得注意的是，从文件中获取的 Person 对象与 Person 类中的单例对象并不相等。**为了能在单例类中仍然保持序列的特性，可以使用 `readResolve()` 方法**。在该方法中直接返回 Person 的单例对象。我们在 SerializeDemo04 示例的基础上添加一个 `readResolve` 方法， 如下所示：

```java
public class SerializeDemo05 {
    // 其他内容略

    static class Person implements Serializable {
        // 添加此方法
        private Object readResolve() {
            return instatnce;
        }
        // 其他内容略
    }

    // 其他内容略
}
// Output:
// name: Tom, age: 31, sex: MALE
// true
```

## Java 序列化问题

Java 的序列化能保证对象状态的持久保存，但是遇到一些对象结构复杂的情况还是难以处理，这里归纳一下：

- 父类是 `Serializable`，所有子类都可以被序列化。
- 子类是 `Serializable` ，父类不是，则子类可以正确序列化，但父类的属性不会被序列化（不报错，数据丢失）。
- 如果序列化的属性是对象，则这个对象也必须是 `Serializable` ，否则报错。
- 反序列化时，如果对象的属性有修改或删减，则修改的部分属性会丢失，但不会报错。
- 反序列化时，如果 `serialVersionUID` 被修改，则反序列化会失败。

## Java 序列化的缺陷

- **无法跨语言**：Java 序列化目前只适用基于 Java 语言实现的框架。
- **容易被攻击**：对象是通过在 `ObjectInputStream` 上调用 `readObject()` 方法进行反序列化的，它可以将类路径上几乎所有实现了 `Serializable` 接口的对象都实例化。这意味着，在反序列化字节流的过程中，该方法可以执行任意类型的代码，这是非常危险的。对于需要长时间进行反序列化的对象，不需要执行任何代码，也可以发起一次攻击。攻击者可以创建循环对象链，然后将序列化后的对象传输到程序中反序列化，这种情况会导致 `hashCode` 方法被调用次数呈次方爆发式增长, 从而引发栈溢出异常。
- **序列化后的流太大**：Java 序列化中使用了 `ObjectOutputStream` 来实现对象转二进制编码，编码后的数组很大，非常影响存储和传输效率。
- **序列化性能太差**：Java 的序列化耗时比较大。序列化的速度也是体现序列化性能的重要指标，如果序列化的速度慢，就会影响网络通信的效率，从而增加系统的响应时间。
- 序列化编程限制:
  - Java 官方的序列化一定**需要实现 `Serializable` 接口**。
  - Java 官方的序列化**需要自定义 `serialVersionUID`**。

## 参考资料

