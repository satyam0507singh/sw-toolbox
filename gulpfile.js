//    Copyright 2017 Tagnpin Web Solutions
// 
//    Licensed under the Apache License, Version 2.0 (the "License");
//    you may not use this file except in compliance with the License.
//    You may obtain a copy of the License at
// 
//        http://www.apache.org/licenses/LICENSE-2.0
// 
//    Unless required by applicable law or agreed to in writing, software
//    distributed under the License is distributed on an "AS IS" BASIS,
//    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
//    See the License for the specific language governing permissions and
//    limitations under the License.


'use strict';

var browserify = require('browserify');
var buffer = require('vinyl-buffer');
var eslint = require('gulp-eslint');
var ghPages = require('gulp-gh-pages');
var gulp = require('gulp');
var header = require('gulp-header');
var path = require('path');
var source = require('vinyl-source-stream');
var sourcemaps = require('gulp-sourcemaps');
var temp = require('temp').track();
var testServer = require('./test/server/index.js');
var uglify = require('gulp-uglify');
var express = require('express');
var gulpConcat = require('gulp-concat');
var runSequence = require('run-sequence');
var buildSources = ['lib/**/*.js'];
var lintSources = buildSources.concat([
  'gulpfile.js',
  'recipes/**/*.js',
  'test/**/*.js']);

gulp.task('test:manual', ['build'], function () {
  testServer.startServer(path.join(__dirname), 8888)
    .then(portNumber => {
      console.log(`Tests are available at http://localhost:${portNumber}`);
    });
});

var bundler = browserify({
  entries: ['./lib/sw-toolbox.js'],
  standalone: 'notify',
  debug: true
});

var bundlerNotify = browserify({
  entries: ['./lib/sw-notify-0.2.js'],
  standalone: 'notifyInit',
  debug: true
});

gulp.task('build', function () {

  runSequence('init', 'concat', 'copy', function () {
    console.log('gulpSequence');
    // done();
  });
});

gulp.task('init', ['notify', 'notifyInit']);

gulp.task('concat', function () {
  console.log('gulpConcat');
  return gulp.src(['./notify.js', './notifyInit.js', './call.js'])
    .pipe(gulpConcat('sw-notify.js'))
    .pipe(gulp.dest('./dist/'));
})

gulp.task('notify', function () {
  var license = `/*!
* UPDATES AND DOCS AT: https://www.notifyvisitors.com/brand/documentation/webJsIntegrationCode
*
* @license Copyright (c), NotifyVisitors. All rights reserved.
* This work is subject to the terms at https://www.notifyvisitors.com/site/terms 
*/`;
  return bundler
    .bundle()
    .pipe(source('notify.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify({ compress: true }))
    .pipe(header(license))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
});

gulp.task('notifyInit', function () {
  return bundlerNotify
    .bundle()
    .pipe(source('notifyInit.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
    .pipe(uglify({ compress: true }))
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest('./'));
})

gulp.task('lint', function () {
  return gulp.src(lintSources)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failOnError());
});

gulp.task('watch', ['build'], function () {
  gulp.watch(buildSources, ['build']);
});

gulp.task('gh-pages', ['build'], function () {
  var tempDir = temp.mkdirSync();

  return gulp.src([
    'companion.js',
    'sw-toolbox.js',
    'sw-toolbox.map.json',
    'recipes/**/*'
  ], { base: __dirname })
    .pipe(ghPages({ cacheDir: tempDir }));
});

gulp.task('copy', function () {
  gulp.src('./dist/sw-notify.js').pipe(gulp.dest('./static/'));
});

gulp.task('serve-to-test', ['build'], function () {

  testServer.startAndServe(path.join(__dirname, '/static'), 8080)
    .then(portNumber => {
      console.log(`serving at http://localhost:${portNumber}`);
    });
})

// gulp.task('default', ['lint', 'build']);
gulp.task('default', ['build']);
