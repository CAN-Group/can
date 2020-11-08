import csv
from typing import List

from models import County


def load_counties_from_csv() -> List[County]:
    with open("static_data/counties.csv", "r", encoding="utf-8") as file:
        headers = next(csv.reader(file, delimiter=","))
        reader = csv.DictReader(file, delimiter=",", fieldnames=headers)
        output = [County(**row) for row in reader]
    return output
