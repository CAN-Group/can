FROM python:3.9.0-slim

WORKDIR /app

RUN pip install pipenv
COPY Pipfile* ./
RUN pipenv install --system --deploy

COPY . .

CMD python main.py
