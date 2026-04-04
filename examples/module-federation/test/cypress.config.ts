import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    supportFile: false,
    allowCypressEnv: false,
    video: false,
    screenshotOnRunFailure: true,
  },
});
