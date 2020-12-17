require("babel-polyfill");
const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
// const optimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const assets_dir = process.env.ASSETS_DIR || "maycur";
const html_title = process.env.HTML_TITLE || "每刻打印服务";
const isProd = process.env.NODE_ENV.indexOf("local") === -1;
const cdn = process.env.CDN || "";
// const cdn = ''

function resolve(dir) {
  return path.join(__dirname, dir);
}

let config = {
  mode: "development",
  entry: {
    main: path.resolve(__dirname, "./src/index.js"),
  },
  target: ["web", "es5"],
  output: {
    path: path.join(__dirname, "dist"),
    filename: "bundle.[chunkhash].js",
    publicPath: cdn,
  },
  plugins: [
    new webpack.DefinePlugin({
      NODE_ENV: JSON.stringify(process.env.NODE_ENV),
      "process.env.NODE_ENV": JSON.stringify(isProd ? "production" : "local"),
    }),
    new MiniCssExtractPlugin({
      filename: !isProd ? "[name].css" : `[name].[hash].css`,
      chunkFilename: !isProd ? "[id].css" : `[id].[hash].css`,
    }),
    new HtmlWebpackPlugin({
      // favicon: "./src/assets/" + assets_dir + "/favicon.ico",
      template: "./index.html",
      hash: true,
      inject: true,
      title: `${html_title}`,
    }),
  ],

  module: {
    rules: [
      {
        test: /\.(scss|css)$/,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(woff(2)?|eot|ttf|otf|svg|)$/,
        type: "asset/inline",
      },
      {
        test: /\.js$/,
        include: [/node_modules/, /src/],
        use: ["babel-loader"],
      },
      {
        test: /\.ts$/,
        include: [/node_modules/, /src/],
        use: [{ loader: "babel-loader" }, { loader: "ts-loader" }],
      },
    ],
  },
  resolve: {
    modules: ["node_modules", path.join(__dirname, "./node_modules")],
    extensions: [".js"],
    alias: {
      appEnv: resolve("src/env/" + process.env.NODE_ENV + ".js"),
      "mk-assets-scss": resolve("src/assets/" + assets_dir + "/index.scss"),
      "@": resolve("src"),
    },
  },
};

//生产环境下独有的插件
if (isProd) {
  config.mode = "production";
  // config.plugins.push(new optimizeCssAssetsPlugin({}));

  config.optimization = {
    minimizer: [
      new TerserPlugin({
        test: /\.js(\?.*)?$/i,
        parallel: true,
        terserOptions: {
          ecma: undefined,
          parse: {},
          compress: {
            drop_console: true,
          },
          mangle: true, // Note `mangle.properties` is `false` by default.
          module: false,
          output: null,
          toplevel: false,
          nameCache: null,
          ie8: false,
          keep_classnames: undefined,
          keep_fnames: false,
        },
      }),
    ],
  };
} else {
  config.devServer = {
    historyApiFallback: true,
    contentBase: path.resolve(__dirname, "./dist"),
    open: true,
    compress: true,
    hot: true,
    port: 8005,
    host: "0.0.0.0",
  };
  config.devtool = "inline-source-map";
  config.mode = "development";
  config.plugins.push(new webpack.HotModuleReplacementPlugin());
}

module.exports = config;
