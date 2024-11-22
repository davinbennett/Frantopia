import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './AuthStackNavigation';
import BottomTabNavigation from './BottomTabNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken, setIsAdmin } from '../../infrastructure/redux/slice/authSlice';
import authImpl from '../../repositories/implementations/authImpl';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View, Alert } from 'react-native';
import { jwtDecode } from "jwt-decode";
import { logoutController } from '../../controller/authController';

const Stack = createNativeStackNavigator();

const AppNavigator = () =>
{
   const dispatch = useDispatch();
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );
   const isLoggedIn = !!jwtToken;
   const [ isLoading, setIsLoading ] = useState( true );

   const checkTokenExpiry = ( token ) =>
   {
      try
      {
         const decoded = jwtDecode( token );
         const currentTime = Date.now() / 1000;
         return decoded.exp > currentTime;
      } catch ( error )
      {
         return false;
      }
   };

   useEffect( () =>
   {
      const checkLoginStatus = async () =>
      {
         const { jwtToken, isAdmin } = await authImpl.checkToken();

         if ( jwtToken && checkTokenExpiry( jwtToken ) )
         {
            dispatch( setAuthToken( jwtToken ) );
            dispatch( setIsAdmin( isAdmin ) );
         } else
         {
            Alert.alert(
               'Session Expired',
               'Your session has expired. Please log in again.',
               [
                  {
                     text: 'OK',
                     onPress: () =>
                     {
                        logoutController( dispatch );
                     },
                  },
               ]
            );
         }
         setIsLoading( false );
      };
      checkLoginStatus();
   }, [ dispatch ] );

   if ( isLoading )
   {
      return (
         <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'black' }}>
         </View>
      );
   }

   return (
      <NavigationContainer>
         <Stack.Navigator screenOptions={{ headerShown: false, animation: 'none' }}>
            {isLoggedIn ? (
               <Stack.Screen
                  name="BottomTabNavigation"
                  component={BottomTabNavigation}
                  options={{ headerShown: false, navigationBarColor: '#2D70F3' }}
               />
            ) : (
               <Stack.Screen
                  name="AuthStackNavigator"
                  component={AuthStackNavigator} />
            )}
         </Stack.Navigator>
      </NavigationContainer>
   );
};

export default AppNavigator;