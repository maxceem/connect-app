'use strict';

const _ = require('lodash');
const autoprefixer = require('autoprefixer');

module.exports = function(env, options) {
  const path              = require('path');
  const webpack           = require('webpack');
  const ExtractCssChunks = require('extract-css-chunks-webpack-plugin');
  const HtmlWebpackPlugin = require('html-webpack-plugin');
  const CompressionPlugin = require('compression-webpack-plugin');
  const constants         = require('./constants.js');

  let dirname = options.dirname;
  let entry = options.entry;
  let template = options.template;

  console.log("dirname, entry, template", dirname, entry, template);

  dirname = dirname || __dirname;

  let TEST   = false;
  let BUILD  = env === 'build';
  let MOCK   = false;
  let ENV    = process.env.ENV || env === 'dev' && 'DEV' || 'DEV';

  process.argv.forEach(function(arg) {
    if (arg === '--test') { TEST   = true; }

    if (arg === '--dev') { ENV = 'DEV'; }
    if (arg === '--qa') { ENV = 'QA'; }
    if (arg === '--prod') { ENV = 'PROD'; }
    if (arg === '--mock') { return MOCK = true; }
  });

  const envConstants = constants(ENV);
  // console.log("envConstants", envConstants);

  // Object.assign(process.env, envConstants);

  // console.log("process.env", process.env);

  // Reference: http://webpack.github.io/docs/configuration.html
  const config         = {};
  config.context = dirname;

  // Reference: http://webpack.github.io/docs/configuration.html#entry
  if (TEST && !entry) {
    config.entry = {};
  } else if (entry) {
    config.entry = entry;
  } else {
    config.entry = path.join(dirname, '/example/example.coffee');
  }

  // Reference: http://webpack.github.io/docs/configuration.html#output
  if (TEST) {
    config.output = {};
  } else {
    config.output = {
      path          : path.join(dirname, '/dist'),
      filename      : '[name].[hash].js',
      chunkFilename : '[name].[hash].js'
    };
  }

  // Reference: http://webpack.github.io/docs/configuration.html#devtool
  if (TEST) {
    config.devtool = 'inline-source-map';
  } else if (BUILD) {
    config.devtool = 'source-map';
  } else {
    config.devtool = 'eval';
  }

  const scssLoaderBase = [{
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer,
            ],
          },
        },
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }];
  const scssLoader = BUILD ?
      ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer,
            ],
          },
        },
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }],
      })
    :
      [{
          loader: 'css-loader',
        }, {
          loader: 'postcss-loader',
          options: {
            plugins: [
              autoprefixer,
            ],
          },
        },
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
          },
        }];

  // Reference: http://webpack.github.io/docs/configuration.html#module-loaders
  // List: http://webpack.github.io/docs/list-of-loaders.html
  config.module = {
    rules: [{
      test: /\.(js|jsx)$/,
      loader: 'babel-loader',
      exclude: /node_modules\/(?!appirio|topcoder|tc|input\-moment)/,
      include: path.join(dirname, '..'),
      options: {
        presets: [ 'env', 'react', 'stage-2' ],
        plugins: [
          'lodash',
          'react-hot-loader/babel',
        ]
      }
    }, {
      test: /^(?!.*\.react\.jade$)(.*\.jade$)/,
      loader: 'jade-loader'
    }, {
      test: /\.react\.jade$/,
      loader: 'jade-react-loader'
    }, {
      test: /\.jader$/,
      loader: 'jade-react-loader'
    }, {
      test: /\.(coffee|litcoffee|cjsx)$/,
      use: [
        {
          loader: 'babel-loader',
          options: {
            presets: [ 'env', 'react', 'stage-2' ],
            plugins: [
              'lodash',
              'react-hot-loader/babel',
            ]
          }
        },
        'coffee-loader',
        'cjsx-loader'
      ]
    }, {
      test: /\.json$/,
      loader: 'json-loader'
    }, {
      test: /\.scss$/,
      use: ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true,
          }
        }, {
          loader: 'postcss-loader',
          options: {
            sourceMap: true,
            plugins: [
              // autoprefixer,
            ],
          },
        },
        'resolve-url-loader',
        {
          loader: 'sass-loader',
          options: {
            sourceMap: true,
            includePaths: [
              path.join(dirname, '/node_modules/bourbon/app/assets/stylesheets'),
              path.join(dirname, '/node_modules/tc-ui/src/styles')
            ],
          },
        }],
      }),
    }, {
      /* We have to support css loading for third-party plugins,
       * we don't apply any transforms to the like autoprefixing
       * we are not supposed to use css files inside the project. */
      test: /\.css$/,
      use: ExtractCssChunks.extract({
        fallback: 'style-loader',
        use: ['css-loader'],
      }),
    }, {
      // ASSET LOADER
      // Reference: https:#github.com/webpack/file-loader
      // Copy png, jpg, jpeg, gif, svg, woff, woff2, ttf, eot files to output
      // Rename the file using the asset hash
      // Pass along the updated reference to your code
      // You can add here any file extension you want to get copied to your output
      test: /\.(png|jpg|jpeg|gif)$/,
      loader: 'file-loader'
    }, {
      test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }, {
      test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file-loader'
    }],
    /*postLoaders: [{
      test: /\.(js|coffee|cjsx|jsx)$/,
      loader: 'transform/cacheable?envify'
    }]*/
  };

  /*config.resolveLoader =
    {root: path.join(dirname, '/node_modules/')};*/

  config.resolve = {
    extensions: [
      '.js',
      '.jsx',
      '.json',
      '.coffee',
      '.jade',
      '.jader',
      '.scss',
      '.svg',
      '.png',
      '.gif',
      '.jpg',
      '.cjsx'
    ]
  };

  // Reference: http://webpack.github.io/docs/configuration.html#plugins
  // List: http://webpack.github.io/docs/list-of-plugins.html
  config.plugins = [];

  config.plugins.push(
    new ExtractCssChunks({
      filename: '[name].css',
      justExtract: true,
    })
  );

  config.plugins.push(new webpack.DefinePlugin({
    __MOCK__: JSON.stringify(JSON.parse(MOCK || 'false')),
    'process.env': _.mapValues(envConstants, function (value) {
        return JSON.stringify(value);
    })
  }));

  if (!TEST) {
    config.plugins.push(new HtmlWebpackPlugin({
      template: template || './example/index.html',
      inject: 'body',
      // favicon: options.favicon,
      NEW_RELIC_APPLICATION_ID: envConstants.NEW_RELIC_APPLICATION_ID
    }));
  }

  if (BUILD) {
    // Do not include any .mock.js files if this is a build
    config.plugins.push(new webpack.IgnorePlugin(/\.mock\.js/));

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#noerrorsplugin
    // Only emit files when there are no errors
    config.plugins.push(new webpack.NoEmitOnErrorsPlugin());

    // Reference: http://webpack.github.io/docs/list-of-plugins.html#dedupeplugin
    // Dedupe modules in the output
    // config.plugins.push(new webpack.optimize.DedupePlugin());

    const uglifyOptions = options.uglifyOptions || { mangle: true };

    config.plugins.push(new webpack.optimize.UglifyJsPlugin(uglifyOptions));

    config.plugins.push(new CompressionPlugin({
      asset: "{file}",
      algorithm: "gzip",
      regExp: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    }));
  }

  config.plugins.push(new webpack.LoaderOptionsPlugin({
    debug: true
  }));

  return config;
};
