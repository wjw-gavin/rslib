import { pluginReact } from '@rsbuild/plugin-react';
import { pluginSass } from '@rsbuild/plugin-sass';
import { type LibConfig, defineConfig } from '@rslib/core';

export default defineConfig({
  source: {
    entry: {
      index: ['./src/**', '!./src/env.d.ts'],
    },
  },
  lib: [
    {
      format: 'esm',
      bundle: false,
      dts: true,
      output: {
        distPath: {
          root: './dist/esm',
        },
      },
    },
    {
      format: 'cjs',
      bundle: false,
      dts: true,
      output: {
        distPath: {
          root: './dist/cjs',
        },
      },
    },
  ],
  output: {
    target: 'web',
  },
  plugins: [pluginReact(), pluginSass()],
  tools: {
    bundlerChain(chain, { CHAIN_ID, }) {
      // chain.module.rule(CHAIN_ID.RULE.SVG).clear();
      // chain.module.rule(CHAIN_ID.RULE.SVG).use('123').([{
      //   test: /\.svg$/i,
      //   oneOf: [
      //     /* config.module.rule('svg').oneOf('svg-asset-url') */
      //     {
      //       type: 'asset/resource',
      //       resourceQuery: /(__inline=false|url)/,
      //       generator: {
      //         filename: 'static/svg/[name].svg'
      //       }
      //     },
      //     /* config.module.rule('svg').oneOf('svg-asset-inline') */
      //     {
      //       type: 'asset/inline',
      //       resourceQuery: /inline/
      //     },
      //     /* config.module.rule('svg').oneOf('svg-asset') */
      //     {
      //       type: 'asset',
      //       parser: {
      //         dataUrlCondition: {
      //           maxSize: 4096
      //         }
      //       },
      //       generator: {
      //         filename: 'static/svg/[name].svg'
      //       }
      //     }
      //   ]
      // } as any]);
    }
  },
});
