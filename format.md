# Format

Please insert your fields as you need them (not too much, though) – the format is still up for consideration.

* `toaq` – the Toaq word or phrase in question
* `type` – part of speech
* `english` – definition in English
* `gloss` – linguistic gloss in English; use periods instead of spaces
* `frame` – frame definition, if known; `"variable"` means that the word doesn't have a set frame (possibly anaphoric)
* `namesake` – whether this word is the name used to refer to its frametype
* `remarks` – array of strings
* `examples` – array of objects:
  - `toaq`
  - `english`
* `distribution` - a string of the same format as `frame` where each slot type is replaced with either of ‘d’ or ‘n’ (for ‘distributive’ and ‘non-distributive’)
* `keywords` - a list of English words that one might search for when trying to find the headword; synonyms of the gloss or of the main words found in the sentential definition

`tools/normalize.js` is for normalizing the dictionary file.

At the moment, oblique words (prepositions and adverbs) should be entered as examples. The normalizer will reject «daı» and «dãı» as duplicates.
