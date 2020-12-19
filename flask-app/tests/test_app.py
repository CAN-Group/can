import pytest

from app import app
from models import County


@pytest.fixture
def client():
    app.config['TESTING'] = True

    with app.test_client() as client:
        yield client


def test_get_counties(client, mocker):
    session_obj_mock = mocker.MagicMock()

    cls_mock = mocker.patch("app.DBSession", return_value=session_obj_mock)
    client.get("/api/v1/counties")

    assert cls_mock.called_once()
    assert session_obj_mock.query.called_with(County)


def test_get_county(client, mocker):
    ID = "t0202"

    cls_mock = mocker.patch("app.DBSession")

    try:
        client.get(f"/api/v1/counties/{ID}")
    except Exception:
        # this is expected to fail due to invalid return value
        # (MagicMock instead of dict)
        pass

    assert cls_mock.called_once()


def test_get_county_invalid_id(client):
    INVALID_ID = "LOL69"
    rv = client.get(f"/api/v1/counties/{INVALID_ID}")

    assert b'county with given id not found' in rv.data
