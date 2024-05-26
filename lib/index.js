'use strict';
/* global require module */
const { dirname, join, basename } = require('path');
const babel = require('@babel/core');
const completeExtname = require('path-complete-extname');

class BABLRGenerator {
  constructor(options) {
    this.options = options;
  }

  get include() {
    return this.options.include;
  }

  get exclude() {
    return this.options.exclude;
  }

  getDestPath(templatePath) {
    const dir = dirname(templatePath);
    const ext = completeExtname(templatePath);
    const base = basename(templatePath, ext);
    const destName = this.getDestName(base, ext);
    return join(dir, destName);
  }

  getDestName(starMatch, ext) {
    return `${starMatch}.generated${ext}`;
  }

  async map(api, change) {
    await api.generate(this.getDestPath(change.path), async ({ destPath }) => {
      const { code: impl } = await babel.transformFileAsync(change.path);

      return impl;
    });
  }
}

module.exports = BABLRGenerator;
