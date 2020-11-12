import csv
import json
from typing import List

from models import County


def load_counties_from_csv() -> List[County]:
    with open("static/counties.csv", "r", encoding="utf-8") as file:
        headers = next(csv.reader(file, delimiter=","))
        reader = csv.DictReader(file, delimiter=",", fieldnames=headers)
        output = [County(**row) for row in reader]
    return output


def load_counties_from_geojson() -> dict:
    with open("static_data/counties.geojson", "r", encoding="utf-8") as file:
        output = json.load(file)
    return output
