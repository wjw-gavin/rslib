import path from 'node:path';
import { buildAndGetResults, getFileBySuffix } from 'test-helper';
import { expect, test } from 'vitest';

test('should handle the crossing case import "@/css/button.css"', async () => {
  const fixturePath = path.resolve(__dirname, './style-path');
  const { contents } = await buildAndGetResults({ fixturePath });
  console.log(contents);
  const esmFiles = Object.keys(contents.esm);
  expect(esmFiles).toMatchInlineSnapshot(`
    [
      "<ROOT>/tests/integration/redirect/style-path/dist/esm/css/index.js",
      "<ROOT>/tests/integration/redirect/style-path/dist/esm/module/index.js",
      "<ROOT>/tests/integration/redirect/style-path/dist/esm/module/index.module.js",
    ]
  `);
  const cssIndexJs = getFileBySuffix(contents.esm, 'css/index.js');
  expect(cssIndexJs).toMatchInlineSnapshot(`
    "import "./index.css";
    "
  `);
  const cssModuleIndexJs = getFileBySuffix(contents.esm, 'module/index.js');
  expect(cssModuleIndexJs).toMatchInlineSnapshot(`
    "import * as __WEBPACK_EXTERNAL_MODULE__index_module_js__ from "./index.module.js";
    __WEBPACK_EXTERNAL_MODULE__index_module_js__["default"];
    "
  `);

  const cjsFiles = Object.keys(contents.cjs);
  expect(cjsFiles).toMatchInlineSnapshot(`
    [
      "<ROOT>/tests/integration/redirect/style-path/dist/cjs/css/index.cjs",
      "<ROOT>/tests/integration/redirect/style-path/dist/cjs/module/index.cjs",
      "<ROOT>/tests/integration/redirect/style-path/dist/cjs/module/index.module.cjs",
    ]
  `);
  const cssIndexCjs = getFileBySuffix(contents.cjs, 'css/index.cjs');
  expect(cssIndexCjs).toContain('require("./index.css")');
  const cssModuleIndexCjs = getFileBySuffix(contents.cjs, 'module/index.cjs');
  expect(cssModuleIndexCjs).toContain('require("./index.module.cjs")');
});
