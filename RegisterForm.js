import React, { useState } from 'react';
import { Text, TextInput, Button, View } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import styles from './LoginFormStyles';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [boatType, setBoatType] = useState('canoe');
  const [errorMessage, setErrorMessage] = useState('');
  const navigation = useNavigation();

  const validateUsername = (username) => {
    const usernamePattern = /^[a-zA-Z][a-zA-Z0-9_]*$/;
    return usernamePattern.test(username);
  };

  const validateEmail = (email) => {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailPattern.test(email);
  };

  const handleRegister = () => {
    if (!validateUsername(username)) {
      setErrorMessage('Username must start with a letter and contain only letters, numbers, and underscores.');
      return;
    }

    if (!validateEmail(email)) {
      setErrorMessage('Please enter a valid email address.');
      return;
    }

    // If validation passes, clear the error message
    setErrorMessage('');

    console.log('Email:', email);
    console.log('Username:', username);
    console.log('Password:', password);
    console.log('Boat Type:', boatType);

    // Navigate back to the Login screen after registration
    navigation.navigate('Login');
  };

  return (
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
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              onChangeText={setUsername}
              value={username}
              placeholder="Enter your username"
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
          {errorMessage ? (
            <Text style={styles.errorText}>{errorMessage}</Text>
          ) : null}
          <Button title="Register" onPress={handleRegister} color="green" />
        </View>
      </View>
    </View>
  );
}
