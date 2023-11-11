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
	data = [
		transformed({header[i] : e for i, e in enumerate(row)})
		for row in content
	]
	save_as_json_file(
		data, SELF_PATH + normalized("/../../dictionary.json"))
	print("Execution time: {:.3f}s.".format(
		time.time() - start_time))

def transformed(entry):
	def f(l):
		return [] if l == [""] else l
	entry["namesake"] = bool(entry.get("namesake", False))
	entry["examples"] = json.loads(entry.get("examples", "[]"))
	entry["notes"] = f(entry.get("notes", "").split("\n"))
	entry["keywords"] = f(entry.get("keywords", "").split("; "))
	entry["fields"] = f(entry.get("fields", "").split("; "))
	return reordered(entry)

def reordered(entry):
	order = (
		"toaq", "type", "english", "gloss", "gloss_abbreviation", "short", "keywords", "frame", "distribution", "pronominal_class", "subject", "namesake", "notes", "examples", "etymology", "fields"
	)
	diff = set(entry.keys()) - set(order)
	if diff != set():
		n = "" if len(set) == 1 else "S"
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
 

