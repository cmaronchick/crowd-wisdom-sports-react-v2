const path = require('path');

module.exports = {
  entry: ['babel-polyfill', './src/index.js'],
  output: {
    path: path.resolve('public'),
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.(s*)css$/, // match any .scss or .css file, 
        use: [
          "style-loader", 
          "css-loader", 
          "sass-loader" 
        ]
      }
    ]
  }
};