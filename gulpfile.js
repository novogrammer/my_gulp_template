
const gulp = require('gulp');
const gulpFlatmap = require('gulp-flatmap');
const sass = require('gulp-dart-sass');
const assetFunctions = require('@localnerve/sass-asset-functions');
const autoprefixer = require('gulp-autoprefixer');
// "Pug" was renamed from "Jade".
// see https://github.com/pugjs/pug
const pug = require('gulp-pug');
const rename = require('gulp-rename');
const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const uglify = require('gulp-uglify');
const uglifySaveLicense = require('uglify-save-license');
const gulpif = require('gulp-if');
const beautify = require('gulp-jsbeautifier');

const browserify = require('browserify');
const envify = require('envify/custom');
const babelify = require('babelify');
const through2 = require('through2');
const tsify = require("tsify");

const browserSync = require('browser-sync');
const del = require('del');
const path = require('path');

const findBabelConfig = require('find-babel-config');

const babelConfig = findBabelConfig.sync(__dirname);

const IS_HTTPS = false;
const IS_DEBUG = true;

const paths = {
  src: 'src/',
  dist: 'dist/',
  raw_contents: 'raw_contents/',
  scss: 'src/assets/css/',
  css: 'dist/assets/css/',
  pug: 'src/',
  html: 'dist/',
  ts: 'src/assets/js/',
  es6: 'src/assets/js/',
  js: 'dist/assets/js/',
  dist_image: 'dist/assets/img/',
  src_image: 'src/assets/img/',
  src_lib: 'src/assets/lib/',
  dist_lib: 'dist/assets/lib/',
};


const clean_task = () => del([paths.dist]);
exports.clean = clean_task;

const copy_image_task = () => gulp.src([`${paths.src_image}**`], { base: paths.src_image })
  .pipe(gulp.dest(paths.dist_image));
exports.copy_image = copy_image_task;

const copy_lib_task = () => gulp.src([`${paths.src_lib}**`], { base: paths.src_lib })
  .pipe(gulp.dest(paths.dist_lib));
exports.copy_lib = copy_lib_task;


const scss_task = () => {
  const pathCssToImage = path.relative(paths.css, paths.dist_image);
  const cacheBusterString = `${Math.floor(Date.now() / 1000)}`;
  return gulp
    .src(`${paths.scss}**/*.scss`)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(gulpFlatmap((stream, file) => {
      const relRoot = path.relative(path.dirname(file.path), paths.scss);
      return stream
        .pipe(sass({
          outputStyle: 'expanded',
          sourceComments: false,
          includePaths: [
            paths.scss,
          ],
          functions: assetFunctions({
            images_path: paths.dist_image,
            http_images_path: path.join(relRoot, pathCssToImage),
            // eslint-disable-next-line camelcase
            asset_cache_buster(http_path, real_path, done) {
              done(cacheBusterString);
            },
          }),
        }));
    }))
    .pipe(
      autoprefixer({
        cascade: false,
      }),
    )
    .pipe(gulp.dest(paths.css));
};
exports.scss = scss_task;

const pug_task = () => gulp
  .src([`${paths.pug}**/*.pug`, `!${paths.pug}**/_*.pug`])
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>'),
  }))
  .pipe(gulpFlatmap((stream, file) => stream
    .pipe(pug({
      pretty: true,
      locals: {
        relRoot: path.join('.', path.relative(path.dirname(file.path), paths.pug), '/'),
      },
      basedir: paths.pug,
      // debug:true,
      // compileDebug:true,
    }))
    .pipe(beautify({
      // indent_inner_html:true,
      indent_size: 2,
    }))))
  .pipe(gulp.dest(paths.html));
exports.pug = pug_task;

const tsify_task = () => gulp
  .src(`${paths.ts}**/*.ts`, `!${paths.ts}**/_*.ts`)
  .pipe(plumber({
    errorHandler: notify.onError('Error: <%= error.message %>'),
  }))
  .pipe(through2.obj((file, encode, callback) => browserify({
    entries: file.path,
    // debug:true,
    basedir: paths.es6,
    })
    // .plugin(tsify, { noImplicitAny: true })
    .plugin(tsify, { target: 'es6' })
    .transform(envify({
      NODE_ENV: (IS_DEBUG ? 'development' : 'production'),
    }))
    .bundle((err, res) => {
      if (err) { return callback(err); }
      // eslint-disable-next-line no-param-reassign
      file.contents = res;
      return callback(null, file);
    })
    .on('error', (err) => {
      console.log(`Error : ${err.message}`);
    })))
  .pipe(gulpif(!IS_DEBUG, uglify({ preserveComments: uglifySaveLicense })))
  .pipe(rename({
    extname: '.js',
  }))
  .pipe(gulp.dest(paths.js));


exports.tsify = tsify_task;


function babelifyTaskInternal(full) {
  const source = full ? [`${paths.es6}**/*.es6`, `!${paths.es6}**/_*.es6`] : [`${paths.es6}**/*.es6`, `!${paths.es6}**/_*.es6`, `!${paths.es6}**/bundle.es6`];
  return gulp
    .src(source)
    .pipe(plumber({
      errorHandler: notify.onError('Error: <%= error.message %>'),
    }))
    .pipe(through2.obj((file, encode, callback) => browserify({
      entries: file.path,
      // debug:true,
      basedir: paths.es6,
    })
      .transform(babelify, {
        // jestで参照するためにオプションを`.babelrc`へ移動。
        ...babelConfig.config,
        // babelify独自オプションなので `.babelrc`には書けない。
        global: true,
        // sourceMaps:"file",
      })
      .transform(envify({
        NODE_ENV: (IS_DEBUG ? 'development' : 'production'),
      }))
      .bundle((err, res) => {
        if (err) { return callback(err); }
        // eslint-disable-next-line no-param-reassign
        file.contents = res;
        return callback(null, file);
      })
      .on('error', (err) => {
        console.log(`Error : ${err.message}`);
      })))
    .pipe(gulpif(!IS_DEBUG, uglify({ preserveComments: uglifySaveLicense })))
    .pipe(rename({
      extname: '.js',
    }))
    .pipe(gulp.dest(paths.js));
}

const babelify_task = () => babelifyTaskInternal.call(null, true);
exports.babelify = babelify_task;
const babelify_for_watch_task = () => babelifyTaskInternal.call(null, false);
exports.babelify_for_watch = babelify_for_watch_task;



const build_task = gulp.series(
  clean_task,
  gulp.parallel(
    copy_image_task,
    copy_lib_task,
  ),
  gulp.parallel(
    scss_task,
    pug_task,
    babelify_task,
    tsify_task,
  ),
);
exports.build = build_task;

const watch_task = () => {
  gulp.watch([`${paths.src_image}**/*`], copy_image_task);
  gulp.watch([`${paths.scss}**/*.scss`], scss_task);
  gulp.watch([`${paths.pug}**/*.pug`], pug_task);
  gulp.watch([`${paths.es6}**/*.es6`], babelify_for_watch_task);
  gulp.watch([`${paths.ts}**/*.ts`], tsify_task);

  browserSync({
    notify: false,
    port: 3000,
    https: IS_HTTPS,
    server: {
      baseDir: [paths.dist, paths.raw_contents],
      routes: {
      },
    },
    ghostMode: {
      clicks: false,
      forms: false,
      scroll: false,
    },
    watch: true,
  });
};
exports.watch = watch_task;



exports.default = gulp.series(
  build_task,
  watch_task,
);
