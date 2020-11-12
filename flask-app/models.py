from datetime import datetime

from sqlalchemy import Column, DateTime, Float, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm.exc import DetachedInstanceError


class BaseMixin(object):
    def __repr__(self):
        fields = list()
        for key in vars(self):
            if not key.startswith("_"):
                try:
                    value = repr(getattr(self, key))
                except DetachedInstanceError:
                    value = "DetachedInstanceError"
                finally:
                    fields.append(f"{key}={value}")
        output = ",".join(fields)
        return f"{self.__class__.__name__}({output})"

    def to_dict(self):
        output = {}
        for key in vars(self):
            if not key.startswith("_"):
                try:
                    output[key.rstrip("_")] = str(getattr(self, key))
                except DetachedInstanceError:
                    pass
        return output


Base = declarative_base(cls=BaseMixin)


class County(Base):
    """Database model for counties (powiats)
    - id_ = county ID compliant with TERYT
    - name = county name
    - population = number of citizens
    - number_of_cases = number of COVID-19 cases at last update
    - percent_of_pop = number_of_cases / population * 100
    - update_datetime = datetime of last update
    """

    __tablename__ = "counties"

    id_ = Column(String, primary_key=True)
    name = Column(String, nullable=False)
    population = Column(Integer, nullable=True)
    number_of_cases = Column(Integer, nullable=True)
    percent_of_pop = Column(Float, nullable=True)
    update_datetime = Column(DateTime, nullable=True)

    def update_number_of_cases(self, cases: int, updated: datetime = None):
        assert cases > 0

        self.number_of_cases = cases
        self.percent_of_pop = cases / self.population * 100
        self.update_datetime = updated or datetime.utcnow()

        return True
