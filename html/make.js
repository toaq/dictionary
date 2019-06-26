#!/usr/bin/env node
const fs = require('fs');
const dict = require('./../dictionary.json');
process.chdir(__dirname);

function render_entry(entry) {
  let attributes = [];
  function attr(k, v) {
    attributes.push(`<li><span class="attribute">${k}</span> <span class="value">${v}</span></li>`);
  }
  let frame_name = frame_names[entry.frame];
  if(!frame_name) {
    if(entry.frame !== undefined)
      throw new Error(`frame ‘${entry.frame}’ from entry «${entry.toaq}» does not have a namesake`);
  } else attr('frame', `${frame_name} (${entry.frame})`);
  if(entry.examples && entry.examples.length) {
    let maples = entry.examples.map(({toaq, english}) =>
      `<li><span class="toaq">${toaq}</span> <span class="english">${english}</span></li>`);
    attr('examples', `<ul class="examples">${maples.join(' ')}</ul>`);
  }
  if(entry.gloss) gl = ` <span class="gloss">‘${entry.gloss}’</span>`;
  return `<div class="entry"><div class="header"><span class="toaq">${entry.toaq}</span> <span class="type">${entry.type}</span>${gl || ''}</div> <div class="content">${entry.english}</div> <ul class="footer">${attributes.join(' ')}</ul></div>`;
}

const template = fs.readFileSync('template.html').toString();

let frame_names = {};
for([k, v] of dict
  .filter(_ => _.namesake)
  .map(_ => [_.frame, _.toaq.toUpperCase()]))
  if(!frame_names[k])
    frame_names[k] = v;
  else throw new Error(`frame ‘${k}’ has two conflicting names: «${frame_names[k]}» and «${v}»`);

fs.writeFileSync('dictionary.html',
  template.replace(/\ *%%%/, (_) =>
    dict.map(render_entry)
      .join('\n')
      .replace(/▯/g, '___')));
