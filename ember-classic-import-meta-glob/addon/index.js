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
    `The first argument to import.meta.glob must be a string`,
    typeof glob === 'string',
  );
  assert(
    `The glob pattern must be a relative path starting with either ./ or ../. Received: ${glob}`,
    glob.startsWith('./') || glob.startsWith('../'),
  );
  assert(
    `the second argument to import.meta.glob must be an object`,
    typeof options === 'object',
  );
  assert(
    `the only supported option is 'eager'. Received: ${Object.keys(options)}`,
    Object.keys(options).length === 1 && 'eager' in options,
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

  // TODO: drop the extensions, since at runtime, we don't have them.
  let globsArray = Array.isArray(glob) ? glob : [glob];
  let fullGlobs = globsArray.map((g) => {
    return `${currentDir}/${g.replace(/^.\//, '')}`;
  });
  let isMatch = pico(fullGlobs);
  let matches = allModules.filter(isMatch);

  console.log({ fullGlobs, matches, currentDir });

  // TODO: assert: cannot escape the app.
  //       (too many ../../../../)

  let result = {};

  for (let match of matches) {
    let key = match.replace(`${currentDir}/`, './');

    result[key] = requirejs(match);
  }

  return result;
}
