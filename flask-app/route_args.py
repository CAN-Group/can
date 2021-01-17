from typing import Dict


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
    def try_parse(cls, name: str = "gpx"):
        if name not in valid_formats:
            raise ValueError("Invalid format name")
        return cls(name=name)

    def format(self):
        return self.name


valid_profiles = ["car-eco", "car-fast"]


class Profile(URLParameter):
    name: str

    def __init__(self, name: str):
        self.name = name

    @classmethod
    def try_parse(cls, name: str = "car-fast"):
        if name not in valid_profiles:
            raise ValueError("Invalid profile name")
        return cls(name=name)

    def format(self):
        return self.name


class Variant(URLParameter):
    id_: int

    def __init__(self, id_: int):
        self.id_ = id_

    @classmethod
    def try_parse(cls, id_="0"):
        id_ = int(id_)
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
    errors = []
    parameters: Dict[str, str] = {}
    for parameter, class_ in classes.items():
        try:
            var = class_.try_parse(args.get(parameter))
        except ValueError as exception:
            errors.append(f"{parameter}: {exception}")
        else:
            parameters[parameter] = var.format()

    if errors:
        raise ValueError("\n".join(errors))

    return parameters


def format_route_args(args):
    return (
        f"lonlats={args['start']}|{args['finish']}&format={args['format']}&"
        f"profile={args['profile']}&alternativeidx={args['variant']}"
    )
