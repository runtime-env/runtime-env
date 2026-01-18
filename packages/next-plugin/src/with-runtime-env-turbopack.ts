import { getNextVersion, robustAccessPattern } from "./utils.js";

export function withRuntimeEnvTurbopack(nextConfig: any) {
  const version = getNextVersion();

  // If version is detected and is < 15.3.0, skip this configuration
  if (version && !isAtLeast15_3_0(version)) {
    return;
  }
  
  // Next.js 15.3.0+ uses root turbopack config

  if (!nextConfig.turbopack) {
    nextConfig.turbopack = {};
  }

  const rootTurboObj = nextConfig.turbopack;
  if (!rootTurboObj.rules) {
    rootTurboObj.rules = {};
  }

  const extensions = ["*.js", "*.jsx", "*.ts", "*.tsx"];
  for (const ext of extensions) {
    rootTurboObj.rules[ext] = [
      ...(rootTurboObj.rules[ext] || []),
      {
        loader: "string-replace-loader",
        options: {
          search: "(?<!['\"`\\.])\\bruntimeEnv\\b(?!['\"`\\s*:])",
          replace: robustAccessPattern,
          flags: "g",
        },
      },
    ];
  }
}

function isAtLeast15_3_0(version: string): boolean {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)/);
  if (!match) return false;
  const major = parseInt(match[1]);
  const minor = parseInt(match[2]);
  
  if (major > 15) return true;
  if (major === 15 && minor >= 3) return true;
  return false;
}
