#!/usr/bin/env node
process.chdir(__dirname);
const required_fields = ['toaq', 'type', 'english'];
let d = require('./../dictionary.json');
d = d.sort((a_, b_) => {
  let a = a_.toaq.toLowerCase();
  let b = b_.toaq.toLowerCase();
  if(a == b) throw new Error(`duplicate entry «${a}»!`);
  return a > b ? 1 : -1;
}).map(({toaq, type, english, gloss, frame, namesake, remarks, examples}) =>
       ({toaq, type, english, gloss, frame, namesake, remarks, examples}));
d.forEach(e => {
  let missing = required_fields.filter(_ => !e[_]);
  if(missing.length)
    console.warn(`«${e.toaq}» doesn't have the following obligatory fields: ${missing.join(', ')}`);
  if(['predicate', 'predicatizer'].includes(e.type) != !!e.frame)
    console.warn(`«${e.toaq}» does${e.frame ? '' : ' not'} have a frame despite being a ${e.type}`);
});
require('fs').writeFileSync('../dictionary.json',
  JSON.stringify(d, null, 2) + '\n');
