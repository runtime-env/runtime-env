import { existsSync, readFileSync } from "fs";
import { resolve } from "path";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [
    {
      name: "runtime-env",
      transformIndexHtml: {
        order: "pre",
        handler: async (html, context) => {
          if (context.server) {
            const interpolatedIndexHtmlPath = resolve(
              __dirname,
              "node_modules",
              ".cache",
              "runtime-env",
              "index.html",
            );
            while (existsSync(interpolatedIndexHtmlPath) === false) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
            return readFileSync(interpolatedIndexHtmlPath, "utf8");
          } else {
            return html;
          }
        },
      },
    },
  ],
  test: {
    setupFiles: ["./public/runtime-env.js"],
  },
});
