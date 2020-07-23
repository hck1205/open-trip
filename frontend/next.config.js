const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withCSS = require("@zeit/next-css");
const webpack = require("webpack");
const CompressionPlugin = require("compression-webpack-plugin");

module.exports = withBundleAnalyzer(
  withCSS({
    distDir: ".next",
    webpack(config) {
      const isProduction = process.env.NODE_ENV === "production";

      const plugins = [
        ...config.plugins,
        new webpack.ContextReplacementPlugin(/moment[/\\]locale$/, /^\.\/ko$/),
      ];

      if (isProduction) {
        plugins.push(new CompressionPlugin()); //main.js.gz
      }

      return {
        ...config,
        mode: isProduction ? "production" : "development",
        devtool: isProduction ? "hidden-srouce-map" : "eval",
        plugins,
      };
    },
  })
);
