# 🌱 Flask App on Hugging Face Spaces

This is a Flask application deployed on Hugging Face using Docker.

## Features
- Uses Flask
- Loads `plants_data.json` data
- Runs on port 7860 (required by HF Spaces)

## How to Run Locally

```bash
docker build -t my-flask-app .
docker run -p 7860:7860 my-flask-app
