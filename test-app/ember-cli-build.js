'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    autoImport: {
      watchDependencies: ['ember-classic-import-meta-glob'],
      allowAppImports: ['allow-app-imports/*'],
    },
  });

  return app.toTree();
};
