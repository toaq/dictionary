#!/usr/bin/env node
const fs = require('fs');
const dict = require('./../dictionary.json');
process.chdir(__dirname);

function render_entry([name, entry]) {
  return `\
<div class="entry">
  <div class="header">
    <span class="toaq">${name}</span>
    <span class="gloss">${entry.gloss}</span>
  </div>
  <div class="content">
    <span class="toaq">${entry.english}</span>
  </div>
  <div class="footer">
    <span class="frame">${entry.frame}</span>
  </div>
</div>`;
}

const template = fs.readFileSync('template.html').toString();

fs.writeFileSync('dictionary.html',
  template.replace(/(\ *)%%%/, (_, spaces) =>
    Object.entries(dict).map(render_entry)
      .join('\n').split('\n')
      .map(_ => spaces + _).join('\n')));
