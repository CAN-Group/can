from apscheduler.triggers.cron import CronTrigger
from database import DBSession
from bs4 import BeautifulSoup
import settings
import requests
import pandas as pd
import numpy as np
from datetime import datetime
import models
import json


def get_json_today_cases():
    r=requests.get(url=settings.MZ_TODAY_URI, params=settings.PAYLOAD_DATA)
    return json.loads(r.text)['features']


def read_csv_from_uri(uri):
    df = pd.read_csv(uri, encoding="cp1250", sep=';')
    df = df.replace(np.nan, 0)
    return df.values.tolist()


def get_date_from_uri(uri, params):
    r = requests.get(url=uri, params=params)
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

        if int(date[2:4]) <= 12:
            date = date[:6]
            format_date_str = "%d%m%y"
        else:
            date = date[:8]
            format_date_str = "%Y%m%d"

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


def add_cases_db_archive(db_session, cases, date):
    for case in cases:
        if case[7] != "t0000":
            cases_record = models.CasesRecord(
                county_id=case[7], updated=date.date(), number_of_cases=case[2]
                )
            db_session.merge(cases_record)


def add_cases_db_today(db_session, cases, date):
    for case in cases:
        teryt = case['attributes']['JPT_KJ_I_2']
        confirmed = case['attributes']['POTWIERDZONE_DZIENNE']

        cases_record = models.CasesRecord(
                county_id=teryt, updated=date.date(), number_of_cases=confirmed
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
        db_session.query(models.CasesUri).filter(models.CasesUri.updated == date).update({'uri': uri})
        if uri not in uri_archive_db:
            cases = read_csv_from_uri(uri)
            add_cases_db_archive(db_session, cases, date)
            db_session.merge(models.CasesUri(updated=date.date(), uri=uri))

    # today
    cases = get_json_today_cases()
    date = get_date_from_uri(settings.MZ_TODAY_URI, settings.PAYLOAD_DATA)
    add_cases_db_today(db_session, cases, date)
    
    db_session.merge(models.CasesUri(updated=date.date(), uri='temp_uri'))
    db_session.commit()

trigger = CronTrigger(hour="11,18", minute="0")

job = {
    "func": scrape,
    "id": "scrape_job",
    "trigger": trigger,
    "replace_existing": True,
}
