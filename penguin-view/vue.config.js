const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const CompressionWebpackPlugin = require("compression-webpack-plugin");

let plugins = [];
if (process.env.NODE_ENV === "production") {
  plugins = [
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: true,
          drop_debugger: true
        },
        output: {
          comments: false // 去掉注释内容
        }
      },
      sourceMap: false,
      parallel: true
    }),
    new CompressionWebpackPlugin({
      filename: "[path].gz[query]",
      algorithm: "gzip",
      test: /\.(js|css|json|txt|html|ico|svg)(\?.*)?$/i,
      threshold: 10240,
      minRatio: 0.8
    })
  ];
}

module.exports = {
  runtimeCompiler: true, //是否使用包含运行时编译器的 Vue 构建版本
  baseUrl: "/",
  outputDir: "dist",
  productionSourceMap: false, //不在production环境使用SourceMap
  css: {
    extract: true,
    loaderOptions: {
      css: {
        localIdentName: "[name]-[hash]",
        camelCase: "only"
      }
    }
  },
  lintOnSave: process.env.NODE_ENV !== "production", // eslint-loader 是否在保存的时候检查
  configureWebpack: config => {
    //入口文件
    config.entry = {
      app: ["babel-polyfill", "./src/main.js"],
      axios: ["axios"]
    };
    config.externals = {
      // 这里需要将vue和vue-router公开出去，供全局使用，这里小写的(即冒号左边的)vue和vue-router是我们引入资源时对应的名字，冒号右面的是由库的主人暴露出来的全局方法名
      // AMap: "AMap",
      // vue: "Vue",
      // "vue-router": "VueRouter",
      // vuex: "Vuex",
      // "element-ui": "ELEMENT",
      // "mint-ui": "MINT",
      // moment: "moment",
      echarts: "echarts"
    };
    config.plugins = [...config.plugins, ...plugins];
  },
  //允许对内部的 webpack 配置进行更细粒度的修改。
  chainWebpack: config => {
    config.resolve.alias.set("@", path.join(__dirname, "src"));
    //打包文件带hash
    config.output.filename("[name].[hash].js").end();
  }
};
