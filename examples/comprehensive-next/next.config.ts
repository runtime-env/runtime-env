import type { NextConfig } from "next";
import { withRuntimeEnv } from "@runtime-env/next-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
  outputFileTracingRoot: __dirname,
};

export default withRuntimeEnv(nextConfig);
