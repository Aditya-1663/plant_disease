from flask import Blueprint, render_template, request,jsonify
from markupsafe import Markup
import os, random, base64
from .model import predict_image
import app.utils as utils
from datetime import datetime
from app import mongo 
main = Blueprint('main', __name__)
def separate_string(input_str):
    
    parts = input_str.split('_', 1)
    first_part = parts[0]

    if len(parts) > 1:
        rest = parts[1]
        
        words = [word for word in rest.split('_') if word]
        second_part = ' '.join(words)
    else:
        second_part = ''

    return first_part, second_part
@main.route('/')
def home():
    return render_template('index.html')


@main.route('/predict', methods=['POST'])
def predict():
    try:
        
        img = None
        # upload_folder = os.path.join(os.getcwd(), 'uploads')
        # os.makedirs(upload_folder, exist_ok=True)

        if 'file' in request.files and request.files['file'].filename != '':
            file = request.files['file']
            img = file.read()
            
            filename = f"uploaded_{random.randint(1, 10000)}.jpg"
            # file_path = os.path.join(upload_folder, filename)
            # with open(file_path, 'wb') as f:
            #     f.write(img)
           

        elif 'captured_image' in request.form and request.form['captured_image']:
            data_url = request.form['captured_image']
            _, encoded = data_url.split(',', 1)
            img = base64.b64decode(encoded)
            
            filename = f"captured_{random.randint(1, 10000)}.jpg"
            # file_path = os.path.join(upload_folder, filename)
            # with open(file_path, 'wb') as f:
            #     f.write(img)
           

        else:
          
            return render_template('index.html', status=400, res="No image received.")
        location = request.form.get('location')
        name = request.form.get('name')
        email = request.form.get('email')
        

        prediction = predict_image(img)
        
        plantname,plantdisease=separate_string(prediction)
        
        res = Markup(utils.disease_dic.get(prediction, "Unknown Disease"))
       
        data = {
            "datetime": datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S'),
            "userId": email, 
            "location": location,
            "plantname": plantname,
            "disease": plantdisease,
          
            "details": {
                "cropType": plantname,
               
                "processingTime": f"{round(random.uniform(0.8, 1.5), 1)}s",
               
            }
        }
        
        try:
            
          
            mongo.db.userlog.insert_one(data)
            
        except Exception as e:
            app.logger.error("Error saving feedback: %s", e)
            flash("An error occurred. Please try again later.", "danger")
        return render_template('display.html', status=200, result=res)

    except Exception as e:
        print(f"Prediction Error: {e}")
        return render_template('index.html', status=500, res="Internal Server Error")
@main.route('/logout')
def logout():
    session.clear()  
    return render_template('index.html'),200 


@main.route('/getuserlog', methods=['GET'])

def getuserlog():
    try:
        userlogdata= mongo.db.userlog.find().sort("timestamp", -1)
        data = []
       
        for fb in userlogdata:
            fb['_id'] = str(fb['_id'])  
            data.append(fb)
     
        return jsonify(data), 200
    except Exception as e:
      
        return jsonify({"error": "Failed to fetch feedbacks","eee":e}), 500 
