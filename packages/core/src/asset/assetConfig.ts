import type { RsbuildConfig } from '@rsbuild/core';
import type { Format } from '../types';

export const composeAssetConfig = (
  bundle: boolean,
  format: Format,
): RsbuildConfig => {
  if (format === 'esm' || format === 'cjs') {
    if (bundle) {
      return {
        output: {
          dataUriLimit: 0, // default: no inline asset
          // assetPrefix: 'auto', // TODO: will turn on this with js support together in the future
        },
        tools: {
          rspack: {
            module: {
              generator: {
                asset: {
                  publicPath: 'auto',
                  experimentalLibPreserveImport: true,
                },
              },
            },
          },
        },
      };
    }
    // TODO: bundleless
    return {
      output: {
        dataUriLimit: 0, // default: no inline asset
        assetPrefix: 'auto',
      },
      tools: {
        rspack: {
          module: {
            generator: {
              asset: {
                publicPath: 'auto',
                experimentalLibReExport: true,
              },
            },
          },
        },
      },
    };
  }

  // mf and umd etc
  return {};
};
