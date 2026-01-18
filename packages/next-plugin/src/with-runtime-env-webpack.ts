import { robustAccessPattern } from "./utils.js";

export function withRuntimeEnvWebpack(nextConfig: any) {
  const originalWebpack = nextConfig.webpack;

  nextConfig.webpack = (config: any, options: any) => {
    const { webpack } = options;

    config.plugins.push(
      new webpack.DefinePlugin({
        runtimeEnv: robustAccessPattern,
      }),
    );

    if (typeof originalWebpack === "function") {
      return originalWebpack(config, options);
    }
    return config;
  };
}
