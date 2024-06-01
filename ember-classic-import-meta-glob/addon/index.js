/* globals requirejs */
import { assert } from '@ember/debug';

import pico from 'picomatch';

/**
 * Only supported usage:
 * import.meta.glob('./*.svelte', { eager: true} )
 *
 * @param {string} glob
 * @param {{ eager: true }} glob
 * @param {string} modulePath file path prefixed with the module name, not CWD
 */
export function importMetaGlob(glob, options, modulePath) {
  assert(
    `the second argument to import.meta.glob must be passed and set to { eager: true }`,
    options && options.eager === true,
  );
  assert(
    `the third argument to import.meta.glob must be passed and be the module path. This is filled in automatically via the babel plugin. If you're seeing this something has gone wrong with installing the babel plugin`,
    modulePath,
  );

  // WARNING: If you're reading this, know that requirejs is not public API.
  //          Using it WILL make your upgrades harder in the future.
  //          If you use this in your own code you aren't allowed to complain about upgrade
  //          problems 😛
  let allModules = Object.keys(requirejs.entries);
  /**
   * 1. determine the directory the file is in.
   * 2. prepend that directory to the glob(s) (because requirejs uses full module paths)
   * 3. filter
   * 4. chop off the directory from the results to match the same relativeness
   *
   */
  let [, ...reversedParts] = modulePath.split('/').reverse();
  let currentDir = reversedParts.reverse().join('/');

  let fullGlobs = Array.isArray(glob)
    ? glob.map((g) => `${currentDir}${g}`)
    : [`${modulePath}${glob}`];
  let isMatch = pico(fullGlobs);
  let matches = allModules.filter(isMatch);

  let result = {};

  for (let match of matches) {
    result[match] = requirejs(match);
  }

  return result;
}
