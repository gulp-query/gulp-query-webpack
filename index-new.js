let Plugin = require('gulp-query').Plugin
  , node_path = require('path')
  , gulp = require('gulp')
  , webpack = require('webpack-stream')
;

class WebpackPlugin extends Plugin {

  static method() {
    return 'webpack';
  }

  webpackConfig() {
    return {
      //debug: true,
      entry: null,
      output: {
        path: null,
        filename: null
      },
      module: {
        rules: []
      }
    };
  }

  babelrc() {
    return {
      cacheDirectory: true,
      presets: ['@babel/preset-env'].map(require.resolve)
    }
  }

  run(task_name, config, callback) {
    let full = 'full' in config ? config['full'] : false;
    //let babel = 'babel' in config ? config['babel'] : true;
    let sourceMap = 'source_map' in config ? config['source_map'] : true;
    let sourceMapType = 'source_map_type' in config ? config['source_map_type'] : 'inline';
    sourceMapType = sourceMapType === 'inline' ? 'inline-source-map' : 'source-map';

    let babelrc = this.babelrc();

    if ('babel' in config) {
      babelrc = config['babel'];
    }

    let list = [];

    if (this.isProduction()) {
      sourceMap = false;
    }

    let path_to = this.path(config.to);
    let path_from = this.path(config.from);

    let filename_from = node_path.basename(path_from);
    path_from = node_path.dirname(path_from) + '/';

    let filename_to = filename_from;
    if (node_path.extname(path_to) !== '') {
      filename_to = node_path.basename(path_to);
      path_to = node_path.dirname(path_to) + '/';
    }

    filename_to = filename_to.replace('.jsx', '.js');

    if (this.isProduction() && !full) {
      list.push('Compress');
    }

    if (sourceMap) {
      if (sourceMapType === 'source-map') {
        list.push('Source map: file');
      } else {
        list.push('Source map: inline');
      }
    }

    let src = path_from + filename_from;

    let reportFunc = this.report.bind(this, task_name, src, filename_to, true, list);

    return gulp.src(src)
      .pipe(this.plumber(this.reportError.bind(this, task_name, src, filename_to)))
      .pipe(webpack({
        mode: this.isProduction() ? 'production' : 'development',
        devtool: sourceMap ? sourceMapType : null,
        output: {
          filename: filename_to
        },
        module: {
          rules: [
            {parser: {requireEnsure: false}},

            {
              test: /\.js$/,
              loader: require.resolve('babel-loader'),
              exclude: /(node_modules)/,
              options: {
                compact: this.isProduction(),
                cacheCompression: this.isProduction(),
                cacheDirectory: true,
                sourceMaps: !this.isProduction(),
                presets: ['@babel/preset-env'].map(require.resolve)
              }
            }

          ]
        }
      }))
      .pipe(gulp.dest(path_to))
      .pipe(this.notify(reportFunc))
      ;
  }
}


module.exports = WebpackPlugin;