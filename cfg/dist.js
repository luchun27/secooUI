'use strict';

let path = require('path');
let webpack = require('webpack');
let layout=require('./layout');
let baseConfig = require('./base');
let defaultSettings = require('./defaults');
// Add needed plugins here
let BowerWebpackPlugin = require('bower-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var HtmlResWebpackPlugin = require("html-res-webpack-plugin");
let config = Object.assign({}, baseConfig, {
  //entry: path.join(__dirname, '../src/index'),
  entry: {
    //testmain: './src/testMain.js',
    index: './src/'+layout.entryJS+'.js'
  },
  cache: false,
  devtool: 'false',
  plugins: [
    new webpack.optimize.DedupePlugin(),
    new ExtractTextPlugin('[name].css'),
    new HtmlResWebpackPlugin({
      filename: "./html/"+layout.entryHtml+".html",
      template: "src/tem/"+layout.entryHtml+".html",
      htmlMinify:{    //压缩HTML文件
        removeComments:true,    //移除HTML中的注释
        collapseWhitespace:true    //删除空白符与换行符
      },
      chunks:{
        'index': {
          inline: {                   // inline or not for index chunk
            js: true,
            css: true
          }
        }
      }
    }),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': '"production"'
    }),
    new BowerWebpackPlugin({
      searchResolveModulesDirectories: false
    }),
    new webpack.optimize.UglifyJsPlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.AggressiveMergingPlugin(),
    new webpack.NoErrorsPlugin()
  ],
  module: defaultSettings.getDefaultModules()
});

// Add needed loaders to the defaults here
config.module.loaders.push({
  test: /\.(js|jsx)$/,
  loader: 'babel',
  include: [].concat(
    config.additionalPaths,
    [ path.join(__dirname, '/../src') ]
  )
});

module.exports = config;
