import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/": [
    "",
    {
      text: "Java",
      icon: "mug-saucer",
      prefix: "java/",
      children: "structure",
    },
    {
      text: "中间件",
      icon: "book",
      prefix: "middleware/",
      children: "structure",
    },
  ],
});
