from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

import settings
from counties import load_counties_from_csv
from models import Base

engine = create_engine(settings.DB_CONNECTION_URI)
Session = sessionmaker(bind=engine)


def recreate_schema():
    Base.metadata.create_all(bind=engine, checkfirst=True)

    session = Session()

    counties = load_counties_from_csv()
    for county in counties:
        session.merge(county)

    session.commit()
    return True


if __name__ == "__main__":
    recreate_schema()
    exit(0)
