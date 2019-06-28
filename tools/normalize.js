#!/usr/bin/env node
// 'Normalizes' the database in terms of entry, field, etc. order.
// Writes to the dictionary file directly. Fail-first, but fail-safe.

process.chdir(__dirname);
const required_fields = ['toaq', 'type', 'english'];
let d = require('./../dictionary.json');
function sortify(s) {
  return s.normalize('NFD').toLowerCase()
    .replace(/ı/g, 'i')
    // This one is for Toaq-like vowel ordering (auioe).
    .replace(/[ue]/g, s => s == 'e' ? 'u' : 'e')
    .replace(/[^a-z\ ]/g, '');
}
d = d.sort((a_, b_) => {
  let a = sortify(a_.toaq);
  let b = sortify(b_.toaq);
  if(a_ != b_ && a == b) throw new Error(`duplicate entries: «${a_.toaq}» and «${b_.toaq}»!`);
  return a > b ? 1 : -1;
}).map(({toaq, type, english, gloss, frame, namesake, notes, examples}) =>
       ({toaq, type, english, gloss, frame, namesake, notes, examples}));
d.forEach(e => {
  let missing = required_fields.filter(_ => !e[_]);
  if(missing.length)
    console.warn(`«${e.toaq}» doesn't have the following obligatory fields: ${missing.join(', ')}`);
  if(['predicate', 'predicatizer'].includes(e.type) != !!e.frame)
    ; // console.warn(`«${e.toaq}» does${e.frame ? '' : ' not'} have a frame despite being a ${e.type}`);
});
require('fs').writeFileSync('../dictionary.json',
  JSON.stringify(d, null, 2) + '\n');
