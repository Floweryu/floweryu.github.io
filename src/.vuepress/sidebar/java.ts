import { arraySidebar } from "vuepress-theme-hope";

export const java = arraySidebar([
  {
    text: "JDK基础",
    icon: "fa-solid fa-sliders",
    link: "basic/",
    prefix: "basic/",
    children: "structure",
  },
  {
    text: "多线程",
    icon: "fa-solid fa-sliders",
    link: "thread/",
    prefix: "thread/",
    children: "structure",
  },
  {
    text: "JVM",
    icon: "fa-solid fa-sliders",
    link: "jvm/",
    prefix: "jvm/",
    children: "structure",
  },
]);