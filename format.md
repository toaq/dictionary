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
* `subject` - describes how the subject is constrained. Useful for semantics analysis. One of six string values:
  * `"event"` is for subjects that are necessarily events (like **bıe**).
  * `"proposition"` is for subjects that are necessarily propositions (like **guosıa**).
  * `"individual"` is for verbs whose subjects _can't_ be events or propositions, and so they should subject-share, like **jaı**.
  * `"agent"` implies `"individual"` and also syntactic ergativity. An example is **koı**.
  * `"free"` is for verbs whose subjects can be anything, like **gı**. This implies _no_ subject-sharing.
  * `"shape"` is kinda weird. It's for subjects that have a "shape", like **sao**. I don't know if we want to pretend events have "shapes", but I think it's kind of nice. Then **Koı jí sâo** means I walk and the event is spatio-temporally big. So if people agree with this I will change all the `"shape"`s to `"free"`, otherwise I will change them to `"individual"`.
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
