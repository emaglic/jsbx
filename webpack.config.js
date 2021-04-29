const path = require("path");
//const webpack = require('webpack');
//const nodeExternals = require('webpack-node-externals');
//const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
require("regenerator-runtime");
require("@babel/polyfill");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const HTMLWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");

module.exports = (env) => {
  const WEBPACK_WATCH = env.WEBPACK_WATCH == "true" ? true : false;
  const MINIMIZE = env.NODE_ENV == "production" ? true : false;
  return {
    watch: WEBPACK_WATCH,
    devtool: "eval-source-map",
    entry: {
      index: ["@babel/polyfill", "./src/js/pages/index.js"],
    },
    optimization: {
      minimize: false,
      minimizer: [
        new UglifyJsPlugin({
          test: /\.js(\?.*)?$/i,
          sourceMap: true,
        }),
      ],
    },
    output: {
      path: path.join(__dirname, "public"),
      //publicPath: '/js',
      filename: "js/[name].js",
    },
    resolve: {
      alias: {
        images: path.resolve(__dirname, "src/images"),
        public: path.resolve(__dirname, "src/public"),
        root: path.resolve(__dirname, "./"),
        src: path.resolve(__dirname, "./src"),
        js: path.resolve(__dirname, "./src/js"),
        scss: path.resolve(__dirname, "./src/scss"),
      },
    },
    plugins: [
      new CleanWebpackPlugin({
        verbose: false,
        cleanStaleWebpackAssets: false,
      }),
      new HTMLWebpackPlugin({
        template: "./src/html/index.html",
        filename: "index.html",
        chunks: ["index"],
      }),
      new MiniCssExtractPlugin({
        // Options similar to the same options in webpackOptions.output
        // both options are optional
        filename: "css/[name].min.css",
        //chunkFilename: '[id].css',
        publicPath: "/css",
      }),
      new CopyPlugin({
        patterns: [
          { from: "./src/images", to: "images" },
          { from: "./src/fonts", to: "fonts" },
        ],
      }),
    ],
    module: {
      rules: [
        {
          // Transpiles ES6-8 into ES5
          test: /\.js$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ["@babel/preset-env"],
            },
          },
        },
        {
          test: /\.(sa|sc|c)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: "public/css",
                sourceMap: true,
              },
            },
            {
              loader: "css-loader",
              options: { sourceMap: true },
            },
            {
              loader: "sass-loader",
              options: { sourceMap: true },
            },
          ],
        },
        {
          test: /\.(svg|jpg|png|gif)$/,
          use: [
            {
              loader: "file-loader",
              options: {
                publicPath: "../images",
                //include: path.join(__dirname, 'src'),
                outputPath: "images",
                name: "[contenthash].[ext]",
                esModule: false,
              },
            },
          ],
        },
        {
          test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
          use: [
            {
              loader: "file-loader",
              options: {
                publicPath: "../fonts",
                outputPath: "fonts",
                name: "[name].[ext]",
              },
            },
          ],
        },
      ],
    },
  };
};
