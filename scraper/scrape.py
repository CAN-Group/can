from apscheduler.triggers.cron import CronTrigger
from database import DBSession
from bs4 import BeautifulSoup
import settings
import requests
import pandas as pd
from datetime import datetime
import models


def read_csv_from_uri(uri):
    df = pd.read_csv(uri, encoding="cp1250", sep=';')
    return df.values.tolist()


def get_date_from_uri(uri):
    r = requests.get(uri)
    date_str = r.headers["last-modified"]
    format_date_str = "%a, %d %b %Y %H:%M:%S %Z"
    return datetime.strptime(date_str, format_date_str)


def get_uri(mz_uri):
    req = requests.get(mz_uri)
    soup = BeautifulSoup(req.text, "lxml")
    link = soup.find_all("a", {"class": "file-download"})[1]
    return link["href"]


def get_date_archive(links):
    dates = []
    for link in links:
        date = link.next_element

        date = date.replace("\u200b", "")
        date = date.replace("_", "")
        date = date.replace("\n", "")
        date = date.replace("-", "")

        date = date[:6]
        format_date_str = "%d%m%y"
        date = datetime.strptime(date, format_date_str)
        dates.append(date)
    return dates


def get_uri_archive(mz_uri, links):
    uris = [mz_uri.rsplit('/', 3)[0] + link.get("href") for link in links]
    return uris


def get_links_archive(mz_uri):
    req = requests.get(mz_uri)
    soup = BeautifulSoup(req.text, "lxml")
    links = soup.find_all("a", {"class": "file-download"})
    return links


def add_cases_db(db_session, cases, date):
    for case in cases:
        cases_record = models.CasesRecord(
            county_id=case[7], updated=date.date(), number_of_cases=case[2]
        )
        db_session.merge(cases_record)


def scrape():
    db_session = DBSession()
    uri_archive_db = [item.uri for item in db_session.query(models.CasesUri).all()]
    links = get_links_archive(settings.MZ_ARCHIVE_URI)

    # archive
    uris = get_uri_archive(settings.MZ_ARCHIVE_URI, links)
    dates = get_date_archive(links)

    for uri, date in zip(uris, dates):
        if uri not in uri_archive_db:
            cases = read_csv_from_uri(uri)
            add_cases_db(db_session, cases, date)
            db_session.merge(models.CasesUri(updated=date.date(), uri=uri))
            print(date, uri)

    # today
    uri = get_uri(settings.MZ_TODAY_URI)

    cases = read_csv_from_uri(uri)
    date = get_date_from_uri(uri)
    add_cases_db(db_session, cases, date)
    db_session.merge(models.CasesUri(updated=date.date(), uri=uri))
    db_session.commit()


trigger = CronTrigger(second="00,15,45,30")

job = {
    "func": scrape,
    "id": "scrape_job",
    "trigger": trigger,
    "replace_existing": True,
}
