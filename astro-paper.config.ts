import { defineAstroPaperConfig } from "./src/types/config";

export default defineAstroPaperConfig({
  site: {
    url: "https://mrjoechen.github.io/",
    title: "Joe's Blog",
    description:
      "Full-Stack Developer powered by AI. Slightly less clueless about Android.",
    author: "Joe Chen",
    profile: "https://github.com/mrjoechen",
    ogImage: "avatar-joe.jpg",
    lang: "en",
    timezone: "Asia/Shanghai",
  },
  features: {
    lightAndDarkMode: true,
    dynamicOgImage: false,
    showArchives: false,
    showBackButton: true,
    editPost: { enabled: false },
    search: "pagefind",
  },
  socials: [
    { name: "github", url: "https://github.com/mrjoechen" },
    { name: "x", url: "https://x.com/chenqiao1104", linkTitle: "Joe on X" },
    {
      name: "xiaohongshu",
      url: "https://www.xiaohongshu.com/user/profile/61c45a09000000001000656f",
      linkTitle: "Joe 的小红书",
    },
    {
      name: "weibo",
      url: "https://weibo.com/u/2208571963",
      linkTitle: "Joe 的微博",
    },
    { name: "mail", url: "mailto:mrjctech@gmail.com" },
    { name: "rss", url: "/rss.xml", linkTitle: "RSS Feed" },
  ],
  shareLinks: [],
});
