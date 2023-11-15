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
        icon: "pen-to-square",
        link: "/mysql/",
      },
    ],
  },
  {
    text: "随笔",
    icon: "pen-to-square",
    children: [
      {
        text: "算法笔记",
        icon: "pen-to-square",
        link: "/algorithm/",
      },
      {
        text: "分布式",
        icon: "pen-to-square",
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
