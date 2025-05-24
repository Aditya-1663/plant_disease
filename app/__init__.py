
from flask import Flask
from flask_pymongo import PyMongo
from flask_cors import CORS
import json
from dotenv import load_dotenv
import os
load_dotenv() 
mongo = PyMongo()  

from app.route import main
from app.feedback import feedback_bp
def create_app():
    app = Flask(__name__)
    CORS(app)
    app.config['MAX_CONTENT_LENGTH'] = 50 * 1024 * 1024  
    app.secret_key = 'your-very-secret-key'
    
    # app.config["MONGO_URI"] = "mongodb+srv://aditya:aditya@cluster0.xlqi2oo.mongodb.net/mydb?retryWrites=true&w=majority&appName=Cluster0"
    app.config["MONGO_URI"] = os.getenv("MONGO_URI")
    
    mongo.init_app(app)
    try:
        mongo.cx.server_info()
        print("MongoDB connection successful")
    except Exception as e:
        print(f"MongoDB connection error: {e}")

    from app.routes.auth import auth_bp
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(main)
    app.register_blueprint(feedback_bp)

    return app

