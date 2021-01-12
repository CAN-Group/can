from os import getenv

from dotenv import load_dotenv

load_dotenv()

DEBUG = getenv("DEBUG", "").lower() in ("true", "1")

JOBSTORES_URI = getenv("JOBSTORES_URI", "sqlite:///jobs.db")
DB_CONNECTION_URI = getenv("DB_CONNECTION_URI", "sqlite:///../dev.db")

MZ_TODAY_URI = getenv(
    "MZ_TODAY_URI",
    "https://www.gov.pl/web/koronawirus/mapa-zarazen-koronawirusem-sars-cov-2-powiaty",
)
MZ_ARCHIVE_URI = getenv(
    "MZ_ARCHIVE_URI", "https://www.gov.pl/web/koronawirus/pliki-archiwalne-powiaty"
)
