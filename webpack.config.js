const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src',

  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'dist'),
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: 'babel-loader' },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },

  devServer: {
    port: 3000,
    contentBase: path.join(__dirname, 'dist'),
    watchContentBase: true,
  },

  plugins: [
    new webpack.DefinePlugin({
      VERSION: JSON.stringify(require('./package.json').version),
    }),
  ],
};
