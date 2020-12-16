import os

import datetime
import requests
from flask import Flask, Response
from flask_cors import CORS

import settings
from database import DBSession
from models import County, Voivodeship, CasesRecord

from sqlalchemy.orm.exc import NoResultFound

app = Flask(__name__, static_folder="./static")
app.config["JSON_AS_ASCII"] = False
app.config["JSONIFY_PRETTYPRINT_REGULAR"] = True

CORS(app, origin={settings.FRONTEND_APP_URL})


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
    endpoint = {County: "counties", Voivodeship: "voivodeships"}[model]
    db_session = DBSession()
    return {endpoint: [x.to_dict() for x in db_session.query(model).all()]}


def get_region(model, region_id):
    db_session = DBSession()
    region = db_session.query(model).filter_by(id_=region_id).first()
    if not region:
        return f"{model.__name__} with given id not found", 400
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


class WrongDateError(Exception):
    pass


@app.errorhandler(WrongDateError)
def handle_wrong_date(e):
    return "Wrong date provided", 400


@app.errorhandler(NoResultFound)
def handle_no_data(e):
    return "No data available", 400


def str_to_date(date_str):
    try:
        dt = datetime.datetime.strptime(date_str, "%d-%m-%Y").date()
    except ValueError:
        raise WrongDateError

    return dt


def get_newest_updated():
    db_session = DBSession()
    record = db_session.query(CasesRecord).order_by(CasesRecord.updated.desc()).first()
    try:
        return record.updated
    except AttributeError:
        raise NoResultFound()


@app.route("/api/v1/cases/")
def get_cases():
    updated = get_newest_updated()
    return get_cases_from(updated.strftime("%d-%m-%Y"))


@app.route("/api/v1/cases/<string:date>")
def get_cases_from(date):
    db_session = DBSession()
    dt = str_to_date(date)
    records = db_session.query(CasesRecord).filter_by(updated=dt.date()).all()
    if not records:
        raise NoResultFound
    return {"cases": [record.county.to_dict() for record in records]}


@app.route("/api/v1/cases/for/<string:county_id>")
def get_cases_for(county_id):
    updated = get_newest_updated()
    return get_cases_from_for(updated.strfdate("%d-%m-%Y"), county_id)


@app.route("/api/v1/cases/<string:date>/for/<string:county_id>")
def get_cases_from_for(date, county_id):
    db_session = DBSession()
    dt = str_to_date(date)
    record = db_session.query(CasesRecord).filter_by(updated=dt, county_id=county_id).first()
    if not record:
        raise NoResultFound
    
    return record.county.to_dict()


if __name__ == "__main__":
    app.run(debug=settings.DEBUG)
