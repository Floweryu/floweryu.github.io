import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/",

  lang: "zh-CN",
  title: "Floweryu",
  description: "A blog demo for vuepress-theme-hope",

  theme,

  markdown: {
    headers: {
      level: [2, 3, 4, 5, 6]
    }
  }
});
