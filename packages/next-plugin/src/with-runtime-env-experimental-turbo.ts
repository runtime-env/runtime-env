import { getNextVersion, robustAccessPattern } from "./utils.js";

export function withRuntimeEnvExperimentalTurbo(nextConfig: any) {
  const version = getNextVersion();

  // If version is detected and is >= 15.3.0, skip this configuration
  if (version && isAtLeast15_3_0(version)) {
    return;
  }

  // Next.js < 15.3.0 (or unknown version) uses experimental.turbo or experimental.turbopack
  
  if (!nextConfig.experimental) {
    nextConfig.experimental = {};
  }

  const turboKeys = ["turbo", "turbopack"];
  for (const key of turboKeys) {
    if (!nextConfig.experimental[key]) {
      nextConfig.experimental[key] = {};
    }

    const turboObj = nextConfig.experimental[key];

    // 1. Try defines
    turboObj.defines = {
      ...(turboObj.defines || {}),
      runtimeEnv: robustAccessPattern,
    };

    // 2. Try rules with string-replace-loader
    if (!turboObj.rules) {
      turboObj.rules = {};
    }

    const extensions = ["*.js", "*.jsx", "*.ts", "*.tsx"];
    for (const ext of extensions) {
      turboObj.rules[ext] = [
        ...(turboObj.rules[ext] || []),
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
