const gulp = require('gulp');
const connect = require('gulp-connect');
const sassc = require('dj-gulp-tasks/sassc');
const closure = require('dj-gulp-tasks/closure');

/** Configurations */
const sasscConfig = {
  'watch': './src/styles',
  'paths': [
    './node_modules'
  ],
  'files': [
    {
      'entry': './src/styles/**/*.scss',
      'output': './dist'
    }
  ]
};

const closureDistConfig = {
  'output': './dist/fluidts.min.js',
  'files': [
    './src/javascript/**/*.js',
    './node_modules/google-closure-library/closure/goog/**/*.js',
    './node_modules/momentum.js/src/**/*.js'
  ],
  'config': {
    'process_common_js_modules': '1',
    'closure_entry_point': 'fluidts',
    'language_in': 'ECMASCRIPT_2017',
    'language_out': 'ECMASCRIPT5_STRICT',
    'rewrite_polyfills': 'true',
    'output_wrapper': '(function(){\n%output%\n}.bind(this))()',
    'externs': [
      './etc/fluidts.externs.js',
      './node_modules/momentum.js/etc/momentum.externs.js'
    ]
  }
};

const closureDepsConfig = {
  'prefix': '../../../../',
  'output': './etc/fluidts.deps.js',
  'files': [
    './node_modules/momentum.js/src/**/*.js',
    './src/javascript/**/*.js'
  ]
};

/** Style tasks */
gulp.task('sassc-build', (cb) => sassc.compile(sasscConfig, cb));
gulp.task('sassc-watch', ['sassc-build'], () => {
    return sassc.watch(sasscConfig, () => gulp.start('sassc-build'));
});

/** JavaScript tasks */
gulp.task('js-dist-build', () => closure.distCompile(closureDistConfig));
gulp.task('js-deps-build', () => closure.depsBuild(closureDepsConfig));
gulp.task('js-deps-watch', ['js-deps-build'], () => {
    return closure.depsWatch(closureDepsConfig, () => gulp.start('js-deps-build'))
});

gulp.task('start', () => {
  gulp.start('js-deps-watch');
  gulp.start('sassc-watch');

  return connect.server({
    root: ['./dev', './'],
    livereload: true,
    port: 8000
  });
});