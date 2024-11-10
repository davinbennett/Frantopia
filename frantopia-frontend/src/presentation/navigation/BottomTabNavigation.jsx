import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { FontAwesome } from '@expo/vector-icons';
import Profile from '../screens/profileScreen';
import AdminHome from '../screens/homeScreen/admin';
import BusinessList from '../screens/businessListScreen';
import OrderList from '../screens/orderListScreen';
import CustomerHome from '../screens/homeScreen/customer';
import YourBusiness from '../screens/yourBusiness';
import YourOrder from '../screens/yourOrder';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// nested
const ProfileStackNavigator = () => (
   <Stack.Navigator>
      <Stack.Screen name="Profile" component={Profile} />
      {/* <Stack.Screen name="Settings" component={Settings} /> */}
   </Stack.Navigator>
);

// main
const BottomTabNavigation = ( { jwtToken, isAdmin } ) =>
{
   return (
      <Tab.Navigator
         screenOptions={( { route } ) => ( {
            tabBarIcon: ( { color, size } ) =>
            {
               let iconName;

               if ( route.name === 'Home' )
               {
                  iconName = 'home';
               } else if ( route.name === 'BusinessList' || route.name === 'YourBusiness' )
               {
                  iconName = 'store';
               } else if ( route.name === 'OrderList' || route.name === 'YourOrder' )
               {
                  iconName = 'file-text';
               } else if ( route.name === 'Profile' )
               {
                  iconName = 'user';
               }

               return <FontAwesome name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: 'tomato',
            tabBarInactiveTintColor: 'gray',
         } )}
      >
         {isAdmin ? (
            <>
               <Tab.Screen name="Home" component={AdminHome
               } />
               <Tab.Screen name="BusinessList" component={BusinessList} />
               <Tab.Screen name="OrderList" component={OrderList} />
               <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
            </>
         ) : (
            <>
               <Tab.Screen name="Home" component={CustomerHome} />
               <Tab.Screen name="YourBusiness" component={YourBusiness} />
               <Tab.Screen name="YourOrder" component={YourOrder} />
               <Tab.Screen name="Profile" component={ProfileStackNavigator} options={{ headerShown: false }} />
            </>
         )}
      </Tab.Navigator>
   );
};

export default BottomTabNavigation;