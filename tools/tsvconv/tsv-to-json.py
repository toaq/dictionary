# ============================================================ #

import sys, os, time, json

from common import table_from_csv_path, save_as_json_file

SELF_PATH = os.path.dirname(os.path.realpath(__file__))

# ============================================================ #

def entrypoint():
	start_time = time.time()
	def normalized(path):
		return path.replace("/", os.path.sep)
	table = table_from_csv_path(
		SELF_PATH + normalized("/dictionary.tsv"),
		delimiter = "\t")
	header, content = table[0], table [1:]
	s = {"toaq", "type", "english"} - set(header)
	if s != set():
		n = "s" if len(s) != 1 else ""
		print(f"⚠ ERROR: Mandatory column{n} headers {s} missing!")
	else:
		data = [
			transformed({header[i] : e for i, e in enumerate(row)})
			for row in content
		]
		save_as_json_file(
			data, SELF_PATH + normalized("/../../dictionary.json"))
	print("Execution time: {:.3f}s.".format(
		time.time() - start_time))

VERB_TYPES = {
  "predicate",
  "predicatizer",
  "name verb",
  "name quote",
  "word quote",
  "text quote",
}

def transformed(entry):
	def f(l):
		return [] if l == [""] else l
	entry["namesake"] = bool(entry.get("namesake", False))
	entry["examples"] = json.loads(entry.get("examples", "[]"))
	entry["notes"] = f(entry.get("notes", "").split("\n"))
	entry["keywords"] = f(entry.get("keywords", "").split("; "))
	entry["fields"] = f(entry.get("fields", "").split("; "))
	
	return reordered(normalized(entry))

def normalized(entry):
	verb_only_fields = {
		"frame", "distribution", "pronominal_class", "subject", "verb_class", "namesake", "notes", "examples", "fields"
	}
	for f in verb_only_fields:
		if f in entry.keys():
			entry.pop(f)
	return entry

def reordered(entry):
	order = (
		"toaq", "type", "english", "gloss", "gloss_abbreviation", "short", "keywords", "frame", "distribution", "pronominal_class", "subject", "namesake", "notes", "examples", "etymology", "fields"
	)
	diff = set(entry.keys()) - set(order)
	if diff != set():
		n = "" if len(diff) == 1 else "S"
		print(F"FOREIGN KEY({n}) FOUND: {str(diff)}")
	return dict(
		(key, entry[key]) for key in order if key in entry)

default_values = {
 	"toaq": "",
 	"type": "",
 	"english": "",
 	"gloss": "",
 	"gloss_abbreviation": "",
 	"short": "",
 	"keywords": [],
 	"frame": "",
 	"distribution": "",
 	"pronominal_class": "",
 	"subject": "",
 	"namesake": False,
 	"notes": [],
 	"examples": [],
 	"etymology": "",
 	"fields": [],
}

# ============================================================ #

# === ENTRY POINT === #

entrypoint()
 

