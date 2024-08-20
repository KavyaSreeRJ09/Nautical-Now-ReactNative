import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import LoginForm from './LoginForm';
import Maps from './Maps';
import RegisterForm from './RegisterForm';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginForm} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterForm} options={{ headerShown: false }} />
        <Stack.Screen name="Maps" component={Maps} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
