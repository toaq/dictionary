#!/usr/bin/env node
process.chdir(__dirname);
require('fs').writeFileSync('../dictionary.json',
  JSON.stringify(require('./../dictionary.json'), null, 2) + '\n');
