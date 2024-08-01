import React, { useState, useEffect } from 'react';
import { Text, TextInput, Button, View } from 'react-native';
import * as Location from 'expo-location';
import { useNavigation } from '@react-navigation/native';
import styles from './LoginFormStyles'; // Import the styles

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message
  const navigation = useNavigation(); // Access the navigation object

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

      // Reverse geocode to get the city name
      let [reverseGeocode] = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (reverseGeocode) {
        setCity(reverseGeocode.city || reverseGeocode.subregion || 'Unknown');
      }
    })();
  }, []);

  const handleLogin = () => {
    if (!email || !password) {
      setErrorMessage('Please fill in both email and password.');
      return;
    }
    
    // Clear error message if input fields are valid
    setErrorMessage('');

    // Handle login logic here
    console.log('Email:', email);
    console.log('Password:', password);
  };

  const handleRegister = () => {
    navigation.navigate('Register'); // Navigate to the Register screen
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.heading}>Nautical Now</Text>
        <View style={styles.loginFormContainer}>
          <Text style={styles.header}>Login</Text>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              onChangeText={setEmail}
              value={email}
              placeholder="Enter your email"
              keyboardType="email-address"
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <TextInput
              style={styles.input}
              onChangeText={setPassword}
              value={password}
              placeholder="Enter your password"
              secureTextEntry
            />
          </View>
          <Button title="Login" onPress={handleLogin} />
          <Button title="Register" onPress={handleRegister} color="green" />
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text> // Display error message
          ) : null}
          {location && (
            <View style={styles.locationContainer}>
              <Text style={styles.locationInfo}>
                Latitude: {location.latitude.toFixed(2)}, Longitude: {location.longitude.toFixed(2)}
              </Text>
              <Text style={styles.locationInfo}>City: {city}</Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
