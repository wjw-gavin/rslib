import path from 'node:path';
import { buildAndGetResults, getFileBySuffix } from 'test-helper';
import { expect, test } from 'vitest';

test('should extract css successfully when using redirect.style = false', async () => {
  const fixturePath = path.resolve(__dirname, './style-extension');
  const { contents } = await buildAndGetResults({ fixturePath });
  const esmFiles = Object.keys(contents.esm);
  expect(esmFiles).toMatchInlineSnapshot(`
    [
      "<ROOT>/tests/integration/redirect/style-extension/dist/esm/less/index.js",
      "<ROOT>/tests/integration/redirect/style-extension/dist/esm/module/index.js",
    ]
  `);
  const lessIndexJs = getFileBySuffix(contents.esm, 'less/index.js');
  expect(lessIndexJs).toMatchInlineSnapshot(`
    "import "./index.less";
    "
  `);
  const lessModuleIndexJs = getFileBySuffix(contents.esm, 'module/index.js');
  expect(lessModuleIndexJs).toMatchInlineSnapshot(`
    "import * as __WEBPACK_EXTERNAL_MODULE__index_module_less__ from "./index.module.less";
    __WEBPACK_EXTERNAL_MODULE__index_module_less__["default"];
    "
  `);

  const cjsFiles = Object.keys(contents.cjs);
  expect(cjsFiles).toMatchInlineSnapshot(`
    [
      "<ROOT>/tests/integration/redirect/style-extension/dist/cjs/less/index.cjs",
      "<ROOT>/tests/integration/redirect/style-extension/dist/cjs/module/index.cjs",
    ]
  `);
  const lessIndexCjs = getFileBySuffix(contents.cjs, 'less/index.cjs');
  expect(lessIndexCjs).toContain('require("./index.less");');
  const lessModuleIndexCjs = getFileBySuffix(contents.cjs, 'module/index.cjs');
  expect(lessModuleIndexCjs).toContain('require("./index.module.less")');
});
