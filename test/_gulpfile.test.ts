/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import path from "path";
import fs from "fs/promises";
import { existsSync } from "fs";
import {
  runAsync,
  describeIfTemplate,
  ROOT,
  SRC,
  DIST,
  expectFileExists,
  expectFileSizeEqualAsync,
  expectIsWebPFormatAsync,
  expectIsJavaScriptAsync,
  expectIsHTMLAsync,
  expectIsCSSAsync
} from './helpers/gulp_test_helpers';

describeIfTemplate('gulp clean_task', () => {
  test("ファイルが消えることの確認", async () => {
    await fs.mkdir(DIST, { recursive: true });
    await fs.writeFile(path.join(DIST, 'dummy.txt'), 'dummy');
    await runAsync('npx gulp clean', { cwd: ROOT });
    expect(existsSync(path.join(DIST, "dummy.txt"))).toBe(false);
  });
});

describeIfTemplate('gulp copy_image_task', () => {
  beforeAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
    await runAsync('npx gulp copy_image', { cwd: ROOT });
  });
  afterAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
  });

  test("画像のコピーを確認する", async () => {
    const files = [
      "dummy/dummy-images__image--image01.png",
      "dummy/dummy-images__image--image02.png",
      "dummy/dummy-images__image--image03.png",
      "dummy2/dummy-images__image--image01.jpg",
      "dummy2/dummy-images__image--image02.jpg",
      "dummy2/dummy-images__image--image03.jpg",
    ].map((f) => `assets/img/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file);

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectFileSizeEqualAsync(srcFile, destFile);
    }
  });
});

describeIfTemplate('gulp imagemin_webp', () => {
  beforeAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
    await runAsync('npx gulp imagemin_webp', { cwd: ROOT });
  }, 10 * 1000);
  afterAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
  });

  test("pngのwebp変換を確認する", async () => {
    const files = [
      "dummy/dummy-images__image--image01.png",
      "dummy/dummy-images__image--image02.png",
      "dummy/dummy-images__image--image03.png",
    ].map((f) => `assets/img/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.png$/, ".webp");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsWebPFormatAsync(destFile);
    }
  });

  test("jpgのwebp変換を確認する", async () => {
    const files = [
      "dummy2/dummy-images__image--image01.jpg",
      "dummy2/dummy-images__image--image02.jpg",
      "dummy2/dummy-images__image--image03.jpg",
    ].map((f) => `assets/img/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.jpg$/, ".webp");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsWebPFormatAsync(destFile);
    }
  });
});

describeIfTemplate('gulp copy_lib_task', () => {
  beforeAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
    await runAsync('npx gulp copy_lib', { cwd: ROOT });
  });
  afterAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
  });

  test("libファイルのコピーを確認する", async () => {
    const files = [
      "dummy/dummy.js",
    ].map((f) => `assets/lib/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file);

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectFileSizeEqualAsync(srcFile, destFile);
    }
  });
});

