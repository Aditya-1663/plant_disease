from flask import Blueprint,jsonify, request, render_template, redirect, url_for, flash
from bson import ObjectId
from datetime import datetime
from app import mongo 


feedback_bp = Blueprint('feed', __name__)

@feedback_bp.route('/submitfeedback', methods=[ 'POST'])
def submitfeedback():
   
    if request.method == 'POST':
        name = request.form.get('name')
        email = request.form.get('email')
        rating = request.form.get('rating')
        feedback_type = request.form.get('feedbackType')
        message = request.form.get('message')

        feedback_data = {
            "name": name,
            "email": email,
            "rating": int(rating),
            "type": feedback_type,
            "message": message,
            "timestamp": datetime.utcnow()
        }
      

        try:
            
            mongo.db.feedback.insert_one(feedback_data)
            flash("Thank you for your feedback!", "success")
        except Exception as e:
           
            flash("An error occurred. Please try again later.", "danger")

        return render_template('feedback.html'), 200
       

   
    return render_template('feedback.html'), 200

from flask import jsonify

@feedback_bp.route('/allfeedbacks', methods=['GET'])
def get_feedbacks():
    try:
        feedbacks_cursor = mongo.db.feedback.find().sort("timestamp", -1)
        feedbacks = []
      
        for fb in feedbacks_cursor:
            fb['_id'] = str(fb['_id'])  
            feedbacks.append(fb)
        return jsonify(feedbacks), 200
    except Exception as e:
        app.logger.error("Could not fetch feedbacks: %s", e)
        return jsonify({"error": "Failed to fetch feedbacks"}), 500 
