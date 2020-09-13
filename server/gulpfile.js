const { dest, parallel, src } = require('gulp');
const sourcemaps = require('gulp-sourcemaps');
const ts = require('gulp-typescript');

const tsProject = ts.createProject('tsconfig.json');

function buildTypescript() {
  const tsResult = tsProject.src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())

  return tsResult.js
    .pipe(sourcemaps.write('.'))
    .pipe(dest('build'));
}

function buildJSON() {
  return src('./json/*.json')
    .pipe(dest('build/json'))
}

function buildEnv() {
  return src('./.env', { dot: true })
    .pipe(dest('build'));
}

exports.build = parallel(buildTypescript, buildEnv);
