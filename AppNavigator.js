// AppNavigator.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false, // Hide the header if you don't want to display it
        }}
      >
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Register" component={RegisterForm} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
