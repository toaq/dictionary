# ============================================================ #

import sys, os, time, json

from common import object_from_json_path, save_dicts_as_csv_file

SELF_PATH = os.path.dirname(os.path.realpath(__file__))

# ============================================================ #

def entrypoint():
	start_time = time.time()
	def normalized(path):
		return path.replace("/", os.path.sep)
	data = object_from_json_path(
		SELF_PATH + normalized("/../../dictionary.json"))
	data = [transformed(e) for e in data]
	save_dicts_as_csv_file(
		data, SELF_PATH + normalized("/dictionary.tsv"),
		delimiter = '\t')
	print("Execution time: {:.3f}s.".format(
		time.time() - start_time))

def transformed(entry):
	entry["examples"] = json.dumps(
			entry.get("examples", []),
			ensure_ascii = False)
	entry["notes"] = "\n".join(entry.get("notes", []))
	entry["keywords"] = "; ".join(entry.get("keywords", []))
	entry["fields"] = "; ".join(entry.get("fields", []))
	return reordered(entry)

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

# ============================================================ #

# === ENTRY POINT === #

entrypoint()
 
