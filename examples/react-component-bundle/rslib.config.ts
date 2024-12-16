import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      format: 'esm',
      dts: true,
      output: {
        distPath: {
          root: './dist/esm',
        },
      },
    },
    // {
    //   format: 'cjs',
    //   dts: true,
    //   output: {
    //     distPath: {
    //       root: './dist/cjs',
    //     },
    //   },
    // },
  ],
  tools: {
    rspack: {
      output: {
        publicPath: "auto"
      },
      module: {
        generator: {
          asset: {
            publicPath: 'auto',
          },
          "asset/resource": {
            publicPath: 'auto'
          },
        }
      }
    },
  },
  output: {
    target: 'web',
  },
  plugins: [pluginReact(), pluginSass()],
});
