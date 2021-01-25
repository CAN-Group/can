import json

from shapely.geometry import Point
from shapely.geometry import shape as Shape

COUNTIES_GEOJSON_FILE = "./static/counties.geojson"
COUNTRY_GEOJSON_FILE = "./static/poland.geojson"

# load geometires from counties.geojson
with open(COUNTIES_GEOJSON_FILE, "r", encoding="utf-8") as file:
    counties_geojson = json.load(file)

COUNTIES_GEOMETRIES = {
    feature["properties"]["id"]: feature["geometry"]
    for feature in counties_geojson["features"]
}

# load geometry from poland.geojson
with open(COUNTRY_GEOJSON_FILE, "r", encoding="utf-8") as file:
    country_geojson = json.load(file)

COUNTRY_GEOMETRY = country_geojson["features"][0]["geometry"]


def parse_polygon(coordinates):
    # coordinates is actually a list containing a list of pairs, so:
    pairs_list = coordinates[0]
    coords_pairs = [f"{pair[0]},{pair[1]}" for pair in pairs_list]
    return ",".join(coords_pairs)


def parse_geometry(geometry):
    geometry_type = geometry["type"]
    coordinates = geometry["coordinates"]
    if geometry_type == "Polygon":
        return parse_polygon(coordinates)
    elif geometry_type == "MultiPolygon":
        return "|".join((parse_polygon(coords) for coords in coordinates))
    else:
        raise ValueError(f"Unsupported geometry type: {geometry_type}")


COUNTIES_SHAPES = {
    county_id: parse_geometry(geometry)
    for county_id, geometry in COUNTIES_GEOMETRIES.items()
}

COUNTRY_SHAPE = parse_geometry(COUNTRY_GEOMETRY)


def is_point_within_shape(x: float, y: float, geometry):
    point = Point(x, y)
    shape = Shape(geometry)
    return shape.contains(point)
