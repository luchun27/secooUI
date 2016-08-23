'use strict';
let ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require('path');
const srcPath = path.join(__dirname, '/../src');
const dfltPort = 8000;
function getDefaultModules() {
  return {
    preLoaders: [{
        test: /\.(js|jsx)$/,
        include: srcPath,
        loader: 'eslint-loader'
      }],
    loaders: [
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader!postcss-loader!ExtractTextPlugin.extract("style", "css")'
      },
      {
        test: /\.sass/,
        loader: 'style-loader!css-loader!postcss-loader!autoprefixer-loader?{browsers:["last 2 version", ">1%"]}'
      },
      {
        test: /\.scss/,
        //loader: ExtractTextPlugin.extract("style-loader", "css-loader!sass-loader")
        //loader: 'style-loader!css-loader!postcss-loader!sass-loader?outputStyle=expanded'
        loader: ExtractTextPlugin.extract('style-loader', 'css-loader!postcss-loader!autoprefixer-loader!sass-loader?{browsers:["last 2 version",">1%"]}')
        //loader: ExtractTextPlugin.extract('style','style-loader!css-loader!postcss-loader!sass-loader')
      },
      //
      //{ test: /\.scss$/i, loader: ExtractTextPlugin.extract(['css','sass']) },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!postcss-loader!less-loader'
      },
      {
        test: /\.styl/,
        loader: 'style-loader!css-loader!postcss-loader!stylus-loader'
      },
      {
        test: /\.(png|jpg|gif|woff|woff2)$/,
        loader: 'url-loader?limit=8192'
      },
      {
        test: /\.(mp4|ogg|svg)$/,
        loader: 'file-loader'
      }
    ]
  };
}
module.exports = {
  srcPath: srcPath,
  publicPath: '/',
  port: dfltPort,
  getDefaultModules: getDefaultModules,
  postcss: function () {
    return [];
  }
};
