import { module, test, skip } from 'qunit';
import { globs as appTreeGlob } from 'test-app/glob-imports';
import { globs as allowAppImports } from 'test-app/allow-app-imports';

const testTreeGlob = import.meta.glob('./from-tests/**', { eager: true });

module('from the app tree', function () {
  test('works from app', function (assert) {
    let keys = Object.keys(appTreeGlob);
    assert.deepEqual(keys, ['./from-app/a', './from-app/b', './from-app/c']);
    assert.strictEqual(appTreeGlob['./from-app/a'].a, 'a1');
    assert.strictEqual(appTreeGlob['./from-app/b'].b, 'b1');
    assert.strictEqual(appTreeGlob['./from-app/c'].c, 'c1');
  });

  /**
   * Can't test this atm, because await import()
   * in our runtime code is not allowed to receive a
   * dynamic string.
   *
   * The interface of the returned object should match
   * the real implementation in vite/babel/etc
   */
  skip('default (async) w/ app-imports', async (assert) => {
    let keys = Object.keys(allowAppImports);
    assert.deepEqual(keys, [
      './allow-app-imports/a',
      './allow-app-imports/b',
      './allow-app-imports/c',
    ]);

    assert.strictEqual((await allowAppImports['./from-tests/a']()).a, 'a1');
    assert.strictEqual((await allowAppImports['./from-tests/b']()).b, 'b1');
    assert.strictEqual((await allowAppImports['./from-tests/c']()).c, 'c1');
  });
});

module('from the test tree', function () {
  test('works from tests', function (assert) {
    let keys = Object.keys(testTreeGlob);
    assert.deepEqual(keys, [
      './from-tests/a',
      './from-tests/b',
      './from-tests/c',
    ]);
    assert.strictEqual(appTreeGlob['./from-app/a'].a, 'a1');
    assert.strictEqual(appTreeGlob['./from-app/b'].b, 'b1');
    assert.strictEqual(appTreeGlob['./from-app/c'].c, 'c1');
  });
});

module('from this file', function () {
  test('with no matches', function (assert) {
    let result = import.meta.glob('./does/not/exist', { eager: true });

    assert.strictEqual(Object.keys(result).length, 0);
    assert.deepEqual(result, {});
  });

  test('with ../', function (assert) {
    let result = import.meta.glob('../../from-app/**');

    assert.strictEqual(Object.keys(result).length, 3);
    assert.deepEqual(Object.keys(result), [
      'test-app/from-app/a',
      'test-app/from-app/b',
      'test-app/from-app/c',
    ]);
  });

  test('default (async)', async (assert) => {
    let result = import.meta.glob('./from-tests/*');

    let keys = Object.keys(result);
    assert.deepEqual(keys, [
      './from-tests/a',
      './from-tests/b',
      './from-tests/c',
    ]);

    assert.strictEqual((await result['./from-tests/a']()).a, 'a1');
    assert.strictEqual((await result['./from-tests/b']()).b, 'b1');
    assert.strictEqual((await result['./from-tests/c']()).c, 'c1');
  });
});
