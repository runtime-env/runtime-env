import { defineConfig } from "vitepress";

export default defineConfig({
  title: "runtime-env",
  description:
    "Build once, deploy anywhere with runtime configuration for frontend apps.",
  base: "/runtime-env/",
  lastUpdated: true,
  themeConfig: {
    nav: [
      { text: "Vite", link: "/vite/quickstart" },
      { text: "CLI", link: "/cli/quickstart" },
      { text: "Deployment", link: "/deployment/caching" },
    ],
    sidebar: {
      "/vite/": [
        {
          text: "Vite",
          items: [
            { text: "Quickstart", link: "/vite/quickstart" },
            { text: "Dev", link: "/vite/dev" },
            { text: "Vitest", link: "/vite/vitest" },
            { text: "Build", link: "/vite/build" },
            { text: "Preview", link: "/vite/preview" },
            {
              text: "Builtin env comparison",
              link: "/vite/builtin-env-comparison",
            },
            { text: "Troubleshooting", link: "/vite/troubleshooting" },
          ],
        },
      ],
      "/cli/": [
        {
          text: "CLI",
          items: [
            { text: "Quickstart", link: "/cli/quickstart" },
            { text: "gen-js", link: "/cli/gen-js" },
            { text: "gen-ts", link: "/cli/gen-ts" },
            { text: "interpolate", link: "/cli/interpolate" },
            { text: "Troubleshooting", link: "/cli/troubleshooting" },
          ],
        },
      ],
      "/deployment/": [
        {
          text: "Deployment",
          items: [
            { text: "Caching", link: "/deployment/caching" },
            {
              text: "PWA + Service Worker",
              link: "/deployment/pwa-service-worker",
            },
          ],
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
