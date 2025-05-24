
from flask import Blueprint, request, jsonify,g, render_template, redirect, url_for, flash, session
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from bson.objectid import ObjectId
from app import mongo  
from app.middleware.fatchuser import token_required
from dotenv import load_dotenv
import os
load_dotenv() 

auth_bp = Blueprint('auth', __name__)

SECRET_KEY = os.getenv("JWT_SECRET")  

def generate_token(user_id):
    payload = {
        'user_id': str(user_id),
        'exp': datetime.utcnow() + timedelta(hours=1)
    }
    return jwt.encode(payload, SECRET_KEY, algorithm='HS256')

def verify_token(token):
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=['HS256'])['user_id']
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

@auth_bp.route('/register', methods=['POST'])
def register():
   
    email = request.form.get('email')
    password = request.form.get('password')
    name = request.form.get('name')

   
 

    if email[0] == '#' and mongo.db.adminusers.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 400
    if mongo.db.users.find_one({'email': email}):
        return jsonify({'error': 'Email already exists'}), 400

    hashed_pw = generate_password_hash(password)
    print("Hashed password: ", hashed_pw)
    if email[0] == '#':
        user_id = mongo.db.adminusers.insert_one({'name': name, 'email': email, 'password': hashed_pw}).inserted_id
    else:
        user_id = mongo.db.users.insert_one({'name':name,'email': email, 'password': hashed_pw}).inserted_id
   
    print("User ID: ", user_id)
    token = generate_token(user_id)

    
    return render_template('login.html')

@auth_bp.route('/login', methods=['POST'])
def login():
  
   
    email = request.form.get('email')
    password = request.form.get('password')
    
    
    if email.startswith('#'):
        user = mongo.db.adminusers.find_one({'email': email})
        is_admin = True
    else:
        user = mongo.db.users.find_one({'email': email})
        is_admin = False

    if not user or not check_password_hash(user['password'], password):
        return jsonify({'error': 'Invalid credentials'}), 401

    print("User found: ", user)
    session['name'] = user['name']
    session['email'] = user['email']
    session['is_admin'] = is_admin  
    token = generate_token(user['_id'])
    return render_template('index.html'), 200


@auth_bp.route('/user', methods=['GET'])
@token_required
def get_user():
    user_id = g.user_id
    
    
    user = mongo.db.users.find_one({'_id': ObjectId(user_id)}, {'password': 0})
    if not user:
        return jsonify({'error': 'User not found'}), 404
    user['_id'] = str(user['_id'])
    
    
    return jsonify({'user': user})

@auth_bp.route('/logout')
def logout():
    session.clear()  
    return render_template('index.html'),200 