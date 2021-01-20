import json
from typing import Dict, List, Type

import requests
from flask import Response

import settings

COUNTIES_GEOJSON_FILE = "./static/counties.geojson"
COUNTIES_SHAPES = {}

ROUTING_PROFILES_FILE = "./static/routing_profiles.json"
VALID_ROUTING_PROFILES = []


def get_counties_shapes():
    global COUNTIES_SHAPES

    if not COUNTIES_SHAPES:
        with open(COUNTIES_GEOJSON_FILE, "r", encoding="utf-8") as file:
            geojson = json.load(file)

        for feature in geojson["features"]:
            id_ = feature["properties"]["id"]
            geometry_type = feature["geometry"]["type"]
            coordinates = feature["geometry"]["coordinates"]

            if geometry_type == "Polygon":
                polygons = [coordinates[0]]
            else:
                polygons = [polygon[0] for polygon in coordinates]

            polygons = [
                [f"{pair[0]},{pair[1]}" for pair in polygon] for polygon in polygons
            ]

            polygons = [",".join(polygon) for polygon in polygons]
            # coords_pairs = [
            #     f"{pair[0]},{pair[1]}" for polygon in polygons for pair in polygon
            # ]

            COUNTIES_SHAPES[id_] = "|".join(polygons)

    return COUNTIES_SHAPES


def get_valid_routing_profiles():
    global VALID_ROUTING_PROFILES

    if not VALID_ROUTING_PROFILES:
        with open(ROUTING_PROFILES_FILE, "r") as file:
            VALID_ROUTING_PROFILES = json.load(file)

    return VALID_ROUTING_PROFILES


class Parameter:
    @classmethod
    def parse(cls, s: str):
        raise NotImplementedError()

    def format(self) -> str:
        raise NotImplementedError()


class ParameterList:
    parameter_class: Type[Parameter]
    items: List[Parameter]
    input_separator: str
    output_name: str
    optional: bool = False

    def __init__(self, items: List[Parameter]):
        # if not all((type(item) == self.parameter_class for item in items)):
        #     raise ValueError("All items must be objects of given class")
        self.items = items.copy()

    @classmethod
    def parse(cls, s: str):
        if not s:
            if cls.optional:
                return False
            else:
                raise ValueError("Parameter is required")

        items = [item for item in s.split(cls.input_separator) if item]
        if not items:
            if cls.optional:
                return False
            else:
                raise ValueError("List must not be empty")

        return cls(items=[cls.parameter_class.parse(item) for item in items])

    def format(self):
        return f"{self.output_name}=" + "|".join((item.format() for item in self.items))


class Coordinates(Parameter):
    longitude: float
    latitude: float

    def __init__(self, longitude: float, latitude: float):
        self.longitude = longitude
        self.latitude = latitude

    @classmethod
    def parse(cls, s: str):
        lon, lat = s.split(",")
        try:
            lon = float(lon)
            lat = float(lat)
        except ValueError:
            raise ValueError("Coordinates must use proper format: 'float,float'")
        else:
            return cls(longitude=lon, latitude=lat)

    def format(self):
        return f"{self.longitude},{self.latitude}"


class RouteCoordinates(ParameterList):
    parameter_class = Coordinates
    input_separator = "|"
    output_name = "lonlats"


class County(Parameter):
    id_: str

    def __init__(self, id_: str):
        self.id_ = id_

    @classmethod
    def parse(cls, s: str):
        if s not in get_counties_shapes().keys():
            raise ValueError("Invalid county ID")

        return cls(id_=s)

    def format(self):
        return get_counties_shapes()[self.id_]


class CountyIDs(ParameterList):
    parameter_class = County
    input_separator = ","
    output_name = "polygons"
    optional = True


class RouteProfile(Parameter):
    name: str

    def __init__(self, name: str):
        self.name = name

    @classmethod
    def parse(cls, s: str):
        if not s:
            s = "car-fast"

        if s not in get_valid_routing_profiles():
            raise ValueError("Invalid route profile name")

        return cls(name=s)

    def format(self):
        return f"profile={self.name}"


class RouteVariant(Parameter):
    id_: int

    def __init__(self, id_: int):
        self.id_ = id_

    @classmethod
    def parse(cls, s: str):
        if not s:
            s = "0"

        try:
            s = int(s)
        except ValueError:
            raise ValueError("Route variant must be an integer")

        if not 0 <= s <= 4:
            raise ValueError("Route variant must be an integer in range <0,4>")

        return cls(id_=s)

    def format(self):
        return f"alternativeidx={self.id_}"


class OutputFormat(Parameter):
    name: str

    def __init__(self, name: str):
        self.name = name

    @classmethod
    def parse(cls, s: str):
        if not s:
            s = "gpx"

        if s not in ["gpx", "kml", "geojson"]:
            raise ValueError("Invalid route output format")

        return cls(name=s)

    def format(self):
        return f"format={self.name}"


parsers: Dict[str, Parameter] = {
    "coords": RouteCoordinates,
    "counties": CountyIDs,
    "profile": RouteProfile,
    "variant": RouteVariant,
    "format": OutputFormat,
}


def parse_route_args(args):
    errors = {}
    params: Dict[str, str] = {}
    for parameter, class_ in parsers.items():
        try:
            var = class_.parse(args.get(parameter))
        except ValueError as exception:
            errors[parameter] = str(exception)
        else:
            if var:
                params[parameter] = var.format()

    if errors:
        raise ValueError(errors)

    return "&".join(params.values())


def get_route(args):
    parameters = parse_route_args(args)

    base_url = settings.ROUTING_APP_URL
    url = f"{base_url}?{parameters}"

    # return url

    response = requests.get(url)
    excluded_headers = [
        "content-encoding",
        "content-length",
        "transfer-encoding",
        "connection",
    ]
    headers = [
        (key, value)
        for (key, value) in response.headers.items()
        if key.lower() not in excluded_headers
    ]

    return Response(response.content, response.status_code, headers)


if __name__ == "__main__":
    print(get_counties_shapes()["t2412"])
