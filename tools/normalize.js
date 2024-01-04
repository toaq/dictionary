#!/usr/bin/env node
// 'Normalizes' the database in terms of entry, field, etc. order.
// Writes to the dictionary file directly. Fail-first, but fail-safe.

"use strict";
process.chdir(__dirname);
let d = require("./../dictionary.json");

function sortify(s) {
  return s
    .normalize("NFD")
    .toLowerCase()
    .replace(/ı/g, "i")
    .replace(/ꝡ/g, "v")
    .replace(/[^a-z\ ]/g, "");
}

d = d.sort((a, b) => {
  if (a.toaq === b.toaq)
    throw new Error(`duplicate entries: «${a.toaq}» and «${b.toaq}»!`);

  const ka = sortify(a.toaq);
  const kb = sortify(b.toaq);
  return ka < kb ? -1 : ka > kb ? 1 : 0;
});

const verbyTypes = [
  "predicate",
  "predicatizer",
  "name verb",
  "name quote",
  "word quote",
  "text quote",
];

d = d.map((obj) => {
  let obj_ = {};
  const type = obj.type;
  const toaq = obj.toaq;
  const ensureField = (fields, orelse) =>
    fields.forEach((field) => {
      obj_[field] =
        obj[field] || (typeof orelse === "function" ? orelse(field) : orelse);
      delete obj[field];
    });

  ensureField(["toaq", "type", "english"], (field) => {
    throw new Error(`required field ${field} missing in word «${toaq}»`);
  });
  ensureField(["gloss"], "");
  ensureField(["gloss_abbreviation"]);
  ensureField(["short"], "");
  ensureField(["keywords"], []);

  if (verbyTypes.includes(type)) {
    ensureField(["frame", "distribution", "pronominal_class", "subject"], "");
    ensureField(["verb_class", "namesake"]);
    ensureField(["notes", "examples"], []);
    ensureField(["fields"], []);
  } else {
    ensureField(["notes", "examples"], []);
  }

  obj_.gloss = obj_.gloss.replaceAll(" ", ".");

  const remainingKeys = Object.keys(obj);
  if (remainingKeys.length > 0) {
    throw new Error(`word «${toaq}» has superfluous fields: ${remainingKeys}`);
  }
  return obj_;
});

require("fs").writeFileSync(
  "../dictionary.json",
  JSON.stringify(d, null, 2) + "\n"
);
console.log("Success!");
