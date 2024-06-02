'use strict';
/* global require module */
const { dirname, join, basename } = require('node:path');
const babel = require('@babel/core');

class BABLRGenerator {
  constructor(options) {
    this.options = options;
  }

  get include() {
    return this.options.include || '**/*.macro.js';
  }

  get exclude() {
    return this.options.exclude;
  }

  getDestPath(templatePath) {
    const dir = dirname(templatePath);
    const base = basename(templatePath, '.macro.js');
    return join(dir, `${base}.js`);
  }

  async map(api, change) {
    await api.generate(this.getDestPath(change.path), async ({ destPath }) => {
      const { code: impl } = await babel.transformFileAsync(change.path);

      return impl;
    });
  }
}

module.exports = BABLRGenerator;
