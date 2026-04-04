import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig({
  plugins: [
    runtimeEnv(),
    react(),
    federation({
      name: "remote",
      manifest: true,
      exposes: {
        "./RemoteMessage": "./src/RemoteMessage.tsx",
      },
    }),
  ],
  server: {
    port: 5174,
  },
  preview: {
    port: 4174,
  },
});
