from os import getenv

from dotenv import load_dotenv

load_dotenv

DEBUG = getenv("DEBUG", "").lower in ("true", "1")

JOBSTORES_URI = getenv("JOBSTORES_URI", "sqlite:///jobs.db")
DB_CONNECTION_URI = getenv("DB_CONNECTION_URI", "sqlite:///../dev.db")
