import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AuthStackNavigator from './AuthStackNavigation';
import BottomTabNavigation from './BottomTabNavigation';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthToken, setIsAdmin } from '../../infrastructure/redux/slice/authSlice';
import authImpl from '../../repositories/implementations/authImpl';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text, View } from 'react-native';

const Stack = createNativeStackNavigator();

const AppNavigator = () =>
{
   const dispatch = useDispatch();
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );
   const isLoggedIn = !!jwtToken;
   const [ isLoading, setIsLoading ] = useState( true );

   useEffect( () =>
   {
      const checkLoginStatus = async () =>
      {
         const { jwtToken, isAdmin } = await authImpl.checkToken();

         if ( jwtToken )
         {
            dispatch( setAuthToken( jwtToken ) );
            dispatch( setIsAdmin( isAdmin ) );
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