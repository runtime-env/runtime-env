const path = require("path");

module.exports = {
  entry: "./src/index.ts",
  target: "node",
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [{ loader: "ts-loader" }],
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
  output: {
    filename: "runtime-env.js",
    path: path.resolve(__dirname, "bin"),
  },
};
