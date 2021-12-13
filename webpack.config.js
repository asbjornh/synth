const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ESBuildMinifyPlugin } = require("esbuild-loader");

const publicPath = "/";

module.exports = function (_, { mode }) {
  const isProduction = mode === "production";

  return {
    mode,
    devtool: isProduction ? "source-map" : "cheap-module-source-map",
    entry: "./client/index.tsx",
    stats: "minimal",
    output: {
      path: path.resolve(__dirname, "./dist"),
      filename: "static/js/[name].[contenthash:8].js",
      publicPath,
      globalObject: "this",
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new ESBuildMinifyPlugin({
          target: "es2015",
          css: true,
        }),
      ],
    },
    resolve: {
      extensions: [".js", ".ts", ".tsx"],
    },
    module: {
      rules: [
        {
          test: [/\.(png|svg|woff2?)$/],
          loader: "file-loader",
          options: {
            name: "static/media/[name].[hash:8].[ext]",
          },
        },
        {
          test: /\.(ts|tsx)$/,
          use: [
            {
              loader: "esbuild-loader",
              options: {
                loader: "tsx",
                target: "es2015",
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          use: [
            { loader: MiniCssExtractPlugin.loader },
            {
              loader: require.resolve("css-loader"),
              options: { importLoaders: 3, sourceMap: true },
            },
            {
              loader: require.resolve("sass-loader"),
              options: { sourceMap: true },
            },
          ],
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, "client/index.html"),
      }),
      new MiniCssExtractPlugin({
        filename: "static/css/[name].[contenthash:8].css",
        chunkFilename: "static/css/[name].[contenthash:8].chunk.css",
      }),
    ],
  };
};
