const webpack = require('webpack')
const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const UglifyPlugin = require('uglifyjs-webpack-plugin')
const CompressionPlugin = require('compression-webpack-plugin')
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const isProd = process.env.NODE_ENV === 'production'
const targetEnv = process.env.TARGET_ENV

// html plugin
const htmlWebpackPlugin = new HtmlWebpackPlugin({
  template: './src/index.html',
  filename: './index.html'
})
// copy src to dist plugin
const copyWebpackPlugin = new CopyWebpackPlugin([
  {
    from: 'public'
  }
])
// gzip plugin
const gzipPlugin = new CompressionPlugin({
  filename(assets) {
    const newAsset = assets.replace('.gz', '')
    return newAsset
  },
  algorithm: 'gzip',
  test: /\.(js)$/,
  deleteOriginalAssets: false
})
// uglify plugin
const uglifyPlugin = new UglifyPlugin({ cache: true, parallel: true, sourceMap: true })
// optimize css assets plugin
const optimizeCssAssetsPlugin = new OptimizeCssAssetsPlugin()
// CSS Extract
const cssExtractPlugin = new MiniCssExtractPlugin({
  filename: '[name].css',
  chunkFilename: '[name].css'
})

module.exports = {
  performance: {
    hints: false
  },
  optimization: {
    minimizer: [uglifyPlugin, optimizeCssAssetsPlugin],
    splitChunks: {
      chunks: 'async',
      name: true,
      minChunks: Infinity
    }
  },
  entry: ['react-hot-loader/patch', '@babel/polyfill', './src/index.js'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/main.js',
    chunkFilename: 'js/[name].js',
    publicPath: '/'
  },
  devtool: 'eval',
  devServer: {
    historyApiFallback: true
  },
  module: {
    rules: [
      {
        enforce: 'pre',
        test: /\.(js|jsx)?$/,
        loader: 'eslint-loader',
        exclude: /node_modules/
      },
      {
        oneOf: [
          {
            test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
            loader: require.resolve('url-loader'),
            options: {
              limit: 10000,
              name: 'static/media/[ext]/[name].[ext]'
            }
          },
          {
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto'
          },
          {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
              loader: 'babel-loader'
            }
          },
          {
            test: /\.scss$/,
            use: [
              'style-loader',
              'resolve-url-loader',
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  minimize: true
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          },
          {
            test: /\.css$/,
            use: [
              'style-loader',
              'resolve-url-loader',
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true,
                  minimize: true
                }
              },
              {
                loader: 'sass-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          },
          {
            test: /\.(mov|mp4|webm)$/,
            use: ['file-loader']
          },
          {
            test: /\.svg$/,
            loader: 'file-loader',
            options: {
              name: 'static/media/svg/[name].[ext]'
            }
          },
          {
            test: [/\.ttf$/, /\.otf$/, /\.woff$/, /\.eot$/],
            loader: 'file-loader',
            options: {
              name: 'fonts/[name].[ext]'
            }
          },
          {
            loader: 'file-loader',
            exclude: [/\.js$/, /\.html$/, /\.json$/],
            options: {
              name: 'static/media/[name].[ext]'
            }
          }
        ]
      }
    ]
  },
  plugins: [htmlWebpackPlugin, cssExtractPlugin, copyWebpackPlugin],
  resolve: {
    modules: [path.resolve(__dirname, 'src'), 'node_modules'],
    alias: {
      'styled-components': path.resolve(__dirname, 'node_modules', 'styled-components'),
      graphQL: path.join(__dirname, 'src/graphQL')
    }
  }
}
