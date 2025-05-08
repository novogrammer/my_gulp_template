/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import path from "path";
import fs from "fs/promises"
import { existsSync } from "fs";
import { exec } from 'child_process';

const ROOT = path.resolve(__dirname, '..');
const SRC = path.join(ROOT, "src");
const DIST = path.join(ROOT, "dist");

function runAsync(cmd: string, opts: { cwd: string }) {
  return new Promise((resolve, reject) => {
    exec(cmd, opts, (err, stdout, stderr) => {
      if (err) reject(err);
      else resolve({ stdout, stderr });
    });
  });
}

const isTemplate = process.env.npm_package_name === 'my_gulp_template';

// describe を置き換え、package名がmy_gulp_templateの時だけ実行する
const describeIf = isTemplate ? describe : describe.skip;

describeIf('gulp clean', () => {
  test("ファイルが消えることの確認", async () => {
    await fs.mkdir(DIST, { recursive: true });
    await fs.writeFile(path.join(DIST, 'dummy.txt'), 'dummy');
    await runAsync('npx gulp clean', { cwd: ROOT });
    expect(existsSync(path.join(DIST, "dummy.txt"))).toBe(false);
  });
});

describeIf('gulp build', () => {
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

      expect(existsSync(srcFile)).toBe(true);
      expect(existsSync(destFile)).toBe(true);

      const srcStat = await fs.stat(srcFile);
      const destStat = await fs.stat(destFile);
      expect(destStat.size).toBe(srcStat.size);
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

      expect(existsSync(srcFile)).toBe(true);
      expect(existsSync(destFile)).toBe(true);

      // ヘッダ読み込み（先頭12バイトを確認）
      const buffer = await fs.readFile(destFile);
      // 「RIFF」(0–3) と「WEBP」(8–11) のみ検証
      expect(buffer.slice(0, 4).toString('ascii')).toBe('RIFF');
      expect(buffer.slice(8, 12).toString('ascii')).toBe('WEBP');

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

      expect(existsSync(srcFile)).toBe(true);
      expect(existsSync(destFile)).toBe(true);

      // ヘッダ読み込み（先頭12バイトを確認）
      const buffer = await fs.readFile(destFile);
      // 「RIFF」(0–3) と「WEBP」(8–11) のみ検証
      expect(buffer.slice(0, 4).toString('ascii')).toBe('RIFF');
      expect(buffer.slice(8, 12).toString('ascii')).toBe('WEBP');

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

      expect(existsSync(srcFile)).toBe(true);
      expect(existsSync(destFile)).toBe(true);
      const js = await fs.readFile(destFile, 'utf8');
      expect(js).toMatch(/'use strict';/);
    }
  });
  test("htmlが出力されることを確認する", async () => {
    const files = [
      "index.pug",
    ];
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.pug$/, ".html");

      expect(existsSync(srcFile)).toBe(true);
      expect(existsSync(destFile)).toBe(true);
      const html = await fs.readFile(destFile, 'utf8');
      expect(html).toMatch(/<!DOCTYPE html>/);
    }
  });
  test("cssが出力されることを確認する", async () => {
    const files = [
      "style.scss",
    ].map((f) => `assets/css/${f}`);
    for (const file of files) {
      const srcFile = path.join(SRC, file);
      const destFile = path.join(DIST, file).replace(/\.scss$/, ".css");

      expect(existsSync(srcFile)).toBe(true);
      expect(existsSync(destFile)).toBe(true);
      const css = await fs.readFile(destFile, 'utf8');
      expect(css).toMatch(/@charset "UTF-8";/);
    }
  });

});
