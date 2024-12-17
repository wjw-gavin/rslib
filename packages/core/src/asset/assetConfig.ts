import { RsbuildConfig } from "@rsbuild/core";

export const composeAssetConfig = (
  bundle: boolean,
): RsbuildConfig => {
  if (bundle) {
    return {
      tools: {
        rspack: {
          output: {
            publicPath: "auto"
          },
          module: {
            generator: {
              asset: {
                publicPath: 'auto',
                experimentalLibPreserveImport: true,
              }
            }
          }
        },
      }
    };
  } 


  return {
      tools: {
        rspack: {
          output: {
            publicPath: "auto"
          },
          module: {
            generator: {
              asset: {
                publicPath: 'auto',
                experimentalLibReExport: true,
              }
            }
          }
        },
      }
    };

};