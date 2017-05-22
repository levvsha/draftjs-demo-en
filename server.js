var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack/webpack.dev.config');

var localPort = config.localPort;
var localIp = config.localIp;

delete config.localIp;
delete config.localPort;

new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
  hot: true,
  historyApiFallback: true
}).listen(localPort, localIp, function (err) {
  if (err) {
    console.log(err);
  }
  console.log(`Listening at ${ localIp }:${ localPort }`);
});

