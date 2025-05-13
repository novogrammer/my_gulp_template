/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import path from "path";
import { exec } from 'child_process';

const ROOT = path.resolve(__dirname, '..');

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

describeIf('npm run fix', () => {
  test("npm run fixが実行できることの確認", async () => {
    await runAsync('npm run fix', { cwd: ROOT });
  }, 10 * 1000);
});