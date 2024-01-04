import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "Java",
    link: "/java/",
  },
  {
    text: "中间件",
    children: [
      {
        text: "MySQL",
        link: "/mysql/",
      },
      {
        text: "Redis",
        link: "/redis/",
      },
      {
        text: "Sentinel",
        link: "/sentinel/",
      },
    ],
  },
  {
    text: "Spring",
    link: "/spring/",
  },
  {
    text: "RocketMQ",
    link: "/rocketmq/",
  },
  {
    text: "Dubbo",
    link: "/dubbo/",
  },
  {
    text: "算法笔记",
    link: "/algorithm/",
  },
  {
    text: "随笔",
    children: [
      {
        text: "分布式",
        link: "/distributed/",
      },
    ],
  },
  {
    text: "分类",
    link: "/category/",
  },
  {
    text: "标签",
    link: "/tag/",
  },
]);
