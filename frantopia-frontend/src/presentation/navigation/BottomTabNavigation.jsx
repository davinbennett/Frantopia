import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Profile from '../screens/profileScreen';
import AdminHome from '../screens/homeScreen/admin';
import BusinessList from '../screens/businessListScreen';
import OrderList from '../screens/orderListScreen';
import CustomerHome from '../screens/homeScreen/customer';
import YourBusiness from '../screens/yourBusiness';
import YourOrder from '../screens/yourOrder';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';

const Tab = createBottomTabNavigator();

const BottomTabNavigation = () =>
{
   const { isAdmin } = useSelector( ( state ) => state.auth );

   return (
      <Tab.Navigator
         initialRouteName="Home"
         screenOptions={( { route } ) => ( {
            tabBarIcon: ( { color, size } ) =>
            {
               let iconName;
               if ( route.name === 'Home' )
               {
                  iconName = 'house';
               } else if ( route.name === 'Business List' || route.name === 'Your Business' )
               {
                  iconName = 'shop';
               } else if ( route.name === 'Order List' || route.name === 'Your Order' )
               {
                  iconName = 'file-text';
               } else if ( route.name === 'Profile' )
               {
                  iconName = 'user';
               }
               return <FontAwesome6 name={iconName} size={18} color={color} />;
            },
            tabBarActiveTintColor: '#F3B02D',
            tabBarInactiveTintColor: 'white',
            tabBarStyle: {
               backgroundColor: '#2D70F3',
            },
            tabBarButton: ( props ) => <Pressable {...props} />

         } )}
      >
         {isAdmin ? (
            <>
               <Tab.Screen
                  name="Home"
                  options={{headerShown: false}}
                  component={AdminHome} />
               <Tab.Screen
                  name="Business List"
                  options={{headerShown: false}}
                  component={BusinessList} />
               <Tab.Screen
                  name="Order List"
                  options={{headerShown: false}}
                  component={OrderList} />
               <Tab.Screen
                  name="Profile"
                  options={{headerShown: false}}
                  component={Profile} />
            </>
         ) : (
            <>
               <Tab.Screen
                  name="Home"
                  options={{headerShown: false}}
                  component={CustomerHome} />
               <Tab.Screen
                  name="Your Business"
                  options={{headerShown: false}}
                  component={YourBusiness} />
               <Tab.Screen
                  name="Your Order"
                  options={{headerShown: false}}
                  component={YourOrder} />
               <Tab.Screen
                  name="Profile"
                  options={{headerShown: false}}
                  component={Profile} />
            </>
         )}
      </Tab.Navigator>
   );
};

export default BottomTabNavigation;
