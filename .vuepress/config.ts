import { defineUserConfig } from "vuepress";
import type { DefaultThemeOptions } from "vuepress";
import recoTheme from "vuepress-theme-reco";

export default defineUserConfig({
  title: "Floweryu",
  description: "Good Good Study, Day Day On!",
  theme: recoTheme({
    style: "@vuepress-reco/style-default",
    logo: "/logo.png",
    author: "Floweryu",
    authorAvatar: "/head.png",
    docsRepo: "https://github.com/Floweryu/floweryu.github.io",
    docsBranch: "main",
    lastUpdatedText: "上次编辑于：",
    // 自动设置分类
    autoSetBlogCategories: true,
    // 自动将分类和标签添加至头部导航条
    autoAddCategoryToNavbar: {
      location: -1, // 默认 0, 位置
      categoryText: "分类", // 默认 categories
      tagText: "标签", // 默认 tags
    },
    // series 为原 sidebar
    series: {
      "/blogs/RocketMQ/": [
        {
          text: "源码解析",
          children: [
            "/blogs/RocketMQ/RocketMQ源码解析——服务发现.md",
            "/blogs/RocketMQ/RocketMQ源码解析——事务消息.md",
            "/blogs/RocketMQ/RocketMQ源码解析——通信模块.md",
            "/blogs/RocketMQ/RocketMQ源码解析——消息存储.md",
          ],
        },
      ],
      "/blogs/Java/": [
        {
          text: "Jvm理解",
          children: [
            "/blogs/Java/JVM参数详解.md",
            "/blogs/Java/JVM垃圾回收器.md",
            "/blogs/Java/JVM垃圾回收基础.md",
          ],
        },
        {
          text: "Java并发体系",
          children: [
            "/blogs/Java/AQS源码理解——ReentrantLock.md"
          ],
        },
      ],
    },
    navbar: [
      { text: "Home", link: "/" },
      {
        text: "Java",
        children: [
          {
            text: "JVM理解",
            link: "/blogs/Java/JVM参数详解.md",
          },
          {
            text: "Java并发体系",
            link: "/blogs/Java/AQS源码理解——ReentrantLock.md",
          },
        ],
      },
      {
        text: "RocketMQ",
        children: [
          {
            text: "源码解析",
            link: "/blogs/RocketMQ/RocketMQ源码解析——服务发现.md",
          },
          { text: "面试", link: "/blogs/RocketMQ/RocketMQ面试题.md" },
        ],
      },
    ],
  }),
  // debug: true,
});
