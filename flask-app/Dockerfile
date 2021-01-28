FROM python:3.9.0-slim

WORKDIR /app

RUN pip install pipenv gunicorn
COPY Pipfile* ./
RUN pipenv install --system --deploy

COPY . .

ENV WSGI_IP 0.0.0.0
ENV WSGI_PORT 8080

CMD gunicorn --timeout 300 --bind "$WSGI_IP:$WSGI_PORT" wsgi:app
