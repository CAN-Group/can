if __name__ == "__main__":
    from app import app
    from database import recreate_schema

    recreate_schema()
    app.run()
