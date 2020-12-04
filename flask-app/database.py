from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import settings
from models import Base
from static_data_api import get_counties, get_voivodeships, load_counties_csv

engine = create_engine(settings.DB_CONNECTION_URI)
Session = sessionmaker(bind=engine)


def recreate_schema():
    Base.metadata.create_all(bind=engine, checkfirst=True)

    session = Session()

    df = load_counties_csv()

    voivodeships = get_voivodeships(df)
    for voivodeship in voivodeships:
        session.merge(voivodeship)

    counties = get_counties(df)
    for county in counties:
        session.merge(county)

    session.commit()
    return True


if __name__ == "__main__":
    recreate_schema()
    exit(0)
