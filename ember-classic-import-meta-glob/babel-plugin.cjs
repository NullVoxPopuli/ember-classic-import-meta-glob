const { ImportUtil } = require('babel-import-util');
const { callExpression, stringLiteral } = require('@babel/types');

// DEBUG:
// https://astexplorer.net/#/gist/a72d97261099f82aac7be47112f66158/7e984bd728c0a4e9af4911b065f776aa21d68a7d
module.exports = function (babel) {
  return {
    name: 'transform-import-meta-glob-for-ember-classic',
    visitor: {
      Program: {
        enter(path, state) {
          state.importUtil = new ImportUtil(babel, path);
        },
      },
      CallExpression(path, state) {
        if (path.node.callee?.object?.type !== 'MetaProperty') return;
        if (path.node.callee.property.name !== 'glob') return;

        let args = path.node.arguments;

        let { cwd, filename, importUtil } = state;
        let relative = filename.replace(new RegExp(`^${cwd}/`), '');

        importUtil.replaceWith(path, (i) =>
          callExpression(
            i.import('ember-classic-import-meta-glob', 'importMetaGlob'),
            [...args, stringLiteral(relative)],
          ),
        );
      },
    },
  };
};
