var path = require('path')
var webpack = require('webpack')

var PUBLIC_ASSETS_PATH = path.resolve(__dirname, 'app/assets')

module.exports = {
  entry: [
    "./app/main.js"
  ],
  output: {
    path: path.resolve(__dirname, "dist/assets"),
    publicPath: "/assets/"
  },
  module: {
    loaders: [
      { test: /\.scss$/, loader: 'style!css!autoprefixer?{browsers:["> 2%"]}!sass' },
      { test: /\.css$/, loader: "style!css?outputStyle=expanded" },
      { test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,   loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,  loader: "url?limit=10000&minetype=application/font-woff" },
      { test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=application/octet-stream" },
      { test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,    loader: "file" },
      { test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,    loader: "url?limit=10000&minetype=image/svg+xml" },
      { test: /\.html$/, loader: "html?root="+ PUBLIC_ASSETS_PATH},
      { test: /\.jpg$/, loader: 'file'},
      { test: /\.png$/, loader: 'url-loader?mimetype=image/png'},
      
      { test: /\.tag$/, exclude: /node_modules/, loader: 'riotjs' },
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel', query: {
          presets: ['es2015-riot'],
          cacheDirectory: true
      }},
      // { test: require.resolve('jquery'), loader: 'expose?jquery'}
    ]
  },
  plugins: [
    // new webpack.ProvidePlugin({
    //   $: "jquery",
    //   jQuery: "jquery",
    //   "window.jQuery": "jquery"
    // }),
    new webpack.ProvidePlugin({ riot: 'riot' })
  ]
}