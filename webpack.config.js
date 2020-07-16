const path = require('path');

module.exports = {
  entry: ['@babel/polyfill', './client/src/index.js'],
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
          loader: 'babel-loader',
          options: {
            presets: [
                "@babel/preset-env",
                "@babel/preset-react"
            ]
          }
        },
      },
      {
        test: /\.less$/, // match any .less file, 
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          { loader: "less-loader",
            options: {
              lessOptions: {
                modifyVars: { 
                  '@primary-color': '#0a1f8f',
                  '@secondary-color': '#124734',
                  '@tertiary-color': '#e04403',
                  '@info-color': '@primary-color',
                  '@success-color': '#124734',
                  '@processing-color': '@primary-color',
                  '@error-color': 'rgba(224, 20, 7, 1.0)',
                  '@highlight-color': '#f6dfa4',
                  '@warning-color': 'rgba(224, 20, 7, 1.0)',
                  '@normal-color': '#231f20',
                  '@white': '#fff',
                  '@black': '#231f20',
                  '@layout-header-background': '#231f20',
                  '@layout-header-color': '#f6dfa4'
                  },
                  javascriptEnabled: true
              },
              sourceMap: true
            }
          }
        ]
      },
      
      {
        test: /\.(s*)css$/, // match any .scss or .css file, 
        use: [
          { loader: "style-loader" }, 
          { loader: "css-loader" }, 
          { loader: "sass-loader"} 
        ]
      },
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      },
      {
        test: /\.svg$/,
        use: [
          {
            loader: 'svg-url-loader',
            options: {
              limit: 10000,
            },
          },
        ],
      }
    ]
  }
};