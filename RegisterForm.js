import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Button, ImageBackground, Text, TextInput, View } from 'react-native';
import styles from './LoginFormStyles';
import SlidingMessage from './SlidingMessage';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [boatType, setBoatType] = useState('canoe');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false); // New state for loading indicator
  const navigation = useNavigation();
  const API_URL = 'http://192.168.162.211:5000/api/register';  // Ensure the port is included

  const handleRegister = async () => {
    // Input validation
    if (/^\d/.test(username)) {
      setErrorMessage('Username cannot start with a number.');
      setShowError(true);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setErrorMessage('Please enter a valid email address.');
      setShowError(true);
      return;
    }
    if (password.length < 6) { // Optional: Password length validation
      setErrorMessage('Password must be at least 6 characters long.');
      setShowError(true);
      return;
    }

    // Prepare form data
    const userData = {
      username,
      emailId: email,
      password,
      boatType,
    };

    try {
      setLoading(true); // Start loading

      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (response.ok) {
        // Registration successful
        Alert.alert(
          'Success',
          'Registration successful!',
          [
            { text: 'OK', onPress: () => navigation.navigate('Login') }
          ],
          { cancelable: false }
        );
      } else {
        // Handle error response from the backend
        setErrorMessage(result.error || 'An error occurred during registration');
        setShowError(true);
      }
    } catch (error) {
      console.error('Error registering user:', error);
      setErrorMessage('Network error or server is down');
      setShowError(true);
    } finally {
      setLoading(false); // Stop loading
    }
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
            <Text style={styles.header}>Register</Text>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={setEmail}
                value={email}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
            <View style={styles.formGroup}>
              <Text style={styles.label}>Username</Text>
              <TextInput
                style={styles.input}
                onChangeText={setUsername}
                value={username}
                placeholder="Enter your username"
                autoCapitalize="none"
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
            <View style={styles.formGroup}>
              <Text style={styles.label}>Boat Type</Text>
              <Picker
                selectedValue={boatType}
                style={styles.input}
                onValueChange={(itemValue) => setBoatType(itemValue)}
              >
                <Picker.Item label="Canoe (Vallam)" value="canoe" />
                
                <Picker.Item label="Catamaran (Kattumaram)" value="catamaran" />
                <Picker.Item label="Motor Boat" value="motorboat" />
              </Picker>
            </View>
            
            {loading ? (
              <ActivityIndicator size="large" color="#0000ff" style={{ marginVertical: 10 }} />
            ) : (
              <Button title="Register" onPress={handleRegister} color="green" />
            )}
          </View>
        </View>

        {/* Sliding Error Message */}
        <SlidingMessage message={errorMessage} visible={showError} />
      </View>
    </ImageBackground>
  );
}
