/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable camelcase */

import gulp from "gulp";
import gulpFlatmap from "gulp-flatmap";
import gulpSass from "gulp-sass";
import dartSass from "sass";
import assetFunctions from "@localnerve/sass-asset-functions";
import autoprefixer from "gulp-autoprefixer";
// "Pug" was renamed from "Jade".
// see https://github.com/pugjs/pug
import pug from "gulp-pug";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import beautify from "gulp-jsbeautifier";

import gulpImagemin from "gulp-imagemin";
import imageminWebp from "imagemin-webp";

import through2 from "through2";

import gulpRename from "gulp-rename";

import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import commonjs from "@rollup/plugin-commonjs";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import injectProcessEnv from "rollup-plugin-inject-process-env";
import json from "@rollup/plugin-json";

import browserSync from "browser-sync";
import { deleteAsync } from "del";
import path from "path";

const sass = gulpSass(dartSass);

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
  src_image: "src/assets/img/",
  dist_image: "dist/assets/img/",
  src_webp: "src/assets/img/",
  dist_webp: "dist/assets/img/",
  src_lib: "src/assets/lib/",
  dist_lib: "dist/assets/lib/",
};

const clean_task = () => deleteAsync([`${paths.dist}**`]);
export { clean_task as clean };

const copy_image_task = () =>
  gulp
    .src([`${paths.src_image}**`], { base: paths.src_image, encoding: false })
    .pipe(gulp.dest(paths.dist_image));
export { copy_image_task as copy_image };

const imagemin_webp_jpg_task = () =>
  gulp
    .src([`${paths.src_webp}**/*.jpg`], {
      base: paths.src_webp,
      encoding: false,
    })
    .pipe(
      gulpImagemin([
        imageminWebp({
          lossless: false,
        }),
      ])
    )
    .pipe(
      gulpRename((parsedPath) => {
        parsedPath.extname = ".webp";
      })
    )
    .pipe(gulp.dest(paths.dist_webp));
export { imagemin_webp_jpg_task as imagemin_jpg_webp };

const imagemin_webp_png_task = () =>
  gulp
    .src([`${paths.src_webp}**/*.png`], {
      base: paths.src_webp,
      encoding: false,
    })
    .pipe(
      gulpImagemin([
        imageminWebp({
          lossless: true,
        }),
      ])
    )
    .pipe(
      gulpRename((parsedPath) => {
        parsedPath.extname = ".webp";
      })
    )
    .pipe(gulp.dest(paths.dist_webp));
export { imagemin_webp_png_task as imagemin_webp_png };

const imagemin_webp_task = gulp.series(
  imagemin_webp_jpg_task,
  imagemin_webp_png_task
);

export { imagemin_webp_task as imagemin_webp };
const copy_lib_task = () =>
  gulp
    .src([`${paths.src_lib}**`], { base: paths.src_lib, encoding: false })
    .pipe(gulp.dest(paths.dist_lib));
export { copy_lib_task as copy_lib };

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
export { scss_task as scss };

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
export { pug_task as pug };

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
              json(),
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
            name: process.env.npm_package_name,
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
export { rollup_task as rollup };

const build_task = gulp.series(
  clean_task,
  gulp.parallel(copy_image_task, imagemin_webp_task, copy_lib_task),
  gulp.parallel(scss_task, pug_task, rollup_task)
);
export { build_task as build };

const watch_task = () => {
  const watchOptions = {
    useFsEvents: false,
  };
  gulp.watch([`${paths.src_image}**/*`], watchOptions, copy_image_task);
  gulp.watch([`${paths.src_webp}**/*`], watchOptions, imagemin_webp_task);
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
export { watch_task as watch };

export default gulp.series(build_task, watch_task);
