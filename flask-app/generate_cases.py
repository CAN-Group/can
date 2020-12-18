import datetime
from datetime import date

from database import DBSession
from models import CasesRecord, County

import typer


def generate_for_day(counties, dt, percent):
    for county in counties:
        cases_no = round(county.population * percent)
        cases = next(filter(lambda c: c.updated == dt, county.cases), None)
        if cases:
            cases.number_of_cases = cases_no
            continue

        cs = CasesRecord(county=county, updated=dt, number_of_cases=cases_no)


def generate_for_days(day_count: int):
    session = DBSession()
    counties = session.query(County).all()
    today = date.today()

    for i in range(day_count):
        dt = today - datetime.timedelta(i)
        generate_for_day(counties, dt, (day_count - i) * 0.001 / (day_count))

    session.commit()


if __name__ == "__main__":
    typer.run(generate_for_days)