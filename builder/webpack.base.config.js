const webpack = require('webpack')
const path = require('path')
const precss = require('precss')
const autoprefixer = require('autoprefixer')
const utils = require('./utils')
const config = require('./config')

const PROJECT_ROOT = path.resolve(__dirname, '../')
const PUBLIC_ASSETS_PATH = path.resolve(PROJECT_ROOT, 'client/assets')

module.exports = {
  entry: {
    app: "./client/main.js",
    vendor: ['jquery', 'vue', 'vue-router', 'moment']
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(PROJECT_ROOT, 'node_modules')],
    alias: {
      'client': path.resolve(PROJECT_ROOT, 'client'),
      'assets': PUBLIC_ASSETS_PATH,
      'components': path.resolve(PROJECT_ROOT, 'client/components'),
      'jquery': "jquery/src/jquery"
    }
  },
  resolveLoader: {
    fallback: [path.join(PROJECT_ROOT, 'node_modules')]
  },
  module: {
    loaders: [
      { test: /\.scss$/, loader: 'style!css!postcss!sass' },
      { test: /\.css$/, loader: "style!css?outputStyle=expanded!postcss" },
      { test: /\.html$/, loader: "vue-html?root="+ PUBLIC_ASSETS_PATH},
      { test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, loader: 'url', query: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      { test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, loader: 'url', query: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      },
      { test: /\.js$/, include: [path.resolve('./client')], loader: 'babel', query: {
          cacheDirectory: true
      }},
      { test: /\.vue$/, loader: 'vue', exclude: /node_modules/ },
      { test: require.resolve('jquery'), loader: 'expose?jQuery'},
      { test: /jquery[\\\/]src[\\\/]selector\.js$/, loader: 'amd-define-factory-patcher-loader' }
    ]
  },
  postcss: function () {
    return [precss, autoprefixer];
  },
  plugins: [
    new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery"
    }),
    new webpack.DefinePlugin({
        "process.env.serverConfig": {
          portalPrefix: JSON.stringify(config.serverConfig.portalPrefix)
        }
    })
  ],
  babel: {
    presets: ['es2015']
  },
  vue: {
    loaders: utils.cssLoaders()
  }
}