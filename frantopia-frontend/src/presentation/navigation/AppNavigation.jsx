import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { getToken } from '../../infrastructure/storage/authStorage';
import MainStackNavigator from './MainStackNavigation';
import AuthStackNavigator from './AuthStackNavigation';
import BottomTabNavigation from './BottomTabNavigation';

const AppNavigator = () =>
{
   const [ isLoggedIn, setIsLoggedIn ] = useState( false );
   const [ isAdmin, setIsAdmin ] = useState( null );

   useEffect( () =>
   {
      const checkLoginStatus = async () =>
      {
         const token = await getToken();
         setIsLoggedIn( !!token );
      };

      checkLoginStatus();
   }, [isLoggedIn] );

   return (
      <NavigationContainer>
         {isLoggedIn ? <BottomTabNavigation isAdmin={isAdmin} /> : <AuthStackNavigator />}
      </NavigationContainer>
   );
};

export default AppNavigator;