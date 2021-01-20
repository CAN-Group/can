from os import getenv

from dotenv import load_dotenv

load_dotenv()

DEBUG = getenv("DEBUG", "").lower() in ("true", "1")

JOBSTORES_URI = getenv("JOBSTORES_URI", "sqlite:///jobs.db")
DB_CONNECTION_URI = getenv("DB_CONNECTION_URI", "sqlite:///../dev.db")

MZ_TODAY_URI = getenv(
    "MZ_TODAY_URI",
    "https://services9.arcgis.com/RykcEgwHWuMsJXPj/arcgis/rest/services/powiaty_corona_widok_woj/FeatureServer/0/query",
)
MZ_ARCHIVE_URI = getenv(
    "MZ_ARCHIVE_URI", "https://www.gov.pl/web/koronawirus/pliki-archiwalne-powiaty"
)

PAYLOAD_DATA = {}
PAYLOAD_DATA["f"] = getenv("arcgis_type", "json")
PAYLOAD_DATA["where"] = getenv("arcgis_where", "1=1")
PAYLOAD_DATA["outFields"] = getenv("arcgis_fields", "POTWIERDZONE_DZIENNE,JPT_KJ_I_2")
PAYLOAD_DATA["returnGeometry"] = getenv("arcgis_geometry", "false")
