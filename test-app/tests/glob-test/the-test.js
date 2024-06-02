import { module, test } from 'qunit';
import { importMetaGlob } from 'ember-classic-import-meta-glob';
import { globs as appTreeGlob } from 'test-app/glob-imports';

const testTreeGlob = import.meta.glob('./from-tests/**', { eager: true });

const HERE = 'test-app/tests/glob-test/the-test';

module('Glob tests', function () {
  test('works from app', function (assert) {
    let keys = Object.keys(appTreeGlob);
    assert.deepEqual(keys, ['./from-app/a', './from-app/b', './from-app/c']);
    assert.strictEqual(appTreeGlob['./from-app/a'].a, 'a1');
    assert.strictEqual(appTreeGlob['./from-app/b'].b, 'b1');
    assert.strictEqual(appTreeGlob['./from-app/c'].c, 'c1');
  });

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

  test('with no matches', function (assert) {
    let result = import.meta.glob('./does/not/exist', { eager: true });

    assert.strictEqual(Object.keys(result).length, 0);
    assert.deepEqual(result, {});
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

  module('underlying runtime', function () {
    test('extensions are stripped and the same as without using extensions', (assert) => {
      let a = importMetaGlob('./from-tests/**/*.js', { eager: true }, HERE);
      let b = importMetaGlob('./from-tests/**/*', { eager: true }, HERE);

      assert.deepEqual(Object.keys(a), Object.keys(b));
      assert.deepEqual(Object.values(a)[0].a, Object.values(b)[0].a);
      assert.deepEqual(Object.values(a)[1].b, Object.values(b)[1].b);
      assert.deepEqual(Object.values(a)[2].c, Object.values(b)[2].c);
    });

    module('errors', function () {
      module('glob', function () {
        test('errors when trying to escape the app', function (assert) {
          assert.throws(() => {
            importMetaGlob('../../../something', { eager: true }, HERE);
          }, /Cannot have a path that escapes the app/);
        });

        test('errors when a sibling path tries to escape the app', function (assert) {
          assert.throws(() => {
            importMetaGlob(
              './from-tests/../../../../something',
              { eager: true },
              HERE,
            );
          }, /Cannot have a path that escapes the app/);
        });

        test('invalid glob', function (assert) {
          assert.throws(() => {
            importMetaGlob('**/*', HERE);
          }, /The glob pattern must be a relative path starting with either/);
        });
      });

      module('options', function () {
        test('errors with incorrect options', function (assert) {
          assert.throws(() => {
            importMetaGlob('./**/*', true, HERE);
          }, /the second argument to import.meta.glob must be an object/);
        });

        test('when passing options, cannot be empty', function (assert) {
          assert.throws(() => {
            importMetaGlob('./**/*', {}, HERE);
          }, /the only supported option is 'eager'/);
        });

        test('when passing options, only eager is allowed', function (assert) {
          assert.throws(() => {
            importMetaGlob('./**/*', { boop: 1 }, HERE);
          }, /the only supported option is 'eager'/);
        });
      });

      module('modulePath', function () {
        test('errors with no modulePath', function (assert) {
          assert.throws(() => {
            importMetaGlob('./**/*', { eager: true });
          }, /the third argument to import.meta.glob must be passed and be the module path/);
        });

        test(`errors with wrong path (can't be the entrypoint)`, function (assert) {
          assert.throws(() => {
            importMetaGlob('../../../something', { eager: true }, 'test-app');
          }, /not a valid path/);
        });
      });
    });
  });
});
