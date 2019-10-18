const readDir = require('readdir');
const livereload = require('gulp-livereload');
const gulp = require('gulp');
const uglify = require('gulp-uglify');
const handleErrors = require('../util/handleErrors');
const source = require('vinyl-source-stream');
const webpack = require('webpack');
const webpackStream = require('webpack-stream');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const { join, resolve } = require('path');

const PATH = require('../path');

/**
 * Webpack configuation
 */
const webpackConfig = ({ env }) => {
  const isDev = env === 'dev';
  const isProd = env === 'prod';
  const isTest = env === 'test';

  const addPlugin = (add, plugin) => (add ? plugin : undefined);
  const ifDev = plugin => addPlugin(isDev, plugin);
  const ifProd = plugin => addPlugin(isProd, plugin);
  const removeEmpty = array => array.filter(i => !!i);

  let CSS_LOADERS = null;

  /**
   * Style loaders.
   */
  const stylesLoaders = () => {
    const cssLoader = {
      loader: 'css-loader',
    };

    const sassLoader = {
      loader: 'sass-loader',
      options: {
        sourceMap: isDev,
        includePaths: [
          PATH.NODE_MODULES_DIR,
          PATH.TMP,
          PATH.PARTIALS,
          join(PATH.SOURCE, 'images'),
          join(PATH.STYLE.SRC_DIR),
          join(PATH.STYLE.SRC_DIR, 'vars'),
          join(PATH.STYLE.SRC_DIR, 'site'),
        ],
      },
    };

    const postcssLoader = {
      loader: 'postcss-loader',
      options: {
        sourceMap: isDev,
        ident: 'postcss',
        plugins: loader => [
          require('postcss-easings'),
          require('postcss-inline-svg')({
            path: resolve(PATH.SOURCE, 'images'),
          }),
          require('postcss-base64')({
            extensions: ['.jpg'],
          }),
          require('autoprefixer')({
            browsers: ['last 2 versions', 'Safari 8', 'ie > 9'],
          }),
        ],
      },
    };

    if (isProd) {
      CSS_LOADERS = [
        {
          test: /\.scss$/,
          exclude: /node_modules/,
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
              },
              {
                ...postcssLoader,
              },
              {
                ...sassLoader,
              },
            ],
          }),
        },
      ];
    } else {
      CSS_LOADERS = [
        {
          test: /\.(scss)$/,
          exclude: /node_modules/,
          use: [
            'style-loader',
            {
              loader: 'css-loader',
            },
            {
              ...postcssLoader,
            },
            {
              ...sassLoader,
            },
          ],
        },
      ];
    }
    return CSS_LOADERS;
  };

  /**
   * Compile Javascript sources.
   */
  const jsFiles = readDir.readSync(PATH.JS.SRC_DIR, ['**.js']);
  let entry = {};
  jsFiles.forEach(function(value) {
    if (value.endsWith('.js')) {
      const key = value.substring(0, value.length - 3);
      entry[key] = join(PATH.JS.SRC_DIR, value);
    }
  });

  return {
    entry: entry,
    output: {
      filename: '[name].min.js',
      path: resolve(PATH.ABSOLUTE_BASE, PATH.BUILD),
      publicPath: '',
      pathinfo: !env.prod,
    },
    bail: env.prod,
    context: PATH.SOURCE,
    resolve: {
      extensions: ['.js', '.sass'],
      modules: [
        PATH.NODE_MODULES_DIR,
        resolve(`${PATH.ABSOLUTE_BASE}`),
        resolve(`${PATH.SOURCE}`),
        resolve(`${PATH.JS.SRC_DIR}`),
        resolve(`${PATH.JS.SRC_DIR}`, 'common'),
        resolve(`${PATH.JS.SRC_DIR}`, 'containers'),
        resolve(`${PATH.JS.SRC_DIR}`, 'components'),
        resolve(`${PATH.JS.SRC_DIR}`, 'utils'),
      ],
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules)/,
          use: {
            loader: 'babel-loader',
          },
        },
      ].concat(stylesLoaders()),
    },
    plugins: removeEmpty([
      ifProd(
        new ExtractTextPlugin({
          filename: '../css/[name].min.css',
          disable: false,
          allChunks: true,
        })
      ),
      ifProd(
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false,
          quiet: true,
        })
      ),
      ifProd(
        new UglifyJSPlugin({
          sourceMap: true,
          uglifyOptions: {
            compress: true,
            ie8: false,
            ecma: 5,
            warnings: false,
            compress: true,
            mangle: {
              safari10: true,
            },
          },
        })
      ),
    ]),
  };
};

gulp.task('_webpack', () => {
  const config = webpackConfig({ env: 'dev' });
  config.watch = true;
  gulp
    .src(PATH.JS.SRC)
    .pipe(webpackStream(config, webpack))
    .pipe(gulp.dest(PATH.BUILD))
    .pipe(livereload());
});

gulp.task('_webpack-production', () => {
  const config = webpackConfig({ env: 'prod' });
  gulp
    .src(PATH.JS.SRC)
    .pipe(webpackStream(config, webpack))
    .pipe(gulp.dest(PATH.BUILD));
});
