from app import app
from database import recreate_schema

if __name__ == "__main__":
    recreate_schema()
    app.run()
