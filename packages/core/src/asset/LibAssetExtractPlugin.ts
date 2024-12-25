import assert from 'node:assert';
import { type Rspack, rspack } from '@rsbuild/core';
import { getUndoPath } from '../css/utils';

/**
 * these codes is written according to
 * https://github.com/web-infra-dev/rspack/blob/61f0cd2b4e313445a9d3329ca71240e99edfb352/crates/rspack_plugin_asset/src/lib.rs#L531
 */

// 1. bundleless: single file
const BUNDLELESS_ASSET_PATTERN: RegExp =
  /__webpack_require__\.p\s\+\s["'](.+)["']/g;
const RSLIB_NAMESPACE_OBJECT = '__rslib_asset__';
const esmSingleFileTemplate = (
  url: string,
) => `import ${RSLIB_NAMESPACE_OBJECT} from '${url}';
export default ${RSLIB_NAMESPACE_OBJECT};`;
const cjsSingleFileTemplate = (url: string) =>
  `module.exports = require('${url}');`;

function extractAssetFilenames(content: string): string[] {
  return [...content.matchAll(BUNDLELESS_ASSET_PATTERN)]
    .map((i) => {
      return i?.[1];
    })
    .filter(Boolean) as string[];
}

// 2. bundle: concatenated
const CONCATENATED_PATTERN: RegExp =
  /(const|var) (\w+) = __webpack_require__\.p\s\+\s["'](.+)["']/g;
const concatenatedEsmReplaceTemplate = (variableName: string, url: string) =>
  `import ${variableName} from '${url}';`;
const concatenatedCjsReplaceTemplate = (
  declarationKind: string,
  variableName: string,
  url: string,
) => `${declarationKind} ${variableName} = require('${url}');`;

// 3. bundle: not concatenated, in __webpack_require__.m
const NOT_CONCATENATED_PATTERN: RegExp =
  /module\.exports = __webpack_require__\.p\s\+\s["'](.+)["']/g;
const nonConcatenatedReplaceTemplate = (url: string) =>
  `module.exports = require('${url}');`;

const pluginName = 'LIB_ASSET_EXTRACT_PLUGIN';

type Options = {
  // just for perf, in bundleless we can replace the entire file
  bundle: boolean;
};

class LibAssetExtractPlugin implements Rspack.RspackPluginInstance {
  readonly name: string = pluginName;
  options: Options;
  constructor(options: Options) {
    this.options = options;
  }

  apply(compiler: Rspack.Compiler): void {
    compiler.hooks.make.tap(pluginName, (compilation) => {
      compilation.hooks.processAssets.tap(pluginName, (assets) => {
        const chunkAsset = Object.keys(assets).filter((name) =>
          /js$/.test(name),
        );
        for (const name of chunkAsset) {
          const isEsmFormat = compilation.options.output.module;
          const undoPath = getUndoPath(
            name,
            compilation.outputOptions.path!,
            true,
          );
          compilation.updateAsset(name, (old) => {
            const oldSource = old.source().toString();

            if (this.options.bundle === false) {
              const assetFilenames = extractAssetFilenames(oldSource);
              if (assetFilenames.length === 0) {
                return old;
              }
              assert(
                assetFilenames.length === 1,
                `in bundleless mode, each asset file should only generate one js module, but generated ${assetFilenames}, ${oldSource}`,
              );
              const assetFilename = assetFilenames[0];
              let newSource = '';
              const url = `${undoPath}${assetFilename}`;

              if (isEsmFormat) {
                newSource = esmSingleFileTemplate(url);
              } else {
                newSource = cjsSingleFileTemplate(url);
              }
              return new rspack.sources.RawSource(newSource);
            }

            const newSource = new rspack.sources.ReplaceSource(old);
            function replace(
              pattern: RegExp,
              replacer: (match: RegExpMatchArray) => string,
            ) {
              const matches = oldSource.matchAll(pattern);
              for (const match of matches) {
                const replaced = replacer(match);
                newSource.replace(
                  match.index,
                  match.index + match[0].length - 1,
                  replaced,
                );
              }
            }
            replace(CONCATENATED_PATTERN, (match) => {
              const declarationKind = match[1];
              const variableName = match[2];
              const url = `${undoPath}${match[3]}`;
              return isEsmFormat
                ? concatenatedEsmReplaceTemplate(variableName!, url)
                : concatenatedCjsReplaceTemplate(
                    declarationKind!,
                    variableName!,
                    url,
                  );
            });
            replace(NOT_CONCATENATED_PATTERN, (match) => {
              const url = `${undoPath}${match[1]}`;
              return nonConcatenatedReplaceTemplate(url);
            });
            return newSource;
          });
        }
      });
    });
  }
}
export { LibAssetExtractPlugin };
