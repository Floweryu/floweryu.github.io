import { arraySidebar } from "vuepress-theme-hope";

export const java = arraySidebar([
  {
    text: "JDK基础",
    link: "basic/",
    prefix: "basic/",
    children: "structure",
  },
  {
    text: "多线程",
    link: "thread/",
    prefix: "thread/",
    children: "structure",
  },
  {
    text: "JVM",
    link: "jvm/",
    prefix: "jvm/",
    children: "structure",
  },
]);