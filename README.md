<p align="center">
  <img src="/can-frontend/public/images/logo_with_shadow.png" width="210" height="68">
</p>

<p align="center">
  <em>
    A student project created by 
    <a href="https://github.com/Yamsha75">Yamsha75</a>,
    <a href="https://github.com/maciejczaja">maciejczaja</a>,
    <a href="https://github.com/Tamasa94">Tamasa94</a>,
    <a href="https://github.com/Glifu">Glifu</a>,
    <a href="https://github.com/Nieminik">Nieminik</a>
  </em>
</p>

# Getting started

## Using Docker (Unix or Windows with WSL2)

### Prerequisites
* [Docker](https://docs.docker.com/get-docker/)
* [Docker Compose](https://docs.docker.com/compose/install/)

### Get it up and running
First, set *POSTGRESS_PASSWORD* environment variable to a desired value (it can be any non-empty string).

on Unix systems: `export POSTGRESS_PASSWORD=<password>` 

on Windows: `set POSTGRESS_PASSWORD=<password>`

<hr />

Then build all the required images.

```
docker-compose build
```


It's time to start up the composition. 

```
docker-compose up -d
```

The last thing to do is to run the **get_segments.sh** from the router container.


```
docker exec -it can_router_1 /bin/sh -c "chmod +x /app/get_segments.sh && /app/get_segments.sh"
```

## Using release .zip

### Prerequisites

* Java Runtime Environment, version 7 or newer
* Python 3.9.0
* NodeJS

### Get it up and running


1. Download the newest archive from [releases](https://github.com/CAN-Group/can/releases) and unpack everything

2. Download the required map segments for brouter app:

  - on Unix systems: execute `brouter/misc/scripts/get_segments.sh`
  - on Windows 10: cd into `brouter/misc/scripts/` and execute `get_segments.cmd`
  - on older Windows releases: follow instructions in [this document](https://github.com/CAN-Group/can/blob/master/docs/segments.md) and place the files in `brouter/misc/segments4`

3. For backend and scraper you can either install required packages globally on your system or use a virtual environment of your choice. We advise using [pipenv](https://pypi.org/project/pipenv/)

    - using pip (globally): execute `pip install -r requirements.txt` in both `flask-app` and `scraper` directories
    - using pipenv (virtual environment): execute `pip install pipenv` globally, then execute `pipenv install` in both `flask-app` and `scraper` directories

4. For frontend, download and install NodeJS [from an executable](https://nodejs.org/en/download/) or from your [Linux package manager](https://nodejs.org/en/download/package-manager/). Then in `can-frontend` directory execute `npm install`

5. For database, you can either use a PostgreSQL database of your choice or a single-file-based SQLite. By default, both scraper and backend use SQLite with a database file `dev.db` placed in project root directory. For PostgreSQL, all you need to do is set `DB_CONNECTION_URI` environment variable - before running both backend and scraper - using this template: `postgresql://<db_username>:<db_password>@<db_host>:<port>/<database_name>`

6. Network requirements: to run properly, the services need these network ports available:
    - brouter: 17777
    - backend: 5000
    - frontend: 3000
    
7. Starting the services

    - brouter:
      - on Unix systems: execute `brouter/misc/scripts/standalone/server.sh`
      - on Windows: execute `brouter/misc/scripts/standalone/server.cmd`
    - scraper:
      - with pip: `python scraper/main.py`
      - with pipenv: `pipenv run py main.py` while in `scraper` directory
    - backend:
      - with pip: `python flask-app/app.py`
      - with pipenv: `pipenv run py app.py` while in `scraper` directory
    - frontend:
      - `npm start` while in `can-frontend` directory; a new tab with the application will open in your default browser

    
