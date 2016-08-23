'use strict';

let path = require('path');
let webpack = require('webpack');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');
let layout = require('./layout');
console.log(layout);
// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
//var HtmlWebpackPlugin = require('html-webpack-plugin');
var HtmlResWebpackPlugin = require("html-res-webpack-plugin");
let config = Object.assign({}, baseConfig, {
  //entry: [
  //  'webpack-dev-server/client?http://127.0.0.1:' + defaultSettings.port,
  //  'webpack/hot/only-dev-server',
  //  './src/index'
  //],
  entry:{'index':'./src/'+layout.entryJS},
  cache: true,
  devtool: 'eval-source-map',
  plugins: [
    //new ExtractTextPlugin({filename: "[name].css",
    //disable: false,
    //allChunks: true}),
    //new ExtractTextPlugin("[name].css", {
    //  allChunks: true
    //}),
    new ExtractTextPlugin('[name].css'),
    //new ExtractTextPlugin({
    //  filename: "[name].css?[hash]-[chunkhash]-[contenthash]-[name]",
    //  disable: false,
    //  allChunks: false
    //}),
    //new HtmlWebpackPlugin({
    //  filename:'/index1.html',//生成的html存放路径，相对于 path
    //  inject:true,//允许插件修改哪些内容，包括head与body
    //  hash:true,//为静态资源生成hash值
    //  minify:{    //压缩HTML文件
    //    removeComments:true,    //移除HTML中的注释
    //    collapseWhitespace:false    //删除空白符与换行符
    //  }
    //}),
    new HtmlResWebpackPlugin({
      filename: "index.html",
      template: "src/tem/"+layout.entryHtml+".html",
      chunks:{
        'index': {
          inline: {                   // inline or not for index chunk
            js: true,
            css: true
          }
        }
      }
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    })
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js)$/,
  loader: 'babel-loader',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
