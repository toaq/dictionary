#!/usr/bin/env node
const fs = require('fs');
const dict = require('./../dictionary.json');
process.chdir(__dirname);

function render_entry([name, entry]) {
  let frame_name = frame_names[entry.frame];
  if(!frame_name)
    if(entry.frame === undefined)
      console.log(`Note: «${name}» has no frame assigned to it`);
    else throw new Error(`frame ‘${entry.frame}’ from entry «${name}» does not have a namesake`);
  if(entry.frame === null)
    entry.frame = 'not applicable';
  return `\
<div class="entry">
  <div class="header">
    <span class="toaq">${name}</span>
    <span class="gloss">${entry.gloss}</span>
  </div>
  <div class="content">
    <span class="english">${entry.english}</span>
  </div>
  <div class="footer">
    <span class="frame">${frame_name}</span>
    <span class="signature">(${entry.frame})</span>
  </div>
</div>`;
}

const template = fs.readFileSync('template.html').toString();

let frame_names = {};
for([k, v] of Object.entries(dict)
  .filter(_ => _[1].namesake)
  .map(_ => [_[1].frame, _[0].toUpperCase()]))
  if(!frame_names[k])
    frame_names[k] = v;
  else throw new Error(`frame ‘${k}’ has two conflicting names: «${frame_names[k]}» and «${v}»`);

fs.writeFileSync('dictionary.html',
  template.replace(/(\ *)%%%/, (_, spaces) =>
    Object.entries(dict).map(render_entry)
      .join('\n').split('\n')
      .map(_ => spaces + _).join('\n')));
