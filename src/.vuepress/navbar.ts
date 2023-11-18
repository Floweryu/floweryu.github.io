import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  {
    text: "Java",
    icon: "mug-saucer",
    link: "/java/",
  },
  {
    text: "中间件",
    icon: "book",
    children: [
      {
        text: "MySQL",
        icon: "fa-solid fa-signature",
        link: "/mysql/",
      },
      {
        text: "Redis",
        icon: "fa-solid fa-signature",
        link: "/redis/",
      },
      {
        text: "Sentinel",
        icon: "fa-solid fa-signature",
        link: "/sentinel/",
      },
    ],
  },
  {
    text: "Spring",
    icon: "fa-solid fa-chart-simple",
    link: "/spring/",
  },
  {
    text: "RocketMQ",
    icon: "fa-solid fa-chart-simple",
    link: "/rocketmq/",
  },
  {
    text: "Dubbo",
    icon: "fa-solid fa-chart-simple",
    link: "/dubbo/",
  },
  {
    text: "算法笔记",
    icon: "fa-solid fa-chart-simple",
    link: "/algorithm/",
  },
  {
    text: "随笔",
    icon: "fa-solid fa-chart-simple",
    children: [
      {
        text: "分布式",
        icon: "fa-solid fa-signature",
        link: "/distributed/",
      },
    ],
  },
  {
    text: "分类",
    icon: "bookmark",
    link: "/category/",
  },
  {
    text: "标签",
    icon: "tag",
    link: "/tag/",
  },
]);
