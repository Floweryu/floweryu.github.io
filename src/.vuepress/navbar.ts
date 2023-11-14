import { navbar } from "vuepress-theme-hope";

export default navbar([
  "/",
  "/java/",
  {
    text: "中间件",
    icon: "book",
    prefix: "/middleware/",
    children: [
      {
        text: "MySQL",
        icon: "pen-to-square",
        link: "mysql/",
      },
    ],
  },
  {
    text: "随笔",
    icon: "pen-to-square",
    prefix: "/posts/",
    children: [
      {
        text: "算法笔记",
        icon: "pen-to-square",
        link: "algorithm/",
      },
      {
        text: "分布式",
        icon: "pen-to-square",
        link: "distributed/",
      },
      { text: "Cherry", icon: "pen-to-square", link: "cherry" },
      { text: "Dragon Fruit", icon: "pen-to-square", link: "dragonfruit" },
    ],
  },
]);
