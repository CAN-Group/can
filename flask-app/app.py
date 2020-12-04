import os

import requests
from flask import Flask, Response
from flask_cors import CORS

import settings
from database import Session
from models import County

app = Flask(__name__, static_folder="./static")
app.config["JSON_AS_ASCII"] = False

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


@app.route("/api/v1/counties")
def get_all_counties():
    session = Session()
    return {"counties": [county.to_dict() for county in session.query(County).all()]}


@app.route("/api/v1/counties/<string:county_id>")
def get_county(county_id):
    session = Session()
    county = session.query(County).filter_by(id_=county_id).first()
    if not county:
        return "county with given id not found", 400
    return county.to_dict()


if __name__ == "__main__":
    app.run(debug=settings.DEBUG)
