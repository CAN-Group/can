import json
from datetime import datetime
from typing import Dict, Iterable, List, Type

import requests
from flask import Response

import settings
from shapes import (
    COUNTIES_GEOMETRIES,
    COUNTIES_SHAPES,
    COUNTRY_GEOMETRY,
    COUNTRY_SHAPE,
    is_point_within_shape,
)

ROUTING_PROFILES_FILE = "./static/routing_profiles.json"

# load a list with names of valid routing profiles
with open(ROUTING_PROFILES_FILE, "r", encoding="utf-8") as file:
    VALID_ROUTING_PROFILES = [obj["key"] for obj in json.load(file)["Profiles"]]


class BadRequestArgumentException(Exception):
    pass


class Parameter:
    @classmethod
    def parse(cls, s: str):
        raise NotImplementedError()

    def format(self) -> str:
        raise NotImplementedError()


class ParameterList(Parameter):
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
    def __init__(self, items: Iterable[Parameter] = list()):
        self.items = list(items)

    @classmethod
    def parse(cls, s: str):
        if not s:
            return cls()

        items = [item for item in s.split(cls.input_separator) if item]
        if not items:
            return cls()

        return cls(items=[cls.parameter_class.parse(item) for item in items])


class RequiredParameterList(ParameterList):
    min_items: int

    def __init__(self, items: List[Parameter]):
        if len(items) < self.min_items:
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

        # ensure point is within country
        if not is_point_within_shape(lon, lat, COUNTRY_GEOMETRY):
            raise ValueError(f"Coordinates {lon},{lat} are outside of the country")

        return cls(longitude=lon, latitude=lat)

    def format(self):
        return f"{self.longitude},{self.latitude}"

    def to_lonlats(self):
        return self.lon, self.lat


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
        if s not in COUNTIES_SHAPES.keys():
            raise ValueError("Invalid county ID")

        return cls(id_=s)

    def format(self):
        return COUNTIES_SHAPES[self.id_]


class CountyIDs(OptionalParameterList):
    parameter_class = County
    input_separator = ","
    output_name = "polylines"


class RouteProfile(Parameter):
    name: str

    def __init__(self, name: str):
        self.name = name

    @classmethod
    def parse(cls, s: str):
        if not s:
            s = "car-fasteco"

        if s not in VALID_ROUTING_PROFILES:
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


def are_coordinates_within_county(coordinates: Coordinates, county: County):
    return is_point_within_shape(
        coordinates.longitude, coordinates.latitude, COUNTIES_GEOMETRIES[county.id_]
    )


# input parameter name -> specific Parameter class
parsers: Dict[str, Parameter] = {
    "coords": RouteCoordinates,
    "counties": CountyIDs,
    "profile": RouteProfile,
    "variant": RouteVariant,
    "format": OutputFormat,
}


def parse_route_args(args):
    errors: Dict[str, str] = {}  # input parameter name -> error reason
    parameters: Dict[str, Parameter] = {}
    out_parameters: Dict[str, str] = {}

    # try parsing all input parameters
    for parameter_name, class_ in parsers.items():
        try:
            parsed_object = class_.parse(args.get(parameter_name))
        except ValueError as exception:
            errors[parameter_name] = str(exception)
        else:
            if parsed_object:
                parameters[parameter_name] = parsed_object

    # exit if found any errors
    if errors:
        raise BadRequestArgumentException(errors)

    # filter out counties from nogos if any of route points are within them
    for point in parameters["coords"].items:
        parameters["counties"].items = [
            item
            for item in parameters["counties"].items
            if not are_coordinates_within_county(point, item)
        ]

    # format parameters for request to brouter
    out_parameters = {
        parameter_name: parsed_param.format()
        for parameter_name, parsed_param in parameters.items()
    }

    # append country shape to list of nogo polylines
    if len(parameters["counties"].items) == 0:
        # no counties to avoid, pass only country shape to brouter
        out_parameters["counties"] += COUNTRY_SHAPE
    else:
        # at least one county to avoid, add country shape to the list passed to brouter
        out_parameters["counties"] += "|" + COUNTRY_SHAPE

    return "&".join(out_parameters.values())


def get_route(args):
    parameters = parse_route_args(args)

    base_url = settings.ROUTING_APP_URL
    url = f"{base_url}?{parameters}"

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
