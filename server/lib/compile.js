var webpack = require('webpack');
var webpackConfig = require('../../webpack.dev.config')
var compiler = webpack(webpackConfig);

module.exports = function (app) {
    app.use(require("webpack-dev-middleware")(compiler, {
        publicPath: webpackConfig.output.publicPath,
        noInfo: true,
        stats: {color: true}
    }));
    app.use(require("webpack-hot-middleware")(compiler, {
        log: console.log
    }));   
}