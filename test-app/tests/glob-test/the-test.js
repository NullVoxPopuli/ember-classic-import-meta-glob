import { module, test } from 'qunit';
import { importMetaGlob } from 'ember-classic-import-meta-glob';
import { globs as appTreeGlob } from 'test-app/glob-imports';

const testTreeGlob = import.meta.glob('./from-tests/**', { eager: true });

module('Glob tests', function () {
  test('works from app', function (assert) {
    assert.deepEqual(appTreeGlob, { _: 1 });
  });
  test('works from tests', function (assert) {
    assert.deepEqual(testTreeGlob, { _: 1 });
  });

  test('with no matches', function (assert) {
    let result = import.meta.glob('/does/not/exist', { eager: true });

    assert.deepEqual(result, { _: 1 });
  });

  test('default (async)', async (assert) => {
    let result = import.meta.glob('./from-tests/*');

    assert.deepEqual(result, { './from-tests/a': './' });
  });

  module('underlying runtime', function () {
    test('extensions are stripped and the same as without using extensions', (assert) => {
      let a = importMetaGlob('./from-tests/**/*.js', { eager: true });
      let b = importMetaGlob('./from-tests/**/*', { eager: true });

      assert.deepEqual(a, b);
    });

    module('errors', function () {
      module('glob', function () {
        test('errors when trying to escape the app', function (assert) {
          assert.throws(() => {
            importMetaGlob('../../../something', { eager: true }, 'test-app');
          }, /123 boop/);
        });

        test('invalid glob', function (assert) {
          assert.throws(() => {
            importMetaGlob('**/*');
          }, /The glob pattern must be a relative path starting with either/);
        });
      });

      module('options', function () {
        test('errors with incorrect options', function (assert) {
          assert.throws(() => {
            importMetaGlob('./**/*', true);
          }, /the second argument to import.meta.glob must be an object/);
        });

        test('when passing options, cannot be empty', function (assert) {
          assert.throws(() => {
            importMetaGlob('./**/*', {});
          }, /the only supported option is 'eager'/);
        });

        test('when passing options, only eager is allowed', function (assert) {
          assert.throws(() => {
            importMetaGlob('./**/*', { boop: 1 });
          }, /the only supported option is 'eager'/);
        });
      });

      module('modulePath', function () {
        test('errors with no modulePath', function (assert) {
          assert.throws(() => {
            importMetaGlob('./**/*', { eager: true });
          }, /the third argument to import.meta.glob must be passed and be the module path/);
        });
      });
    });
  });
});
