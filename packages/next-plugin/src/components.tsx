import Script from "next/script.js";
import {
  globalVariableName,
  getFilteredEnv,
  getRuntimeEnvError,
} from "./utils.js";

export function RuntimeEnvScript() {
  const error = getRuntimeEnvError();
  if (error && process.env.NODE_ENV === "development") {
    throw new Error(`[@runtime-env/next-plugin] ${error}`);
  }

  const rootDir = process.cwd();
  const env = getFilteredEnv(rootDir);
  const scriptContent = `window.${globalVariableName} = ${JSON.stringify(env)};`;

  return (
    <Script
      id="runtime-env-script"
      strategy="beforeInteractive"
      dangerouslySetInnerHTML={{ __html: scriptContent }}
    />
  );
}
