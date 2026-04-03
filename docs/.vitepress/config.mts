import { defineConfig } from "vitepress";

export default defineConfig({
  title: "runtime-env",
  description:
    "Build once, deploy anywhere runtime configuration for web apps.",
  base: "/runtime-env/",
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "Learn", link: "/learn/" },
      { text: "Guides", link: "/guides/vite/vitest" },
      { text: "Reference", link: "/reference/vite-plugin" },
      { text: "Troubleshooting", link: "/troubleshooting/" },
    ],
    sidebar: {
      "/learn/": [
        {
          text: "Learn",
          items: [
            { text: "Overview", link: "/learn/" },
            { text: "Why runtime-env", link: "/learn/why-runtime-env" },
            { text: "Vite quick start", link: "/learn/vite-quick-start" },
            { text: "CLI quick start", link: "/learn/cli-quick-start" },
            { text: "Mental model", link: "/learn/mental-model" },
          ],
        },
      ],
      "/guides/": [
        {
          text: "Deployment",
          items: [
            {
              text: "Docker startup generation",
              link: "/guides/deployment/docker-startup-generation",
            },
          ],
        },
        {
          text: "Vite",
          items: [{ text: "Vitest", link: "/guides/vite/vitest" }],
        },
      ],
      "/reference/": [
        {
          text: "Reference",
          items: [
            { text: "Vite plugin", link: "/reference/vite-plugin" },
            { text: "CLI", link: "/reference/cli" },
          ],
        },
      ],
      "/troubleshooting/": [
        {
          text: "Troubleshooting",
          items: [{ text: "Common issues", link: "/troubleshooting/" }],
        },
      ],
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/runtime-env/runtime-env" },
    ],
    editLink: {
      pattern:
        "https://github.com/runtime-env/runtime-env/edit/main/docs/:path",
      text: "Edit this page on GitHub",
    },
    search: {
      provider: "local",
    },
  },
  head: [
    ["meta", { property: "og:image", content: "/runtime-env/social-card.svg" }],
  ],
});
