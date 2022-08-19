/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable camelcase */

const gulp = require("gulp");
const gulpFlatmap = require("gulp-flatmap");
const sass = require("gulp-sass")(require("sass"));
const assetFunctions = require("@localnerve/sass-asset-functions");
const autoprefixer = require("gulp-autoprefixer");
// "Pug" was renamed from "Jade".
// see https://github.com/pugjs/pug
const pug = require("gulp-pug");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const beautify = require("gulp-jsbeautifier");

const through2 = require("through2");

const { rollup } = require("rollup");
const typescript = require("@rollup/plugin-typescript");
const commonjs = require("@rollup/plugin-commonjs");
const { nodeResolve } = require("@rollup/plugin-node-resolve");
const { terser } = require("rollup-plugin-terser");
const injectProcessEnv = require("rollup-plugin-inject-process-env");

const browserSync = require("browser-sync");
const del = require("del");
const path = require("path");

const package = require("./package.json");

const IS_HTTPS = false;
const IS_DEBUG = true;

const paths = {
  src: "src/",
  dist: "dist/",
  raw_contents: "raw_contents/",
  scss: "src/assets/css/",
  css: "dist/assets/css/",
  pug: "src/",
  html: "dist/",
  src_js: "src/assets/js/",
  dist_js: "dist/assets/js/",
  dist_image: "dist/assets/img/",
  src_image: "src/assets/img/",
  src_lib: "src/assets/lib/",
  dist_lib: "dist/assets/lib/",
};

const clean_task = () => del([`${paths.dist}*`]);
exports.clean = clean_task;

const copy_image_task = () =>
  gulp
    .src([`${paths.src_image}**`], { base: paths.src_image })
    .pipe(gulp.dest(paths.dist_image));
exports.copy_image = copy_image_task;

const copy_lib_task = () =>
  gulp
    .src([`${paths.src_lib}**`], { base: paths.src_lib })
    .pipe(gulp.dest(paths.dist_lib));
exports.copy_lib = copy_lib_task;

const scss_task = () => {
  const pathCssToImage = path.relative(paths.css, paths.dist_image);
  const cacheBusterString = `${Math.floor(Date.now() / 1000)}`;
  return gulp
    .src(`${paths.scss}**/*.scss`)
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(
      gulpFlatmap((stream, file) => {
        const relRoot = path.relative(path.dirname(file.path), paths.scss);
        return stream.pipe(
          sass({
            outputStyle: "expanded",
            sourceComments: false,
            includePaths: [paths.scss],
            functions: assetFunctions({
              images_path: paths.dist_image,
              http_images_path: path.join(relRoot, pathCssToImage),
              // eslint-disable-next-line camelcase
              asset_cache_buster(http_path, real_path, done) {
                done(cacheBusterString);
              },
            }),
          })
        );
      })
    )
    .pipe(
      autoprefixer({
        cascade: false,
      })
    )
    .pipe(gulp.dest(paths.css));
};
exports.scss = scss_task;

const pug_task = () =>
  gulp
    .src([`${paths.pug}**/*.pug`, `!${paths.pug}**/_*.pug`])
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(
      gulpFlatmap((stream, file) =>
        stream
          .pipe(
            pug({
              pretty: true,
              locals: {
                relRoot: path.join(
                  ".",
                  path.relative(path.dirname(file.path), paths.pug),
                  "/"
                ),
              },
              basedir: paths.pug,
              // debug:true,
              // compileDebug:true,
            })
          )
          .pipe(
            beautify({
              // indent_inner_html:true,
              indent_size: 2,
            })
          )
      )
    )
    .pipe(gulp.dest(paths.html));
exports.pug = pug_task;

const rollup_task = () => {
  const source = [
    `${paths.src_js}**/*.js`,
    `!${paths.src_js}**/_*.js`,
    `${paths.src_js}**/*.ts`,
    `!${paths.src_js}**/_*.ts`,
  ];
  return gulp
    .src(source)
    .pipe(
      plumber({
        errorHandler: notify.onError("Error: <%= error.message %>"),
      })
    )
    .pipe(
      through2.obj((file, encode, callback) => {
        (async () => {
          const inputRelativePath = path.relative(paths.src_js, file.path);
          const outputRelativePath = inputRelativePath.replace(/\.ts+$/, ".js");
          console.time(`compile: ${inputRelativePath}`);
          const bundle = await rollup({
            input: file.path,
            plugins: [
              typescript(),
              commonjs({
                transformMixedEsModules: true,
              }),
              injectProcessEnv({
                NODE_ENV: IS_DEBUG ? "development" : "production",
              }),
              nodeResolve({
                browser: true,
              }),
              !IS_DEBUG && terser(),
            ],
          });
          await bundle.write({
            file: `${paths.dist_js}${outputRelativePath}`,
            name: package.name,
            sourcemap: true,
            format: "umd",
          });
          console.timeEnd(`compile: ${inputRelativePath}`);
        })()
          .then(() => callback())
          .catch(callback);
      })
    );
};
exports.rollup = rollup_task;

const build_task = gulp.series(
  clean_task,
  gulp.parallel(copy_image_task, copy_lib_task),
  gulp.parallel(scss_task, pug_task, rollup_task)
);
exports.build = build_task;

const watch_task = () => {
  const watchOptions = {
    useFsEvents: false,
  };
  gulp.watch([`${paths.src_image}**/*`], watchOptions, copy_image_task);
  gulp.watch([`${paths.scss}**/*.scss`], watchOptions, scss_task);
  gulp.watch([`${paths.pug}**/*.pug`], watchOptions, pug_task);
  gulp.watch(
    [`${paths.src_js}**/*.js`, `${paths.src_js}**/*.ts`],
    watchOptions,
    rollup_task
  );

  browserSync({
    notify: false,
    port: 3000,
    https: IS_HTTPS,
    server: {
      baseDir: [paths.dist, paths.raw_contents],
      routes: {},
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

exports.default = gulp.series(build_task, watch_task);
