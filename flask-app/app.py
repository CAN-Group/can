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


@app.errorhandler(NoResultFound)
def handle_no_data(e):
    return "No data available", 400


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


def get_county_ids_from_cases():
    db_session = DBSession()
    columns = db_session.query(CasesRecord.county_id).distinct()
    return [county_id for county_id in columns]


@app.route("/api/v1/cases/")
def get_cases():
    '''Get most recent cases for each county.'''
    ids = get_county_ids_from_cases()
    return {"cases": [get_cases_for(id) for id in ids]}


@app.route("/api/v1/cases/<string:date_str>")
def get_cases_from(date_str):
    '''Get most recent cases up till given date for each county.'''
    ids = get_county_ids_from_cases()

    records_dicts = []
    for id in ids:
        try:
            cases = get_cases_from_for(date_str, id)
        except NoResultFound:
            continue
        records_dicts.append(cases)

    if not records_dicts:
        raise NoResultFound

    return {"cases": records_dicts}


@app.route("/api/v1/cases/for/<string:county_id>")
def get_cases_for(county_id):
    '''Get most recent cases entry for county of given id.'''
    db_session = DBSession()
    record = db_session.query(CasesRecord) \
        .filter_by(county_id=county_id) \
        .order_by(CasesRecord.updated.desc()).first()

    if not record:
        raise NoResultFound
    return record.to_dict()


@app.route("/api/v1/cases/<string:date_str>/for/<string:county_id>")
def get_cases_from_for(date_str, county_id):
    '''Get most recent cases entry up till given date for county of given id.'''
    db_session = DBSession()
    try:
        dt = datetime.datetime.strptime(date_str, r"%Y-%m-%d").date()
    except ValueError:
        return "Wrong date provided. Please use the proper format: 'DD-MM-YYYY'", 400

    record = db_session.query(CasesRecord) \
        .filter_by(county_id=county_id) \
        .order_by(CasesRecord.updated.desc()) \
        .filter(CasesRecord.updated <= dt).first()

    if not record:
        raise NoResultFound
    return record.to_dict()


if __name__ == "__main__":
    app.run(debug=settings.DEBUG)
