#!/usr/bin/env node
// Synthesise the HTML document from the JSON database using the
// template at `./template.html`, outputting to `./dictionary.html`.

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
  let english = entry.english;
  if(entry.distribution) {
    english = english.split('; ');
    let e = entry.distribution.split('; ').pop().split(' ');
    let last_english = english.pop().split('▯')
      .map((part, i) => {
        if(i == e.length) return part;
        return part + `▯<sub class="distribution">${e[i]}</sub>`;
      }).join('');
    english.push(last_english);
    english = english.join('; ');
  }
  if(entry.examples && entry.examples.length) {
    let maples = entry.examples.map(({toaq, english}) =>
      `<li><span class="toaq">${toaq}</span> <span class="english">${english}</span></li>`);
    attr('examples', `<ul class="examples">${maples.join(' ')}</ul>`);
  }
  if(entry.fields && entry.fields.length)
    entry.fields = entry.fields.map((_, i) =>
      '<span class="toaq">' +
      _.map((s, i) => s.replace(/[auıoe]/,
        m => ((m == 'ı' ? 'i' : m) + '\u0309').normalize('NFC'))).join(' ra ')
      + ' dó' + ['shī', 'gū', 'sāq', 'jō', 'fē', 'cī'][i] + '</span>');
  for(f of ['notes', 'keywords', 'fields'])
    if(entry[f] && entry[f].length)
      attr(f, `<ul class="notes"><li>${entry[f].join('</li> <li>')}</li></ul>`);
  if(entry.gloss) gl = ` <span class="gloss">‘${entry.gloss}’</span>`;
  return `<div class="entry"><div class="header"><span class="toaq">${entry.toaq}</span> <span class="type">${entry.type}</span>${gl || ''}</div> <div class="content">${english}</div> <ul class="footer">${attributes.join(' ')}</ul></div>`;
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