describeIfTemplate('gulp scss', () => {
  beforeAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
    await runAsync('npx gulp copy_image', { cwd: ROOT });
    await runAsync('npx gulp scss', { cwd: ROOT });
  }, 15 * 1000);
  afterAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
  });

  test("cssが出力されることを確認する", async () => {
    const files = [
      "style.scss",
    ].map((f) => `assets/css/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.scss$/, ".css");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsCSSAsync(destFile);
    }
  });

  test("_から始まるscssファイルが処理されないことを確認する", async () => {
    const testFile = "assets/css/global/_variables.scss";
    const srcFile = path.join(SRC, testFile);
    const destFile = path.join(DIST, testFile).replace(/\.scss$/, ".css");

    expectFileExists(srcFile);
    expect(existsSync(destFile)).toBe(false);
  });
});

describeIfTemplate('gulp pug', () => {
  beforeAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
    await runAsync('npx gulp pug', { cwd: ROOT });
  }, 10 * 1000);
  afterAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
  });

  test("htmlが出力されることを確認する", async () => {
    const files = [
      "index.pug",
    ];
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.pug$/, ".html");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsHTMLAsync(destFile);
    }
  });

  test("_から始まるpugファイルが処理されないことを確認する", async () => {
    const testFile = "_base.pug";
    const srcFile = path.join(SRC, testFile);
    const destFile = path.join(DIST, testFile).replace(/\.pug$/, ".html");

    expectFileExists(srcFile);
    expect(existsSync(destFile)).toBe(false);
  });
});

describeIfTemplate('gulp rollup', () => {
  beforeAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
    await runAsync('npx gulp rollup', { cwd: ROOT });
  }, 20 * 1000);
  afterAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
  });

  test("jsが出力されることを確認する", async () => {
    const files = [
      "bundle.js",
      "common.ts",
      "index.js",
    ].map((f) => `assets/js/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.ts$/, ".js");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsJavaScriptAsync(destFile);
    }
  });

  test("_から始まるjsファイルが処理されないことを確認する", async () => {
    const testFile = "assets/js/_constants.js";
    const srcFile = path.join(SRC, testFile);
    const destFile = path.join(DIST, testFile);

    expectFileExists(srcFile);
    expect(existsSync(destFile)).toBe(false);
  });
});

describeIfTemplate('gulp build', () => {
  beforeAll(async () => {
    await runAsync('npx gulp build', { cwd: ROOT });
  }, 20 * 1000);
  afterAll(async () => {
    await runAsync('npx gulp clean', { cwd: ROOT });
  });

  test("画像のコピーを確認する", async () => {
    const files = [
      "dummy/dummy-images__image--image01.png",
      "dummy/dummy-images__image--image02.png",
      "dummy/dummy-images__image--image03.png",
      "dummy2/dummy-images__image--image01.jpg",
      "dummy2/dummy-images__image--image02.jpg",
      "dummy2/dummy-images__image--image03.jpg",
    ].map((f) => `assets/img/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file);

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectFileSizeEqualAsync(srcFile, destFile);
    }
  });
  test("pngのwebp変換を確認する", async () => {
    const files = [
      "dummy/dummy-images__image--image01.png",
      "dummy/dummy-images__image--image02.png",
      "dummy/dummy-images__image--image03.png",
    ].map((f) => `assets/img/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.png$/, ".webp");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsWebPFormatAsync(destFile);
    }
  });
  test("jpgのwebp変換を確認する", async () => {
    const files = [
      "dummy2/dummy-images__image--image01.jpg",
      "dummy2/dummy-images__image--image02.jpg",
      "dummy2/dummy-images__image--image03.jpg",
    ].map((f) => `assets/img/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.jpg$/, ".webp");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsWebPFormatAsync(destFile);
    }
  });
  test("jsが出力されることを確認する", async () => {
    const files = [
      "bundle.js",
      "common.ts",
      "index.js",
    ].map((f) => `assets/js/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.ts$/, ".js");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsJavaScriptAsync(destFile);
    }
  });
  test("htmlが出力されることを確認する", async () => {
    const files = [
      "index.pug",
    ];
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.pug$/, ".html");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsHTMLAsync(destFile);
    }
  });
  test("cssが出力されることを確認する", async () => {
    const files = [
      "style.scss",
    ].map((f) => `assets/css/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.scss$/, ".css");

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectIsCSSAsync(destFile);
    }
  });
  test("libファイルのコピーを確認する", async () => {
    const files = [
      "dummy/dummy.js",
    ].map((f) => `assets/lib/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file);

      expectFileExists(srcFile);
      expectFileExists(destFile);
      await expectFileSizeEqualAsync(srcFile, destFile);
    }
  });

  describe("html-validate", () => {
    test("html-validateが実行できることの確認", async () => {
      await runAsync('npm run html-validate', { cwd: ROOT });
    })
  })

});
