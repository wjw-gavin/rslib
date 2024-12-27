import { defineConfig } from '@rslib/core';
import { generateBundleCjsConfig, generateBundleEsmConfig } from 'test-helper';

export default defineConfig({
  lib: [
    generateBundleEsmConfig({
      bundle: false,
      redirect: {
        style: {
          extension: false,
        },
      },
    }),
    generateBundleCjsConfig({
      bundle: false,
      redirect: {
        style: {
          extension: false,
        },
      },
    }),
  ],
  source: {
    entry: {
      index: ['./src/**', '!./src/**/*.less'],
    },
  },
  output: {
    target: 'web',
    copy: [{ from: './**/*.less', context: './src' }],
  },
});
