#!/usr/bin/env node
// 'Normalizes' the database in terms of entry, field, etc. order.
// Writes to the dictionary file directly. Fail-first, but fail-safe.

process.chdir(__dirname);
const required_fields = ['toaq', 'type', 'english'];
let d = require('./../dictionary.json');
function sortify(s) {
  return s.normalize('NFD').toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[^a-z\ ]/g, '')
    // Prioritise q over vowels (` comes earlies than a codepoint-wise).
    .replace(/q/g, '`')
    // Toaq-like vowel ordering (auioe).
    .replace(/[ue]/g, s => s == 'e' ? 'u' : 'e');
}
d = d.sort((a_, b_) => {
  let a = sortify(a_.toaq);
  let b = sortify(b_.toaq);
  if(a_ != b_ && a == b) throw new Error(`duplicate entries: «${a_.toaq}» and «${b_.toaq}»!`);
  return a > b ? 1 : -1;
}).map(obj => {
  let predlike = ['predicate', 'predicatizer'].includes(obj.type);
  return {
    toaq: obj.toaq, type: obj.type, english: obj.english,
    gloss: obj.gloss || '', keywords: obj.keywords || [],
    frame: predlike ? obj.frame || '' : undefined,
    distribution: predlike ? obj.distribution || '' : undefined,
    namesake: (predlike && obj.namesake) || undefined,
    notes: obj.notes || [],
    examples: obj.examples || [],
    fields: predlike ? obj.fields || [] : undefined };
});
d.forEach(e => {
  let missing = required_fields.filter(_ => !e[_]);
  if(missing.length)
    console.warn(`«${e.toaq}» doesn't have the following obligatory fields: ${missing.join(', ')}`);
});
require('fs').writeFileSync('../dictionary.json',
  JSON.stringify(d, null, 2) + '\n');
