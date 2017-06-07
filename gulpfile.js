"use strict";
const gulp = require('gulp');
const compass = require('gulp-compass');
//"Pug" was renamed from "Jade".
//see https://github.com/pugjs/pug
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const uglifySaveLicense = require('uglify-save-license');
const gulpif = require('gulp-if');
const util = require('gulp-util');

const browserify = require('browserify');
const envify = require('envify/custom');
const babelify = require('babelify');
const through2 = require('through2');

const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const del = require('del');



const IS_HTTPS=false;
const IS_DEBUG=false;

const paths={
  'src':'src/',
  'dist':'dist/',
  'raw_contents':'raw_contents/',
  'scss':'src/css/',
  'css':'dist/css/',
  'pug':'src/',
  'html':'dist/',
  'es6':'src/js/',
  'js':'dist/js/',
  'dist_image':'dist/img/',
  'src_image':'src/img/',
  'src_lib':'src/lib/',
  'dist_lib':'dist/lib/',
};

gulp.task('default',function(){
  return runSequence(
    'build',
    'watch'
  );
});



gulp.task('watch',function(){

  browserSync({
    notify:false,
    port:3000,
    https:IS_HTTPS,
    server:{
      baseDir:[paths.dist,paths.raw_contents],
      routes:{
      },
    },
  })
  gulp.watch([paths.src_image+"**/*"],['copy_image'])
  //gulp.watch([paths.scss+"**/*.scss"],['scss'])
  gulp.watch([paths.scss+"**/*.scss"],['compass'])
  gulp.watch([paths.pug+"**/*.pug"],['pug'])
  //gulp.watch([paths.es6+"**/*.es6"],['babel'])
  gulp.watch([paths.es6+"**/*.es6"],['babelify'])

});

gulp.task('clean',function(){
  return del([paths.dist]);
});
gulp.task('build',function(){
  return runSequence(
    'clean',
    [
      'copy_image',
      'copy_lib',
    ],
    [
      'compass',
      //pug
      'pug',
      'babelify',
    ]
  );

});

gulp.task('copy_image',function(){
  return gulp.src([paths.src_image+"**"],{base:paths.src_image})
  .pipe(gulp.dest(paths.dist_image))
})
gulp.task('copy_lib',function(){
  return gulp.src([paths.src_lib+"**"],{base:paths.src_lib})
  .pipe(gulp.dest(paths.dist_lib))
})



gulp.task('compass',function(){
  gulp
  .src(paths.scss+'**/*.scss')
   .pipe(plumber({
     errorHandler: notify.onError("Error: <%= error.message %>")
   }))
  .pipe(compass({
    //debug:true,
    style:"nested",
    comments:false,
    relative:true,
    css:paths.css,
    sass:paths.scss,
    image:paths.dist_image,
  }))
  .pipe(gulp.dest(paths.css))
  .on('end',browserSync.reload);
});

gulp.task('pug',function(){
  gulp
  .src([paths.pug+'**/*.pug','!'+paths.pug+'**/_*.pug'])
   .pipe(plumber({
     errorHandler: notify.onError("Error: <%= error.message %>")
   }))
  .pipe(pug({
    pretty:true,
    locals:{
    },
    //debug:true,
    //compileDebug:true,
  }))
  .pipe(gulp.dest(paths.html))
  .on('end',browserSync.reload);
});


gulp.task('babelify',function(){

  return gulp
  .src([paths.es6+'**/*.es6','!'+paths.es6+'**/_*.es6'])
  .pipe(plumber({
    errorHandler: notify.onError("Error: <%= error.message %>")
  }))
  .pipe(through2.obj(function(file,encode,callback){
    return browserify({
      entries:file.path,
      //debug:true,
      basedir:paths.es6,
    })
    .transform(babelify,{
      presets:["es2015"],
      plugins: [['transform-es2015-classes', {loose: true}]],
      //sourceMaps:"file",
    })
    .transform(envify({
      NODE_ENV:(IS_DEBUG ? 'development' : 'production'),
    }))
    .bundle(function(err, res) {
      if (err) { return callback(err); }
      file.contents = res;
      callback(null, file);
    })
    .on("error",function(err){
      console.log("Error : " + err.message);
    });
  }))
  .pipe(gulpif(!IS_DEBUG,uglify({preserveComments: uglifySaveLicense})))
  .pipe(rename({
    extname:'.js',
  }))
  .pipe(gulp.dest(paths.js))
  .on('end',browserSync.reload);

});
