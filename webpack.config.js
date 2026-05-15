const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      main: './src/scripts/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'scripts/[name].[contenthash].js',
      assetModuleFilename: 'assets/[name][ext]'
    },
    mode: isProduction ? 'production' : 'development',
    devServer: {
      static: {
        directory: path.join(__dirname, 'dist'),
      },
      compress: true,
      port: 8080,
      open: true
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          use: 'babel-loader'
        },
        {
          test: /\.css$/,
          use: [
            isProduction ? MiniCssExtractPlugin.loader : 'style-loader',
            'css-loader',
            {
              loader: 'postcss-loader',
              options: {
                postcssOptions: {
                  plugins: [
                    require('postcss-preset-env')({
                      browsers: 'last 2 versions'
                    })
                  ]
                }
              }
            }
          ]
        },
        {
          test: /\.(png|svg|jpg|jpeg|gif|webp)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'images/[name][ext]'
          }
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/i,
          type: 'asset/resource',
          generator: {
            filename: 'fonts/[name][ext]'
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin(),
      new HtmlWebpackPlugin({
        template: './src/index.html',
        filename: 'index.html'
      }),
      ...(isProduction ? [new MiniCssExtractPlugin({
        filename: 'styles/[name].[contenthash].css'
      })] : [])
    ],
    optimization: {
      minimizer: [
        '...',
        ...(isProduction ? [new CssMinimizerPlugin()] : [])
      ]
    },
    devtool: isProduction ? false : 'source-map'
  };
};