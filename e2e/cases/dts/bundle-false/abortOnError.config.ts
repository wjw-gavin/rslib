import { generateBundleCjsConfig, generateBundleEsmConfig } from '@e2e/helper';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    generateBundleEsmConfig(__dirname, {
      bundle: false,
      dts: {
        bundle: false,
        distPath: './dist/error',
        abortOnError: false,
      },
    }),
    generateBundleCjsConfig(__dirname, {
      bundle: false,
    }),
  ],
  source: {
    entry: {
      main: ['./src-error/**'],
    },
    tsconfigPath: 'tsconfig-error.json',
  },
});
