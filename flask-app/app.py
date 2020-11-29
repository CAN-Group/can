import requests
from flask import Flask, Response
from flask_cors import CORS

import settings
from database import Session
from models import County

app = Flask(__name__, static_folder="./static")
app.config["JSON_AS_ASCII"] = False

CORS(app, origin={settings.FRONTEND_APP_URL})


@app.route("/api/v1/counties")
def get_counties():
    session = Session()
    return {"counties": [county.to_dict() for county in session.query(County).all()]}


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


if __name__ == "__main__":
    app.run(debug=settings.DEBUG)
