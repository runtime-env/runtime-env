import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig(({ isPreview }) => {
  const remoteOrigin = isPreview
    ? "http://localhost:4174"
    : "http://localhost:5174";

  return {
    base: remoteOrigin,
    server: {
      port: 5174,
      origin: "http://localhost:5174",
    },
    preview: {
      port: 4174,
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
