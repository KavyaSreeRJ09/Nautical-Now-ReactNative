import axios from 'axios';

// Replace with your Flask API endpoint

export const getForecast = async (sshData) => {
    try {
        // Send POST request with sshData
        const API_URL = 'http://127.0.0.1:3000/api/forecast';
        const response = await axios.post(API_URL, { ssh_data: sshData });
        return response.data.forecast;
    } catch (error) {
        console.error('Error fetching forecast:', error.response ? error.response.data : error.message);
        throw error;
    }
};

