import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen';


const Stack = createNativeStackNavigator();;

const AuthStackNavigator = () => (
   <Stack.Navigator>
      <Stack.Screen
         name="Login"
         component={LoginScreen}
         options={{ headerShown: false }}
      />
   </Stack.Navigator>
);

export default AuthStackNavigator;