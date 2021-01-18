import json
from typing import Dict

ROUTING_PROFILES_FILE = "./static/routing_profiles.json"
VALID_ROUTING_PROFILES = []

with open(ROUTING_PROFILES_FILE, "r") as file:
    VALID_ROUTING_PROFILES = json.load(file)


class URLParameter:
    @classmethod
    def try_parse(cls):
        raise NotImplementedError()

    def format(self) -> str:
        raise NotImplementedError()


class Coords(URLParameter):
    lon: float
    lat: float

    def __init__(self, lon: float, lat: float):
        self.lon = lon
        self.lat = lat

    @classmethod
    def try_parse(cls, s: str):
        if not s:
            raise ValueError("Coords is a required parameter")
        (lon, lat) = s.split(",", 1)
        try:
            lon = float(lon)
            lat = float(lat)
        except ValueError:
            raise ValueError("Incorrect coords formatting. Must be 'float,float'")
        return cls(lon=lon, lat=lat)

    def format(self):
        return f"{self.lon},{self.lat}"


valid_formats = ["gpx", "kml", "geojson"]


class Format(URLParameter):
    name: str

    def __init__(self, name: str):
        self.name = name

    @classmethod
    def try_parse(cls, name: str):
        if not name:
            name = "gpx"
        if name not in valid_formats:
            raise ValueError("Invalid format name")
        return cls(name=name)

    def format(self):
        return self.name


class Profile(URLParameter):
    name: str

    def __init__(self, name: str):
        self.name = name

    @classmethod
    def try_parse(cls, name: str):
        if not name:
            name = "car-fast"
        if name not in VALID_ROUTING_PROFILES:
            raise ValueError("Invalid profile name")
        return cls(name=name)

    def format(self):
        return self.name


class Variant(URLParameter):
    id_: int

    def __init__(self, id_: int):
        self.id_ = id_

    @classmethod
    def try_parse(cls, id_: str):
        try:
            id_ = int(id_ or "0")
        except ValueError:
            raise ValueError("Variant must be an integer")
        else:
            if not 0 <= id_ <= 4:
                raise ValueError("Variant index out of range")
            return cls(id_=id_)

    def format(self):
        return self.id_


classes: Dict[str, URLParameter] = {
    "start": Coords,
    "finish": Coords,
    "format": Format,
    "profile": Profile,
    "variant": Variant,
}


def parse_route_args(args):
    errors = {}
    params: Dict[str, str] = {}
    for parameter, class_ in classes.items():
        try:
            var = class_.try_parse(args.get(parameter))
        except ValueError as exception:
            errors[parameter] = str(exception)
        else:
            params[parameter] = var.format()

    if errors:
        raise ValueError(errors)

    return (
        f"lonlats={params['start']}|{params['finish']}&format={params['format']}&"
        f"profile={params['profile']}&alternativeidx={params['variant']}"
    )
