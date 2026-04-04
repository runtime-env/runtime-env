import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig(({ command }) => {
  const isDev = command === "serve";
  const remoteManifestPort = isDev ? 5174 : 4174;

  return {
    server: {
      origin: "http://localhost:5173",
    },
    preview: {
      origin: "http://localhost:4173",
    },
    plugins: [
      runtimeEnv(),
      react(),
      federation({
        name: "host",
        remotes: {
          remote: `remote@http://localhost:${remoteManifestPort}/mf-manifest.json`,
        },
      }),
    ],
  };
});
