const HtmlWebpackPlugin = require("html-webpack-plugin");
const { GenerateSW } = require("workbox-webpack-plugin");

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: "public/index.html",
    }),

    new GenerateSW({
      additionalManifestEntries: [
        {
          url: "/runtime-env.js",
          // replace placeholder at start up, see start.sh for more detail
          revision: "placeholder",
        },
      ],
      clientsClaim: true,
      skipWaiting: true,
    }),
  ],
};
