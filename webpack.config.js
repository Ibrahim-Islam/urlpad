var path = require('path'),
    ExtractTextPlugin = require('extract-text-webpack-plugin'),
    CopyWebpackPlugin = require('copy-webpack-plugin'),
    webpack = require('webpack'),
    HtmlWebpackPlugin = require('html-webpack-plugin'),
    Optimize = webpack.optimize;

module.exports = {
  entry: {
    app: './src/app.ts',
    vendor: './src/vendor.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].[chunkhash].js'
  },
  resolve: {
    extensions: ['.ts', '.js']
  },
  module: {
      rules:[
        {
          test: /\.ts$/,
          use: ['awesome-typescript-loader'],
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ExtractTextPlugin.extract({
            use: ['css-loader']
          })
        },
        {
          test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
          loader: 'file-loader?name=fonts/[name].[hash].[ext]?'
        }
      ]
  },
  plugins: [
    new ExtractTextPlugin('style.css'),
    new HtmlWebpackPlugin({
      template: 'src/index.html'
    }),
    new Optimize.CommonsChunkPlugin({
      name: ['vendor']
    }),
    // new Optimize.UglifyJsPlugin({
    //   compress: {
    //       warnings: false
    //   }
    // })
  ]
};