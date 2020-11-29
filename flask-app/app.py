import os

from flask import Flask
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


@app.route("/api/v1/counties")
def get_counties():
    session = Session()
    return {"counties": [county.to_dict() for county in session.query(County).all()]}


if __name__ == "__main__":
    app.run(debug=settings.DEBUG)
