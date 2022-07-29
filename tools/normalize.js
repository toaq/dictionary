#!/usr/bin/env node
// 'Normalizes' the database in terms of entry, field, etc. order.
// Writes to the dictionary file directly. Fail-first, but fail-safe.

"use strict";
process.chdir(__dirname);
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

d = d.sort((a, b) => {
  let [aToaq, bToaq] = [a.toaq, b.toaq].map(sortify);
  if(aToaq == bToaq && a.type === 'predicate' && b_.type === 'predicate')
    throw new Error(`duplicate entries: «${a.toaq}» and «${b.toaq}»!`);

  let [aParts, bParts] = [aToaq, bToaq].map(
    _ => _.split(/(?<=[aeiouy`])(?=[^aeiouy`])/));
  while(aParts.length || bParts.length) {
    let [aPart, bPart] = [aParts.shift(), bParts.shift()];
    if(!aPart || !bPart)
      return +aPart - +bPart;
    if(aPart < bPart) return -1;
    if(aPart > bPart) return 1;
  }
  return 0;
});

d = d.map(obj => {
  let obj_ = {};
  let ensureField = (fields, orelse) => fields.forEach(field =>
    obj_[field] = obj[field] || (typeof orelse === 'function' ? orelse(field) : orelse));

  ensureField(['toaq', 'type', 'english'], field =>
    { throw new Error(`required field ${field} missing in word «${obj.english}»`); });
  ensureField(['gloss'], '');
  ensureField(['gloss_abbreviation']);
  ensureField(['short'], '');
  ensureField(['keywords'], []);

  if([
    'predicate', 'pronoun',    'object incorporating verb',
    'name verb', 'word-quote', 'text-quote',
  ].includes(obj.type)) {
    ensureField(['frame', 'distribution', 'pronominal_class'], '');
    ensureField(['namesake']);
    ensureField(['notes', 'examples'],     []);
    ensureField(['fields'],                []);
  } else {
    ensureField(['notes', 'examples'],     []);
  }

  obj_.gloss = obj_.gloss.replaceAll(' ', '.');

  return obj_;
});

require('fs').writeFileSync('../dictionary.json',
  JSON.stringify(d, null, 2) + '\n');
console.log('Success!');
