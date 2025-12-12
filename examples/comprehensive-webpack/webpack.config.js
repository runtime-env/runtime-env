const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const fs = require("fs");

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
      new HtmlWebpackPlugin(
        isProduction
          ? {
              templateContent: fs.readFileSync("index.html", "utf8"),
              inject: "body",
            }
          : {
              template: "node_modules/.cache/runtime-env/index.html",
              inject: "body",
            },
      ),
    ],
    devServer: {
      static: [
        {
          directory: path.join(__dirname, "public"),
        },
      ],
      hot: true,
      port: 8080,
      watchFiles: ["node_modules/.cache/runtime-env/index.html", "index.html"],
    },
  };
};
