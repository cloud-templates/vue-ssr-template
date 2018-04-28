'use strict'

const fs = require('fs')
const path = require('path')
const utils = require('./utils')
const config = require('config')
const os = require('os')
const HappyPack = require('happypack')
const happyThreadPool = HappyPack.ThreadPool({size: os.cpus().length})
const vueLoaderConfig = require('./vue-loader.conf')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin')
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')

const resolve = dir => path.resolve(__dirname, dir)

config.fe.host = config.host
config.fe.port = config.port
fs.writeFileSync(resolve('../src/modules/config.json'), JSON.stringify(config.fe))

const createLintingRule = () => ({
  test: /\.(js|vue)$/,
  loader: 'eslint-loader',
  enforce: 'pre',
  include: [utils.resolve('src/modules')],
  options: {
    formatter: require('eslint-friendly-formatter'),
    emitWarning: true
  }
})

const base = {
  devtool: utils.isProduction() ? false : '#cheap-module-source-map',
  output: {
    path: resolve('../dist'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
      '@': utils.resolve('src'),
      '@assets': utils.resolve('src/assets'),
      '@less': utils.resolve('src/assets/less'),
      '@js': utils.resolve('src/assets/js'),
      '@components': utils.resolve('src/modules/components'),
      '@mixins': utils.resolve('src/modules/mixins'),
      '@views': utils.resolve('src/modules/views'),

      // 项目公用
      'config': utils.resolve('src/modules/config.json'),
      'services': utils.resolve('src/modules/services'),
      'lang': utils.resolve('src/modules/lang/zh-cn'),
      'variable': utils.resolve('src/assets/less/variable.less'),
      'utils': utils.resolve('node_modules/cloud-utils/dist/cloud-utils.esm'),
      'mixins': utils.resolve('node_modules/magicless/magicless.less')
    }
  },
  module: {
    noParse: /es6-promise\.js$/, // avoid webpack shimming process
    rules: [
      ...([createLintingRule()]),
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig
      },
      {
        test: /\.(js|jsx)$/,
        use: ['happypack/loader?id=happybabel'],
        include: [utils.resolve('src/modules')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        include: [utils.resolve('src')],
        options: {
          limit: 10000,
          name: utils.assetsPath('[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        include: [utils.resolve('src')],
        options: {
          limit: 10000,
          name: utils.assetsPath('[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        include: [utils.resolve('src')],
        options: {
          limit: 10000,
          name: utils.assetsPath('[name].[hash:7].[ext]')
        }
      },
      ...utils.styleLoaders({sourceMap: true, extract: true, usePostCSS: true })
    ]
  },
  performance: {
    maxEntrypointSize: 300000,
    hints: utils.isProduction() ? 'warning' : false
  },
  plugins: utils.isProduction() ? [
    // 开启 happypack 的线程池
    // 原有的 webpack 对 loader 的执行过程从单一进程的形式扩展多进程模式，原本的流程保持不变
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    }),
    new UglifyJsPlugin({
      uglifyOptions: {
        compress: {
          warnings: false,
          drop_console: true
        }
      },
      sourceMap: true,
      parallel: true
    }),
    // Compress extracted CSS. We are using this plugin so that possible
    // duplicated CSS from different components can be deduped.
    new OptimizeCSSPlugin({
      cssProcessorOptions: { safe: true, map: { inline: false } }
    }),
    // enable scope hoisting
    new webpack.optimize.ModuleConcatenationPlugin()
  ] : [
    // 开启 happypack 的线程池
    // 原有的 webpack 对 loader 的执行过程从单一进程的形式扩展多进程模式，原本的流程保持不变
    new HappyPack({
      id: 'happybabel',
      loaders: ['babel-loader'],
      threadPool: happyThreadPool,
      cache: true,
      verbose: true
    }),
    new FriendlyErrorsPlugin()
  ]
}

module.exports = base;
