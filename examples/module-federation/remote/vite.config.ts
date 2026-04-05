import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig(() => {
  return {
    base: "http://localhost:3000",
    server: {
      port: 3000,
      origin: "http://localhost:3000",
    },
    preview: {
      port: 3000,
    },
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
  };
});
