const { dest, series, src } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const babel = require('gulp-babel');

function build() {
  return src('./src/**/*.js')
    .pipe(sourcemaps.init())
    .pipe(babel({
      presets: ['@babel/preset-env'],
      plugins: ['@babel/transform-runtime']
    }))
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build'));
}

exports.build = build;