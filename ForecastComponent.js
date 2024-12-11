import React, { useState } from 'react';
import { ActivityIndicator, Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { getForecast } from './apiService';

const ForecastComponent = () => {
    const [input, setInput] = useState('');
    const [forecast, setForecast] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleFetchForecast = async () => {
        setError(''); // Clear previous errors
        setForecast(null); // Clear previous forecast
        setLoading(true); // Start loading
    
        try {
            const data = input.split(',').map(Number);
    
            // Validate input data
            if (data.some(isNaN)) {
                setError('Please enter valid numbers separated by commas.');
                setLoading(false);
                return;
            }
    
            const result = await getForecast(data);
            setForecast(result);
        } catch (error) {
            console.error('Error:', error);
            setError('Failed to fetch forecast.');
        } finally {
            setLoading(false); // End loading
        }
    };
    

    return (
        <View style={styles.container}>
            <Text>Enter SSH Data (comma-separated):</Text>
            <TextInput
                style={styles.input}
                placeholder="e.g. 1.2, 2.3, 3.4"
                onChangeText={setInput}
                value={input}
                keyboardType="numeric"
            />
            <Button title="Get Forecast" onPress={handleFetchForecast} />
            {loading && <ActivityIndicator size="large" color="#6200EE" style={styles.loader} />}
            {forecast !== null && (
                <Text style={styles.forecastText}>Forecast: {forecast}</Text>
            )}
            {error !== '' && (
                <Text style={styles.errorText}>{error}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 10,
        paddingHorizontal: 8,
    },
    errorText: {
        color: 'red',
        marginTop: 10,
    },
    loader: {
        marginTop: 10,
    },
    forecastText: {
        marginTop: 10,
        fontSize: 16,
    },
});

export default ForecastComponent;
