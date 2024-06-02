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

    assert.deepEqual(result, { _: 1 });
  });

  module('underlying runtime', function () {
    test('extensions are stripped and the same as without using extensions', (assert) => {
      let a = importMetaGlob('./from-tests/**/*.js', { eager: true });
      let b = importMetaGlob('./from-tests/**/*', { eager: true });

      assert.deepEqual(a, b);
    });
    test('errors when trying to escape the app', function (assert) {
      assert.throws(() => {
        importMetaGlob('../../../something', { eager: true }, 'test-app');
      }, /123 boop/);
    });
    test('errors with no options', function (assert) {
      assert.throws(() => {
        importMetaGlob('**/*');
      }, /123 boop/);
    });
    test('errors with no sourcePath', function (assert) {
      assert.throws(() => {
        importMetaGlob('**/*', { eager: true });
      }, /123 boop/);
    });
  });
});
