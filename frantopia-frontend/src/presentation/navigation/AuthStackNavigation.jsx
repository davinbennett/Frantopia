import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/loginScreen';
import BottomTabNavigation from './BottomTabNavigation';


const Stack = createNativeStackNavigator();;

const AuthStackNavigator = () => (
   <Stack.Navigator
      initialRouteName='Login'
      screenOptions={{ animation: 'none' }}
   >
      <Stack.Screen
         name="Login"
         component={LoginScreen}
         options={{ headerShown: false, navigationBarColor: '#2D70F3' }}
      />
      <Stack.Screen
         name="BottomTabNavigation"
         component={BottomTabNavigation}
         initialParams={{ isAdmin: false }}
         options={{ headerShown: false, navigationBarColor: '#2D70F3' }}
      />
   </Stack.Navigator>
);

export default AuthStackNavigator;