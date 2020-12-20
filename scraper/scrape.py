from apscheduler.triggers.cron import CronTrigger
from database import DBSession
from bs4 import BeautifulSoup
import settings
import requests
import pandas as pd
from datetime import datetime
import models


def get_date_from_uri(uri):
    r = requests.get(uri)
    date_str = r.headers["date"]
    format_date_str = "%a, %d %b %Y %H:%M:%S %Z"
    return datetime.strptime(date_str, format_date_str)


def read_csv_from_uri(uri):
    df = pd.read_csv(uri, encoding="cp1250", sep=";")
    return df.values.tolist()


def get_uri():
    req = requests.get(settings.MZ_TODAY_URI)
    soup = BeautifulSoup(req.text, "lxml")
    link = soup.find_all("a", {"class": "file-download"})[1]
    return link["href"]


def scrape():
    db_session = DBSession()

    uri = get_uri()
    cases = read_csv_from_uri(uri)
    date = get_date_from_uri(uri)

    for case in cases:
        cases_record = models.CasesRecord(
            county_id=case[7], updated=date.date(), number_of_cases=case[2]
        )
        db_session.merge(cases_record)
    db_session.commit()


trigger = CronTrigger(hour="00,12", minute="0")

job = {
    "func": scrape,
    "id": "scrape_job",
    "trigger": trigger,
    "replace_existing": True,
}
