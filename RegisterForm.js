import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import styles from './LoginFormStyles';
import SlidingMessage from './SlidingMessage';

export default function RegisterForm() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [boatType, setBoatType] = useState('canoe');
  const [errorMessage, setErrorMessage] = useState('');
  const [showError, setShowError] = useState(false);
  const navigation = useNavigation();

  const handleRegister = () => {
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

    // Clear error and navigate
    setShowError(false);
    setErrorMessage('');
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
          <Button title="Register" onPress={handleRegister} color="green" />
        </View>
      </View>

      {/* Sliding Error Message */}
      <SlidingMessage message={errorMessage} visible={showError} />
    </View>
  );
}