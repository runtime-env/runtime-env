import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { federation } from "@module-federation/vite";
import runtimeEnv from "@runtime-env/vite-plugin";

export default defineConfig(({ command }) => {
  const remoteManifestPort = command === "serve" ? 5174 : 4174;

  return {
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
    preview: {
      "origin": "http://localhost:4173",
    },
    server: {
      "origin": "http://localhost:5173",
    },
  };
});
