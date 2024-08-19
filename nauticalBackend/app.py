import joblib
import numpy as np
import tensorflow as tf
from flask import Flask, jsonify, request
from flask_cors import CORS  # Import CORS

app = Flask(__name__)

# Enable CORS for all origins
CORS(app)

# Load the LSTM model and scaler
model = tf.keras.models.load_model('lstm_model.h5')
scaler = joblib.load('scaler.pkl')

@app.route('/api/forecast', methods=['POST'])
def get_forecast():
    try:
        # Get JSON data from the request
        data = request.json.get('ssh_data')
        print(data)
        if data is None:
            return jsonify({'error': 'No SSH data provided'}), 400
        
        # Validate data is a list of numbers
        if not isinstance(data, list) or not all(isinstance(i, (int, float)) for i in data):
            return jsonify({'error': 'Invalid SSH data format. Expected an array of numbers.'}), 400

        # Preprocess the input data
        data = np.array(data).reshape(-1, 1)
        data = scaler.transform(data)
        data = np.expand_dims(data, axis=0)
        
        # Make the prediction using the LSTM model
        prediction = model.predict(data)
        forecast = scaler.inverse_transform(prediction)
        
        # Return the forecast as a JSON response
        return jsonify({'forecast': forecast[0].tolist()})
    
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return jsonify({'error': 'An error occurred while processing your request'}), 500

if __name__ == '__main__':
    app.run(debug=True, host="192.168.43.211", port=5000)
