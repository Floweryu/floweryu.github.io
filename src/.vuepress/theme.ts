import { hopeTheme } from "vuepress-theme-hope";
import navbar from "./navbar.ts";
import sidebar from "./sidebar.ts";

export default hopeTheme({
  hostname: "https://floweryu.top",

  author: {
    name: "Floweryu",
    url: "https://github.com/Floweryu/floweryu.github.io",
    email: "869830837@qq.com",
  },

  iconPrefix: "fas fa-",
  iconAssets: "fontawesome-with-brands",

  logo: "/logo_dark.png",

  repo: "Floweryu/floweryu.github.io",

  docsDir: "src",

  navbar,

  navbarLayout: {
    start: ["Brand"],
    center: ["Links"],
    end: ["Search", "Repo", "Outlook"],
  },

  sidebar,

  footer: "Default footer",
  //pure: true, // 纯净模式
  displayFooter: true,

  contributors: false,

  blog: {
    description: "浮生若梦，为欢几何？",
    intro: "/intro.html",
    medias: {
      GitHub: "https://github.com/Floweryu",
    },
    roundAvatar: true,
  },

  metaLocales: {
    editLink: "Edit this page on GitHub",
  },

  plugins: {
    prismjs: {
      light: "one-light",
      dark: "one-dark",
    },
    blog: {
      excerpt: false,
      excerptLength: 0,
    },
    mdEnhance: {
      align: true,
      attrs: true,
      codetabs: true,
      demo: true,
      figure: true,
      imgLazyload: true,
      imgSize: true,
      include: true,
      mark: true,
      playground: {
        presets: ["ts", "vue"],
      },

      stylize: [
        {
          matcher: "Recommended",
          replacer: ({ tag }) => {
            if (tag === "em")
              return {
                tag: "Badge",
                attrs: { type: "tip" },
                content: "Recommended",
              };
          },
        },
      ],
      sub: true,
      sup: true,
      tabs: true,
      vPre: true,
    },
  },
});
