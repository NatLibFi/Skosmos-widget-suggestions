const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

// const webpack = require('webpack')
const { DefinePlugin } = require('webpack');

module.exports = {
  entry: ['./src/main.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'components.js'
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Replace 'src' with the actual path to your source directory
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader'
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader'
      },
      {
        test: /\.css$/,
        use: ['vue-style-loader', 'css-loader']
      },
      {
        test: /\.scss$/,
        use: ['vue-style-loader', 'css-loader', 'sass-loader']
      },
    ]
  },
  optimization: {
    minimizer: [new CssMinimizerPlugin()],
  },
  plugins: [
    // ... other plugins ...
    new VueLoaderPlugin(),
    new DefinePlugin({
      'process.env.BUILD': JSON.stringify('web'),
    }),
  ],
  devtool: 'eval-source-map'
}
