#!/usr/bin/env bash
# Render build script for the Django backend
# This runs automatically on every deploy

set -o errexit

pip install -r requirements.txt
python manage.py collectstatic --noinput
python manage.py migrate
