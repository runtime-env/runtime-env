const HtmlWebpackPlugin = require("html-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");
const runtimeEnvPlugin = require("@runtime-env/unplugin/webpack");
const runtimeEnv = runtimeEnvPlugin.default || runtimeEnvPlugin;
const path = require("path");

module.exports = (env, argv) => {
  const isProduction = argv.mode === "production";

  return {
    entry: {
      index: "./src/index.ts",
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: "ts-loader",
          exclude: /node_modules/,
        },
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".js"],
    },
    output: {
      filename: "[name].bundle.js",
      path: path.resolve(__dirname, "dist"),
      clean: true,
    },
    plugins: [
      runtimeEnv({
        ts: { outputFile: "src/runtime-env.d.ts" },
        js: { envFile: [".env"] },
        interpolate: { envFile: [".env"] },
      }),
      new HtmlWebpackPlugin({
        template: "index.html",
        inject: "body",
      }),
      isProduction &&
        new GenerateSW({
          additionalManifestEntries: [
            {
              url: "runtime-env.js",
              revision: "placeholder",
            },
          ],
          clientsClaim: true,
          skipWaiting: true,
        }),
    ],
    devServer: {
      static: [
        {
          directory: path.join(__dirname, "public"),
        },
      ],
      hot: true,
      port: 5173,
    },
  };
};
