
from app import create_app
from flask import render_template, request
from markupsafe import Markup

import json

from app.model import predict_image
import app.utils as utils
import os
import random



app = create_app()

@app.route('/', methods=['GET'])
def home():
    return render_template('index.html')
def load_plant_data():
    with open('plants_data.json', 'r') as file:
        return json.load(file)


@app.route('/plants')
def plants():
    plants_data = load_plant_data()
    return render_template('plants.html', plants=plants_data)
@app.route('/userlog')
def userlog():
    return render_template('userlog.html')

@app.route('/plants/<plant_id>')
def plant_details(plant_id):
    plants_data = load_plant_data()
    plant = next((p for p in plants_data if p['id'] == plant_id), None)
    
    if plant:
        return render_template('plant_details.html', plant=plant)
    else:
        return "Plant not found", 404
@app.route('/login')
def login():
    return render_template('login.html')
@app.route('/feedback')
def feedback():
    return render_template('feedback.html')
@app.route('/faq')
def faq():
    return render_template('faq.html')

@app.route('/detect')
def detect():
    return render_template('detect.html')
    

@app.route('/register')
def register():
    return render_template('register.html')

if __name__ == "__main__":
     app.run(host='0.0.0.0', port=7860)
