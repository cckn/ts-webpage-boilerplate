const path = require("path");
const webpack = require("webpack");
const childProcess = require("child_process");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const FaviconsWebpackPlugin = require("favicons-webpack-plugin");

const env = process.env.NODE_ENV;

const removeNewLine = (buffer) => {
  return buffer.toString().replace("\n", "");
};

module.exports = {
  mode: env,
  entry: {
    main: "./src/app.ts",
  },

  output: {
    path: path.resolve("./dist"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: "url-loader",
        options: {
          publicPath: "/dist/",
          name: "[name].[ext]?[hash]",
          limit: 20000, //2kb
        },
      },
      { test: /\.ts$/, use: "awesome-typescript-loader" },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader",
        exclude: /node_modules/,
      },
      { enforce: "pre", test: /\.ts$/, loader: "tslint-loader" },
    ],
  },

  plugins: [
    new webpack.BannerPlugin({
      banner:
        env === "development"
          ? `
            Build Date :: ${new Date().toLocaleString()}
            Commit Version :: ${removeNewLine(
              childProcess.execSync("git rev-parse --short HEAD")
            )}
            Auth.name :: ${removeNewLine(
              childProcess.execSync("git config user.name")
            )}
            Auth.email :: ${removeNewLine(
              childProcess.execSync("git config user.email")
            )}
            `
          : `
            Build Date :: ${new Date().toLocaleString()}
            `,
    }),
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      templateParameters: {
        env: env === "development" ? "(개발용)" : "",
      },
      minify:
        env === "production"
          ? { collapseWhitespace: true, removeComments: true }
          : false,
    }),
    // new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({ filename: "[name].css" }),
    ...(env === "development" ? [] : []),
  ],

  resolve: {
    extensions: [".ts", ".js", ".json"],
  },
};
