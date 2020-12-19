import os

import pytest

from database import recreate_schema


@pytest.fixture(scope='session', autouse=True)
def init_schema_for_tests():
    if not os.path.exists(os.getenv("DB_FILE_NAME")):
        recreate_schema()

    yield

    if os.getenv("DB_CLEANUP", "False").lower() in ("true", "1"):
        os.remove(os.getenv("DB_FILE_NAME"))
