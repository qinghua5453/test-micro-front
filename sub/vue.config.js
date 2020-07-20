const path = require("path");
const { name } = require('./package');
const port = 7104;

function resolve (target) {
  path.resolve(__dirname,  target)
}

module.exports = {
  devServer: {
    port,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
   configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
    },
   },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
};
