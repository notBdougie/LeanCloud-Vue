const path = require('path')
const utils = require('./utils')
const config = require('./config')

const PROJECT_ROOT = path.resolve(__dirname, '../')
const PUBLIC_ASSETS_PATH = path.resolve(PROJECT_ROOT, 'client/assets')

module.exports = {
  entry: {
    app: "./client/main.js"
  },
  output: {
    path: config.build.assetsRoot,
    publicPath: config.build.assetsPublicPath
  },
  resolve: {
    extensions: ['', '.js', '.vue'],
    fallback: [path.join(PROJECT_ROOT, '../node_modules')],
    alias: {
      'client': path.resolve(PROJECT_ROOT, '../client'),
      'assets': PUBLIC_ASSETS_PATH,
      'components': path.resolve(PROJECT_ROOT, '../client/components')
    }
  },
  resolveLoader: {
    fallback: [path.join(PROJECT_ROOT, '../node_modules')]
  },
  module: {
    loaders: [
      { test: /\.scss$/, loader: 'style!css!autoprefixer?{browsers:["> 2%"]}!sass' },
      { test: /\.css$/, loader: "style!css?outputStyle=expanded" },
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
      { test: /\.js$/, exclude: /node_modules/, include: PROJECT_ROOT, loader: 'babel', query: {
          cacheDirectory: true
      }},
      { test: /\.vue$/, loader: 'vue', exclude: /node_modules/ }
    ]
  },
  plugins: [],
  vue: {
    loaders: utils.cssLoaders()
  }
}