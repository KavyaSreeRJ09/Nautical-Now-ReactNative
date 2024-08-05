import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';
import Maps from './Maps';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} />
        <Stack.Screen name="Register" component={RegisterForm} />
        <Stack.Screen name="Maps" component={Maps} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}