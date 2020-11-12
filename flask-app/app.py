from flask import Flask
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


if __name__ == "__main__":
    app.run(debug=settings.DEBUG)
