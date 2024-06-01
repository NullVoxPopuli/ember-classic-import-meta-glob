'use strict';

const path = require('path');
const { hasPlugin, addPlugin } = require('ember-cli-babel-plugin-helpers');
const pluginPath = path.join(__dirname, './babel-plugin.cjs');

module.exports = {
  name: require('./package').name,

  included() {
    this._super.included.apply(this, arguments);

    let parent = this.app || this.parent;

    if (!hasPlugin(parent, pluginPath)) {
      addPlugin(parent, pluginPath);
    }
  },
};
