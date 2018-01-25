"use strict";
const gulp = require('gulp');
const gulpFlatmap = require('gulp-flatmap');
const sass = require('gulp-sass');
const assetFunctions = require('node-sass-asset-functions');
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
const browserifyCss = require('browserify-css');

const browserSync = require('browser-sync');
const runSequence = require('run-sequence');
const del = require('del');
const path = require('path');


const IS_HTTPS=false;
const IS_DEBUG=false;

const paths={
  'src':'src/',
  'dist':'dist/',
  'raw_contents':'raw_contents/',
  'scss':'src/assets/css/',
  'css':'dist/assets/css/',
  'pug':'src/',
  'html':'dist/',
  'es6':'src/assets/js/',
  'js':'dist/assets/js/',
  'dist_image':'dist/assets/img/',
  'src_image':'src/assets/img/',
  'src_lib':'src/assets/lib/',
  'dist_lib':'dist/assets/lib/',
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
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
  })
  gulp.watch([paths.src_image+"**/*"],['copy_image'])
  gulp.watch([paths.scss+"**/*.scss"],['scss'])
  gulp.watch([paths.pug+"**/*.pug"],['pug'])
  //gulp.watch([paths.es6+"**/*.es6"],['babel'])
  gulp.watch([paths.es6+"**/*.es6"],['babelify-for-watch'])

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
      'scss',
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



gulp.task('scss',function(){
  const pathCssToImage=path.relative(paths.css,paths.dist_image);
  const cacheBusterString=""+Math.floor(Date.now()/1000);
  gulp
  .src(paths.scss+'**/*.scss')
   .pipe(plumber({
     errorHandler: notify.onError("Error: <%= error.message %>")
   }))
  .pipe(gulpFlatmap(function(stream, file){
    const relRoot=path.relative(path.dirname(file.path),paths.scss);
    return stream
    .pipe(sass({
      outputStyle:"nested",
      sourceComments:false,
      includePaths:[
        paths.scss,
        "./node_modules/compass-mixins/lib",
      ],
      functions:assetFunctions({
        images_path:paths.dist_image,
        http_images_path:path.join(relRoot,pathCssToImage),
        asset_cache_buster: function(http_path, real_path, done){
          done(cacheBusterString);
        },
      }),
    }))
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
  .pipe(gulpFlatmap(function(stream, file){
    return stream
    .pipe(pug({
      pretty:true,
      locals:{
        relRoot:path.join(".",path.relative(path.dirname(file.path),paths.pug),"/"),
      },
      basedir:paths.pug,
      //debug:true,
      //compileDebug:true,
    }))
  }))
  .pipe(gulp.dest(paths.html))
  .on('end',browserSync.reload);
});


function babelifyTaskInternal(full){
  let source = full ? [paths.es6+'**/*.es6','!'+paths.es6+'**/_*.es6'] : [paths.es6+'**/*.es6','!'+paths.es6+'**/_*.es6','!'+paths.es6+'**/bundle.es6'];
  return gulp
  .src(source)
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
    .transform(browserifyCss,{
      autoInject:true,
      minify:true,
      global:true,
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

}

gulp.task('babelify',function(){
  return babelifyTaskInternal.call(this,true);
});

gulp.task('babelify-for-watch',function(){
  return babelifyTaskInternal.call(this,false);
});
