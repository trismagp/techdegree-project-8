"use strict";

var   gulp        = require('gulp'),
      concat      = require('gulp-concat'),
      uglify      = require('gulp-uglify'),
      rename      = require('gulp-rename'),
      maps        = require('gulp-sourcemaps'),
      sass        = require('gulp-sass'),
      clean       = require('gulp-clean'),
      cleanCSS    = require('gulp-clean-css'),
      image       = require('gulp-image'),
      del         = require('del'),
      browserSync = require('browser-sync').create();


// concats to app.js and maps the js files
gulp.task("concatScripts", function(){
  return gulp.src(['js/**/*.js','js/*.js'])
  .pipe(maps.init())
  .pipe(concat("app.js"))
  .pipe(maps.write('./'))
  .pipe(gulp.dest("js"));
})

// run "concatScripts", then minifies js/app.js to dist/scripts/all.min.js 
gulp.task("minifyScripts",["concatScripts"], function(){
  return gulp.src('js/app.js')
  .pipe(uglify())
  .pipe(rename("all.min.js"))
  .pipe(gulp.dest("dist/scripts"));
})

gulp.task("scripts",["minifyScripts"])

// concats and maps sass files to the css folder
gulp.task("sass", function(){
  return gulp.src(['sass/*.scss'])
  .pipe(maps.init())
  .pipe(sass())
  .pipe(maps.write('./'))
  .pipe(gulp.dest("css"));
})

// run "sass" then minifies to dist/styles/all.min.css
gulp.task('minifyCss', ["sass"], function(){
  return gulp.src('css/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(rename("all.min.css"))
    .pipe(gulp.dest('dist/styles'));
});

gulp.task("styles",["minifyCss"])



// optimize the size of the project’s JPEG and PNG files, and then copy those optimized images to the dist/content folder
gulp.task('image', function () {
  gulp.src('./images/*')
    .pipe(image())
    .pipe(gulp.dest('dist/content'));
});


// deletes all of the files and folders in the dist folder.
gulp.task('clean', function () {
  del('dist/**')
});


// runs "clean" first, then "scripts", "styles", and "image" 
gulp.task("build",["clean"], function(){
  gulp.start(["scripts", "styles", "image"]);
})



// Found implementation here: https://stackoverflow.com/questions/43415506/how-to-make-a-refresh-in-browser-with-gulp
// watches for sass files updates then launch "styles" and reload the browser
gulp.task('serve', function() {
  browserSync.init({
      server: "./"
  });
  gulp.watch(['sass/*.scss','sass/**/*.sass'],['styles'], function(){
    gulp.pipe(browserSync.stream());
  });
  gulp.watch("css/global.css").on('change', browserSync.reload);
});

// runs "build" first then launch "serve"
gulp.task('default', ["build"], function(){
  gulp.start(['serve']);
});