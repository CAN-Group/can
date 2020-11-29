from flask import Flask
from flask_cors import CORS

import settings
from database import Session
from models import County

app = Flask(__name__, static_folder="./static")
app.config["JSON_AS_ASCII"] = False

CORS(app, origin={settings.FRONTEND_APP_URL})


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
