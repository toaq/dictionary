# Format

Please insert your fields as you need them (not too much, though) – the format is still up for consideration. Please note that the order shown here should be followed.

* `toaq` – the Toaq word or phrase in question
* `type` – part of speech – one of the following:
  - `"root"` (not necessarily monosyllabic);
  - `"compound"` for genuine compounds rather than borrowings;
  - `"borrowing"`;
  - `"serial predicate"`;
  - for particles, a descriptive name such as `"predicatizer"`, `"text-quote"`…
* `english` – definition in English
* `gloss` – linguistic gloss in English; use periods instead of spaces
* `keywords` - a list of English words that one might search for when trying to find the headword; synonyms of the gloss or of the main words found in the sentential definition
* `frame` – frame definition, if known; `"variable"` means that the word doesn't have a set frame (possibly anaphoric)
* `distribution` - a string of the same format as `frame` where each slot type is replaced with either of ‘d’ or ‘n’ (for ‘distributive’ and ‘non-distributive’); `"variable"` – as above
* `namesake` – whether this word is the name used to refer to its frametype
* `notes` – array of strings
* `examples` – array of objects:
  - `toaq`
  - `english`
* `etymology` – etymological information; only present in borrowings
* `fields` – array of arrays of strings: each element describes one slot; each string is a valid Toaq predicate; those together, when ORed (or rather: «ra»-ed), represent the constraint on that slot. For example:
  ```json
  [
    ["mıe"],
    ["saı", "lufē"]
  ]
  ```
  describes «chıaq»: x₁ must mỉe and x₂ must to ra sảı to lủfē.

`tools/normalize.js` is for normalizing the dictionary file.

At the moment, oblique words (prepositions and adverbs) should be entered as examples. The normalizer will reject «daı» and «dãı» as duplicates.

**Example entry:**
```
{
    "toaq": "cho",
    "type": "root",
    "english": "▯ likes ▯.",
    "gloss": "like",
    "keywords": [
      "like",
      "fond of",
      "enjoy",
      "pleased by"
    ],
    "frame": "c c",
    "distribution": "d d",
    "notes": [],
    "examples": [
      {
        "toaq": "Chỏ da.",
        "english": "There is fondness."
      },
      {
        "toaq": "Chỏ jí da.",
        "english": "I am experiencing fondness."
      },
      {
        "toaq": "Hẻ chỏ déo báq rủa da.",
        "english": "The children are fond of flowers."
      },
      {
        "toaq": "Chỏ súq hı nỉ fủa moq.",
        "english": "Which of these pieces of furniture do you like?"
      },
      {
        "toaq": "chó",
        "english": "those who have fondness"
      }
    ],
    "fields": [
      ["lıe"],
      ["raı"]
    ]
}
```
