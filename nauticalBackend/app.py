import bcrypt
import joblib
import numpy as np
import tensorflow as tf
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient

app = Flask(__name__)

# Enable CORS for all origins
CORS(app)

# MongoDB setup
client = MongoClient("mongodb+srv://sanjayanandharajan04:4YAEhm7Jq4xdqEnr@cluster0.1p4dv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
db = client['Nautical_Now']
collection = db['users_nautical_now']

# Load the LSTM model and scaler
model = tf.keras.models.load_model('lstm_model.h5')
scaler = joblib.load('scaler.pkl')

@app.route('/api/register', methods=['GET','POST'])
def register_user():
    try:
        data = request.json
        username = data.get('username')
        email = data.get('emailId')
        password = data.get('password')
        boat_type = data.get('boatType')

        if not username or not email or not password:
            return jsonify({'error': 'All fields are required'}), 400

        if collection.find_one({'email': email}):
            return jsonify({'error': 'User already exists with this email'}), 400

        # Hash the password using bcrypt
        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt())

        user = {
            'username': username,
            'email': email,
            'password': hashed_password,  # Store hashed password
            'boatType': boat_type
        }

        collection.insert_one(user)
        return jsonify({'message': 'Registration successful'}), 200

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while registering'}), 500
'''
@app.route('/api/login', methods=['POST'])
def login_user():
    try:
        data = request.json
        email = data.get('emailId')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email and password are required'}), 400

        user = collection.find_one({'email': email})

        if not user:
            return jsonify({'error': 'User not found'}), 404

        # Check the hashed password
        if not bcrypt.checkpw(password.encode('utf-8'), user['password']):
            return jsonify({'error': 'Incorrect password'}), 400

        return jsonify({'success': True}), 200

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while logging in'}), 500


'''
@app.route('/api/forecast', methods=['POST'])
def get_forecast():
    try:
        data = request.json.get('ssh_data')
        if data is None:
            return jsonify({'error': 'No SSH data provided'}), 400

        if not isinstance(data, list) or not all(isinstance(i, (int, float)) for i in data):
            return jsonify({'error': 'Invalid SSH data format. Expected an array of numbers.'}), 400

        data = np.array(data).reshape(-1, 1)
        data = scaler.transform(data)
        data = np.expand_dims(data, axis=0)

        prediction = model.predict(data)
        forecast = scaler.inverse_transform(prediction)

        return jsonify({'forecast': forecast[0].tolist()})

    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your request'}), 500

if __name__ == '__main__':
    app.run(debug=True, host="0.0.0.0", port=5000)
