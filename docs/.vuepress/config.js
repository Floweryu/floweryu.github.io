module.exports = {
  title: "Floweryu Blog",
  description: "TypeScript4 最新官方文档翻译",
  themeConfig: {
    nav: [
      { text: "首页", link: "/" },
      {
        text: "冴羽的 JavaScript 博客",
        items: [
          { text: "Github", link: "https://github.com/mqyqingfeng" },
          {
            text: "掘金",
            link: "https://juejin.cn/user/712139234359182/posts",
          },
        ],
      },
    ],
    subSidebar: "auto",
  },
  theme: "reco",
  locales: {
    "/": {
      lang: "zh-CN",
    },
  },
};
