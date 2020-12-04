from sqlalchemy import Column, Date, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
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


Base = declarative_base(cls=BaseMixin)


class Voivodeship(Base):
    """Database model for voivodeships (województwas)
    - id_ = voivodeship ID compliant with TERYT (column "id" in database, primary key)
    - name = voivodeship name
    """

    __tablename__ = "voivodeships"

    id_ = Column("id", String(3), primary_key=True)
    name = Column(String(64), nullable=False)

    counties = relationship("County", uselist=True, back_populates="voivodeship")

    @staticmethod
    def get_id_from_county_id(county_id: str):
        return county_id[:3]

    @classmethod
    def from_csv(cls, id_: str, voivodeship: str):
        id_ = cls.get_id_from_county_id(id_)
        return cls(id_=id_, name=voivodeship)


class County(Base):
    """Database model for counties (powiaty)
    - id_ = county ID compliant with TERYT (column "id" in database, primary key)
    - voivodeship_id = county's voivodeship ID (foreign key)
    - name = county name
    - population = number of citizens
    """

    __tablename__ = "counties"

    id_ = Column("id", String(5), primary_key=True)  # 'id_' in ORM, 'id' in DB
    voivodeship_id = Column(String(3), ForeignKey("voivodeships.id"), nullable=False)
    name = Column(String(64), nullable=False)
    population = Column(Integer, nullable=True)

    voivodeship = relationship("Voivodeship", uselist=False, back_populates="counties")
    cases = relationship("CasesRecord", uselist=True, back_populates="county")

    @classmethod
    def from_csv(cls, id_: str, county: str, population: int):
        voivodeship_id = Voivodeship.get_id_from_county_id(id_)
        return cls(
            id_=id_, voivodeship_id=voivodeship_id, name=county, population=population
        )


class CasesRecord(Base):
    """Database model for covid cases records for a county on a single day
    - county_id = county ID (primary key, foreign key)
    - updated = date of cases record (primary key)
    - number_of_cases = number of cases registered that day
    """

    __tablename__ = "cases_records"

    county_id = Column(String(5), ForeignKey("counties.id"), primary_key=True)
    updated = Column(Date, primary_key=True)
    number_of_cases = Column(Integer, nullable=False)

    county = relationship("County", uselist=False, back_populates="cases")
