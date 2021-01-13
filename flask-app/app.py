import os
from datetime import date

import requests
from flask import Flask, Response
from flask_cors import CORS
from sqlalchemy.orm.exc import NoResultFound

import settings
from database import DBSession
from models import County, Voivodeship

app = Flask(__name__, static_folder="./static")
app.config["JSON_AS_ASCII"] = False
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = True

CORS(app, origin={settings.FRONTEND_APP_URL})


class WrongDateError(Exception):
    """Raised when date conversion fails"""


@app.errorhandler(NoResultFound)
def handle_no_data(e):
    return "No data available", 400


@app.errorhandler(WrongDateError)
def handle_wrong_date(e):
    return "Wrong date provided. Please use the proper format: 'YYYY-MM-DD'", 400


@app.route("/")
def sitemap():
    endpoints = {
        rule.rule: rule.endpoint
        for rule in app.url_map.iter_rules()
        if rule.endpoint != "static"
    }
    static_files = os.listdir("./static")
    for static_file_path in static_files:
        endpoints[f"/static/{static_file_path}"] = static_file_path
    return endpoints


@app.route("/api/v1/route/<string:parameters>")
def proxy_request_to_brouter(parameters):
    url = settings.ROUTING_APP_URL
    url = f"{url}?{parameters}"
    response = requests.get(url)
    excluded_headers = [
        "content-encoding",
        "content-length",
        "transfer-encoding",
        "connection",
    ]
    headers = [
        (key, value)
        for (key, value) in response.headers.items()
        if key.lower() not in excluded_headers
    ]
    return Response(response.content, response.status_code, headers)


def get_regions(model):
    db_session = DBSession()
    return {model.__tablename__: [x.to_dict() for x in db_session.query(model).all()]}


def get_region(model, region_id):
    db_session = DBSession()
    region = db_session.query(model).filter_by(id_=region_id).one()
    return region.to_dict()


@app.route("/api/v1/voivodeships")
def get_all_voivodeships():
    return get_regions(Voivodeship)


@app.route("/api/v1/counties")
def get_all_counties():
    return get_regions(County)


@app.route("/api/v1/voivodeships/<string:voivodeship_id>")
def get_voivodeship(voivodeship_id):
    return get_region(Voivodeship, voivodeship_id)


@app.route("/api/v1/counties/<string:county_id>")
def get_county(county_id):
    return get_region(County, county_id)


def str_to_date(date_str):
    try:
        dt = date.fromisoformat(date_str)
    except ValueError:
        raise WrongDateError

    return dt


def get_most_recent_cases(cases_list):
    if not cases_list:
        raise NoResultFound
    return max(cases_list, key=lambda x: x.updated)


def extract_cases_from(date, cases_list):
    cases = next(filter(lambda c: c.updated == date, cases_list), None)
    if cases is None:
        raise NoResultFound
    return cases


@app.route("/api/v1/cases/")
def get_cases():
    """Get most recent cases for each county."""
    db_session = DBSession()
    cases = []
    for county in db_session.query(County):
        try:
            cases.append(get_most_recent_cases(county.cases).to_dict())
        except NoResultFound:
            pass

    return {"cases": cases}


@app.route("/api/v1/cases/<string:date_str>")
def get_cases_from(date_str):
    """Get cases from given date for each county."""
    date = str_to_date(date_str)
    db_session = DBSession()
    records = []
    for county in db_session.query(County):
        try:
            records.append(extract_cases_from(date, county.cases))
        except NoResultFound:
            pass

    if not records:
        raise NoResultFound

    return {"cases": [record.to_dict() for record in records]}


@app.route("/api/v1/cases/for/<string:county_id>")
def get_cases_for(county_id):
    """Get most recent cases entry for county of given id."""
    db_session = DBSession()
    record = db_session.query(County).filter_by(id_=county_id).one()
    return get_most_recent_cases(record.cases).to_dict()


@app.route("/api/v1/cases/<string:date_str>/for/<string:county_id>")
def get_cases_from_for(date_str, county_id):
    """Get cases from given date for county of given id."""
    date = str_to_date(date_str)
    db_session = DBSession()
    record = db_session.query(County).filter_by(id_=county_id).one()

    return extract_cases_from(date, record.cases).to_dict()


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=settings.DEBUG)
