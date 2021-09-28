#!/usr/bin/env node
// 'Normalizes' the database in terms of entry, field, etc. order.
// Writes to the dictionary file directly. Fail-first, but fail-safe.

"use strict";
process.chdir(__dirname);
const required_fields = ['toaq', 'type', 'english'];
let d = require('./../dictionary.json');
function sortify(s) {
  return s.normalize('NFD').toLowerCase()
    .replace(/ı/g, 'i')
    .replace(/[^a-z\ ]/g, '')
    // Prioritize q over vowels
    // (` comes early codepoint-wise).
    .replace(/q/g, '`')
    // Prioritize compounds over serial predicates
    // (~ comes last codepoint-wise).
    .replace(/ /g, '~')
    // Toaq-like vowel ordering (auioe).
    .replace(/[ue]/g, s => s == 'e' ? 'u' : 'e')
    // Handle the empty onset.
    .replace(/(?<= |^)(?=[aeiouy])/, '\'');
}
d = d.sort((a_, b_) => {
  let a = sortify(a_.toaq);
  let b = sortify(b_.toaq);
  if(a == b && a_.type === 'predicate' && b_.type === 'predicate')
    throw new Error(`duplicate entries: «${a_.toaq}» and «${b_.toaq}»!`);
  let a_parts = a.split(/(?<=[aeiouy`])(?=[^aeiouy`])/);
  let b_parts = b.split(/(?<=[aeiouy`])(?=[^aeiouy`])/);
  for(let i = 0;; i++) {
    let a_part = a_parts[i], b_part = b_parts[i];
    if(!a_part && !b_part) return 0;
    if(!a_part) return -1;
    if(!b_part) return 1;
    if(a_part < b_part) return -1;
    if(a_part > b_part) return 1;
  }
}).map(obj => {
  let predlike = [
    'predicate',
    'object incorporating verb',
    'name verb',
    'word-quote',
    'text-quote',
  ].includes(obj.type);
  return {
    toaq: obj.toaq, type: obj.type, english: obj.english,
    gloss: obj.gloss || '',
    short: obj.short || '', keywords: obj.keywords || [],
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
    console.warn(
      `«${e.toaq}» doesn't have the following obligatory fields: ${
        missing.join(', ')}`);
});
require('fs').writeFileSync('../dictionary.json',
  JSON.stringify(d, null, 2) + '\n');
