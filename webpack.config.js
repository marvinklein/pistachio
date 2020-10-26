const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = (env, argv) => {
  const mode = argv.mode?.toLowerCase() ?? "development";
  const isDevMode = mode === "development";
  return {
    mode,
    entry: {
      index: ["./src/index.js", "./src/index.scss"],
    },
    output: {
      path: path.join(__dirname, "dist"),
      filename: "[name].js",
    },
    devServer: {
      historyApiFallback: {
        rewrites: [
          { from: /\/(docs)/, to: ({ match }) => `/${match[1]}.html` },
        ],
      },
      host: "0.0.0.0",
      port: 8888,
    },
    module: {
      rules: [
        { test: /\.pug$/, use: "pug-loader" },
        {
          test: /\.js?$/,
          exclude: /node_modules/,
          use: [{ loader: require.resolve("babel-loader") }],
        },
        {
          test: /\.s[ac]ss$/,
          use: [
            { loader: MiniCssExtractPlugin.loader, options: { hmr: true } },
            "css-loader",
            "sass-loader",
          ],
        },
      ],
    },
    plugins: [
      !isDevMode && new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: "[name].css",
      }),
      new HtmlWebpackPlugin({
        filename: "docs.html",
        template: "./src/docs.pug",
        inject: false,
      }),
      new HtmlWebpackPlugin({
        filename: "index.html",
        template: "./src/index.pug",
        inject: false,
      }),
      new CopyPlugin({
        patterns: [{ from: "favicon/*", context: "src" }],
      }),
    ].filter(Boolean),
    stats: "minimal",
  };
};
