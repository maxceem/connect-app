require('./node_modules/coffeescript/register')
const FaviconsWebpackPlugin = require('favicons-webpack-plugin')

module.exports = function(env) {
  const branch = process.env.CIRCLE_BRANCH

  process.env.ENV = 'DEV' // Default to DEV

  if (branch === 'master') process.env.ENV = 'PROD'
  if (branch === 'dev')    process.env.ENV = 'DEV'
  if (branch === 'qa')     process.env.ENV = 'QA'

  // const config = require('appirio-tech-webpack-config')(env, {
  // const config = require('../webpack-config/webpack.config.js')(env, {
  const config = require('./config/webpack/webpack.config.js')(env, {
    dirname: __dirname,
    entry: {
      app: ['./src/styles/main.scss', './src/index', 'react-hot-loader/patch'],
    },
    template: './src/index.html'
  })

  // Set asset prefix to CDN
  // FIXME: Move to constants in webpack-config
  // if (branch === 'dev')     config.output.publicPath = '//d2w5g0u9h79yyx.cloudfront.net/'
  // if (branch === 'qa')      config.output.publicPath = '//changeme.cloudfront.net/'
  // if (branch === 'master')  config.output.publicPath = '//changeme.cloudfront.net/'

  // Adding react hot loader
  /*const babelOptions = {
    presets: [ 'es2015', 'react', 'stage-2' ],
    plugins: [ 'lodash' ]
  }

  const jsxLoader = {
    test: /\.(js|jsx)$/,
    loaders: [
      'react-hot',
      'babel?' + JSON.stringify(babelOptions)
    ],
    exclude: /node_modules\/(?!appirio-tech.*|topcoder|tc-)/
  }

  // Loop over loaders and replace
  config.module.rules.forEach((loader, i, loaders) => {
    if (loader.loader === 'babel' && String(loader.test) === String(/\.(js|jsx)$/)) {
      jsxLoader.include = loader.include
      loaders[i] = jsxLoader
    }
  })*/

  config.plugins.push(new FaviconsWebpackPlugin('./src/favicon.png'))

  console.log("config", JSON.stringify(config, null, 2));

  return config;
}
