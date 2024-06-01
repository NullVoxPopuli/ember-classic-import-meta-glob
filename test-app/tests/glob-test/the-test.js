import { module, test } from 'qunit';
import { importMetaGlob } from 'ember-classic-import-meta-glob';
import { globs as appTreeGlob } from 'test-app/glob-imports';

const testTreeGlob = import.meta.glob('./from-tests/**', { eager: true });

module('Glob tests', function (hooks) {
  test('works from app', function (assert) {
    assert.deepEqual(appTreeGlob, {});
  });
  test('works from tests', function (assert) {
    assert.deepEqual(testTreeGlob, {});
  });
  test('with no matches', function (assert) {
    let result = import.meta.glob('/does/not/exist', { eager: true });

    assert.deepEqual(result, {});
  });

  module('underlying runtime', function () {
    test('errors with no options', function (assert) {
      assert.throws(() => {
        importMetaGlob('**/*');
      }, 'boop');
    });
    test('errors with no sourcePath', function (assert) {
      assert.throws(() => {
        importMetaGlob('**/*', { eager: true });
      }, 'boop');
    });
  });
});
