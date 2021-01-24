import json
from datetime import datetime
from typing import Dict, Iterable, List, Type

import requests
from flask import Response

import settings

COUNTIES_GEOJSON_FILE = "./static/counties.geojson"
COUNTIES_SHAPES = {}

ROUTING_PROFILES_FILE = "./static/routing_profiles.json"
VALID_ROUTING_PROFILES = []

with open("static/poland.outline", "r") as f:
    POLAND_OUTLINE_PARAMETER = f.read()


def parse_polygon(pairs_list):
    # pairs_list is actually a list containing a list of pairs, so:
    pairs_list = pairs_list[0]
    coords_pairs = [f"{pair[0]},{pair[1]}" for pair in pairs_list]
    return ",".join(coords_pairs)


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
                COUNTIES_SHAPES[id_] = parse_polygon(coordinates)
            elif geometry_type == "MultiPolygon":
                polygons = [parse_polygon(coords) for coords in coordinates]
                COUNTIES_SHAPES[id_] = "|".join(polygons)

    return COUNTIES_SHAPES


def get_valid_routing_profiles():
    global VALID_ROUTING_PROFILES

    if not VALID_ROUTING_PROFILES:
        with open(ROUTING_PROFILES_FILE, "r") as file:
            VALID_ROUTING_PROFILES = json.load(file)

    return VALID_ROUTING_PROFILES


class BadRequestArgumentException(Exception):
    pass


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

    def __init__(self, items: Iterable[Parameter]):
        raise NotImplementedError()

    @classmethod
    def parse(cls, s: str):
        raise NotImplementedError()

    def format(self):
        return f"{self.output_name}=" + "|".join((item.format() for item in self.items))


class OptionalParameterList(ParameterList):
    def __init__(self, items: Iterable[Parameter]):
        if not items:
            items = list()
        self.items = list(items)

    @classmethod
    def parse(cls, s: str):
        if not s:
            return

        items = [item for item in s.split(cls.input_separator) if item]
        if not items:
            return

        return cls(items=[cls.parameter_class.parse(item) for item in items])


class RequiredParameterList(ParameterList):
    min_items: int

    def __init__(self, items: List[Parameter]):
        if not items or len(items) < self.min_items:
            raise ValueError(f"List must have at least {self.min_items} items")
        self.items = list(items)

    @classmethod
    def parse(cls, s: str):
        if not s:
            raise ValueError("Parameter is required")

        items = [item for item in s.split(cls.input_separator) if item]
        if len(items) < cls.min_items:
            raise ValueError(f"List must have at least {cls.min_items} items")

        return cls(items=[cls.parameter_class.parse(item) for item in items])


class Coordinates(Parameter):
    longitude: float
    latitude: float

    def __init__(self, longitude: float, latitude: float):
        self.longitude = longitude
        self.latitude = latitude

    @classmethod
    def parse(cls, s: str):
        try:
            lon, lat = s.split(",", 1)
            lon = float(lon)
            lat = float(lat)
        except ValueError:
            raise ValueError("Coordinates must use proper format: 'float,float'")
        else:
            return cls(longitude=lon, latitude=lat)

    def format(self):
        return f"{self.longitude},{self.latitude}"


class RouteCoordinates(RequiredParameterList):
    parameter_class = Coordinates
    input_separator = "|"
    min_items = 2
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


class CountyIDs(OptionalParameterList):
    parameter_class = County
    input_separator = ","
    output_name = "polygons"


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
            raise ValueError("Route variant must be an integer in range <0,4>")

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
        raise BadRequestArgumentException(errors)

    return "&".join(params.values())


def get_route(args):
    parameters = parse_route_args(args)

    base_url = settings.ROUTING_APP_URL
    url = f"{base_url}?{parameters}&polylines={POLAND_OUTLINE_PARAMETER}"

    with open(
        "logs/" + datetime.now().strftime(r"%Y-%m-%dT%H-%M-%S") + ".req.log", "w"
    ) as f:
        f.write(url)

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
