import type { NextConfig } from "next";
import { withRuntimeEnv } from "@runtime-env/next-plugin";

const nextConfig: NextConfig = {
  /* config options here */
  output: "standalone",
  reactCompiler: true,
};

export default withRuntimeEnv(nextConfig);
