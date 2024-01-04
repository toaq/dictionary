# `dictionary`
…is the WIP version of the new official dictionary for the Toaq
language. It will contain clear definitions, some additional data
(such as frame signatures) for automated language processing, and a
lot of examples.

* `format.md` describes the format.
* `dictionary.json` is the thing itself.
* `html` contains the necessary files and scripts for building the
  [HTML dictionary page](https://toaq.net/dictionary).
* `tools` contains helper scripts. In particular:
  - `node tools/normalize.js` is the tool you should run before committing — it
    puts entries and fields in the right places.
