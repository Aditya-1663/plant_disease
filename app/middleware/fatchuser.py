from functools import wraps
from flask import request, jsonify, g
import jwt
from dotenv import load_dotenv
import os
load_dotenv() 
SECRET_KEY = os.getenv("JWT_SECRET")

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        auth_header = request.headers.get("Authorization", "")
        parts = auth_header.split()
        
        if len(parts) != 2 or parts[0].lower() != "bearer":
            return jsonify({"error": "Invalid or missing Authorization header",
                            "auth_header": auth_header}), 401
                        

        token = parts[1]
        try:
            data = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
            
            g.user_id = data.get("user_id")
            if not g.user_id:
                return jsonify({'error': 'User ID missing in token'}), 401
        except jwt.ExpiredSignatureError:
            return jsonify({'error': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': 'Invalid token!'}), 401

        return f(*args, **kwargs)
    return decorated
