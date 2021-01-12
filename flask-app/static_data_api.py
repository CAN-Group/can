import json
from typing import List

import pandas as pd

from models import County, Voivodeship

COUNTIES_CSV_FILEPATH = "static/counties.csv"
COUNTIES_GEOJSON_FILEPATH = "static/counties.geojson"


def load_counties_csv():
    df = pd.read_csv(COUNTIES_CSV_FILEPATH)
    return df


def get_voivodeships(df: pd.DataFrame) -> List[Voivodeship]:
    df = df[["id_", "voivodeship"]]
    df = df.drop_duplicates(subset="voivodeship")
    voivodeships = [Voivodeship.from_csv(**row) for _, row in df.iterrows()]
    return voivodeships


def get_counties(df: pd.DataFrame) -> List[County]:
    df = df[["id_", "county", "population"]]
    counties = [County.from_csv(**row) for _, row in df.iterrows()]
    return counties


def load_counties_from_geojson() -> dict:
    with open(COUNTIES_GEOJSON_FILEPATH, "r", encoding="utf-8") as file:
        output = json.load(file)
    return output
