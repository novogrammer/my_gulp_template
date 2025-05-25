/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import {
  runAsync,
  describeIf,
  ROOT
} from './helpers/gulp_test_helpers';

describeIf('npm run fix', () => {
  test("npm run fixが実行できることの確認", async () => {
    await runAsync('npm run fix', { cwd: ROOT });
  }, 10 * 1000);
});
