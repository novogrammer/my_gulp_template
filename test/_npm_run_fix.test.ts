/* eslint-disable no-await-in-loop */
/* eslint-disable no-restricted-syntax */

import {
  runAsync,
  describeIfTemplate,
  ROOT
} from './helpers/gulp_test_helpers';

describeIfTemplate('npm run fix', () => {
  test("npm run fixが実行できることの確認", async () => {
    await runAsync('npm run fix', { cwd: ROOT });
  }, 10 * 1000);
});
