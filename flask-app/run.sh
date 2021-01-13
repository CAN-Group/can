#!/bin/bash

if [[ -z "$WSGI_IP" ]]; then
    WSGI_IP="0.0.0.0"
fi

if [[ -z "$WSGI_PORT" ]]; then
    WSGI_PORT="80"
fi

gunicorn --bind "$WSGI_IP:$WSGI_PORT" wsgi:app
