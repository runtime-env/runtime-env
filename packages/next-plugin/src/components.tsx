import Script from "next/script.js";
import { globalVariableName, getFilteredEnv } from "./utils.js";

declare global {
  var __RUNTIME_ENV_ERROR__: string | null | undefined;
}

export function RuntimeEnvScript() {
  const error = globalThis.__RUNTIME_ENV_ERROR__;
  if (error && process.env.NODE_ENV === "development") {
    throw new Error(`[@runtime-env/next-plugin] ${error}`);
  }

  const rootDir = process.cwd();
  const env = getFilteredEnv(rootDir);
  const scriptContent = `globalThis.${globalVariableName} = ${JSON.stringify(env)};`;

  return (
    <Script
      id="runtime-env-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  );
}
