import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import CustomerHome from '../screens/homeScreen/customer';
import AdminHome from '../screens/homeScreen/admin';

const Stack = createNativeStackNavigator();

const MainStackNavigator = () =>
{
   return (
      <Stack.Navigator>
         <Stack.Screen name="AdminHome" component={AdminHome} />
         <Stack.Screen name="CustomerHome" component={CustomerHome} />
      </Stack.Navigator>
   );
};

export default MainStackNavigator; 