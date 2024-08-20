import { useNavigation } from '@react-navigation/native';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import styles from './LoginFormStyles'; // Import the styles

export default function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [location, setLocation] = useState(null);
  const [city, setCity] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);

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

    setErrorMessage('');

    navigation.navigate('Maps', { location });
  };

  return (
    <ImageBackground 
      source={require('./beachbg.jpg')} // Ensure the path is correct
      style={styles.backgroundImage}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <Text style={styles.heading}>Nautical Now</Text>
          <View style={styles.loginFormContainer}>
            {/* Removed the "Login" heading */}
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
            <TouchableOpacity style={[styles.button, styles.loginButton]} onPress={handleLogin}>
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.registerButton]} onPress={() => navigation.navigate('Register')} >
              <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            {errorMessage ? (
              <Text style={styles.errorText}>{errorMessage}</Text>
            ) : null}
            {location && (
              <View style={styles.locationContainer}>
                <Text style={styles.locationInfo}>
                  Latitude: {location.latitude.toFixed(2)}, Longitude: {location.longitude.toFixed(2)}
                </Text>
                <Text style={styles.locationInfo}>City Name: {city}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}
