import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { FontAwesome } from '@expo/vector-icons';
import Profile from '../screens/profileScreen';
import AdminHome from '../screens/homeScreen/admin';
import BusinessList from '../screens/businessListScreen';
import OrderList from '../screens/orderListScreen/pending';
import CustomerHome from '../screens/homeScreen/customer';
import YourBusiness from '../screens/yourBusiness';
import YourOrder from '../screens/yourOrder';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import InformationAdmin from '../screens/detailScreen/admin/informationAdmin';
import DetailsAdmin from '../screens/detailScreen/admin/details';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, StatusBar, Dimensions, Keyboard, ActivityIndicator } from 'react-native';
import AddBussiness from '../screens/addBusiness';
import EditBussiness from '../screens/editBusiness';
import { getFocusedRouteNameFromRoute, NavigationContainer } from '@react-navigation/native';
import Pending from '../screens/orderListScreen/pending';
import Confirm from '../screens/orderListScreen/confirm';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const TopTab = createMaterialTopTabNavigator();

const ProductTopTabs = ( { route, navigation } ) =>
{
   const { id, name } = route.params;
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   React.useEffect( () =>
   {
      navigation.setOptions( {
         contentStyle: {
            backgroundColor: '#f3f4fe',
         },
         headerShown: true,
         header: () => (
            <View
               className="bg-blue flex-row px-5 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
               style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8, marginBottom: 18 }}
            >
               <Image
                  source={require( '../../assets/icons/storeMiringKecil2.png' )}
                  className='absolute -top-10 -right-10'
               />
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                     onPress={() => navigation.goBack()}
                  >
                     <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
                  </TouchableOpacity>
                  <Text className='text-3xl text-white font-semibold ml-2'>
                     {name}
                  </Text>
               </View>
            </View>
         ),
      } );
   }, [ navigation ] );

   return (
      <TopTab.Navigator
         screenOptions={{
            tabBarStyle: {
               backgroundColor: 'white',
               marginHorizontal: 25,
               borderRadius: 12,
               marginBottom: 0
            },
            tabBarLabelStyle: {
               fontWeight: 'bold',
            },
            tabBarIndicatorStyle: {
               backgroundColor: '#2d70f3',
               height: 3,
               width: '45%',
               left: '3%',
               borderRadius: 50
            },
         }}
      >
         <TopTab.Screen name="Informations">
            {( props ) => <InformationAdmin {...props} id={id} name={name} />}
         </TopTab.Screen>
         <TopTab.Screen name="Details">
            {( props ) => <DetailsAdmin {...props} id={id} name={name} />}
         </TopTab.Screen>
      </TopTab.Navigator>
   );
};

const BusinessStack = () => (
   <Stack.Navigator
      screenOptions={{ animation: 'none' }}
   >
      <Stack.Screen
         name="BusinessList"
         component={BusinessList}
         options={{
            headerShown: false,
            navigationBarColor: '#2D70F3',
         }}
      />
      <Stack.Screen
         name="ProductDetail"
         component={ProductTopTabs}
         options={{
            headerShown: false,
            navigationBarColor: '#F3F4FE',
         }}

      />
      <Stack.Screen
         name="AddBusiness"
         component={AddBussiness}
         options={{
            headerShown: false,
            navigationBarColor: '#F3F4FE',
         }}
      />
      <Stack.Screen
         name="EditBusiness"
         component={EditBussiness}
         options={{
            headerShown: false,
            navigationBarColor: '#F3F4FE',
         }}
      />
   </Stack.Navigator>
);

const OrderAdminTopTabs = ( { route, navigation } ) =>
{
   // const { } = route.params;
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   React.useEffect( () =>
   {
      navigation.setOptions( {
         contentStyle: {
            backgroundColor: '#f3f4fe',
         },
         headerShown: true,
         header: () => (
            <View
               className="bg-blue flex-row px-5 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
               style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8, marginBottom: 18 }}
            >
               <Image
                  source={require( '../../assets/icons/storeMiringKecil2.png' )}
                  className='absolute -top-10 -right-10'
               />
               <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity
                     onPress={() => navigation.goBack()}
                  >
                     <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
                  </TouchableOpacity>
                  <Text className='text-3xl text-white font-semibold ml-2'>
                     Order List
                  </Text>
               </View>
            </View>
         ),
      } );
   }, [ navigation ] );

   return (
      <TopTab.Navigator
         screenOptions={{
            tabBarStyle: {
               backgroundColor: 'white',
               marginHorizontal: 25,
               borderRadius: 12,
               marginBottom: 0
            },
            tabBarLabelStyle: {
               fontWeight: 'bold',
            },
            tabBarIndicatorStyle: {
               backgroundColor: '#2d70f3',
               height: 3,
               width: '45%',
               left: '3%',
               borderRadius: 50
            },
         }}
      >
         <TopTab.Screen name="Pending">
            {( props ) => <Pending {...props}/>}
         </TopTab.Screen>
         <TopTab.Screen name="Confirm">
            {( props ) => <Confirm {...props}/>}
         </TopTab.Screen>
      </TopTab.Navigator>
   );
};

const OrderAdminStack = () => (
   <Stack.Navigator
      screenOptions={{ animation: 'none' }}
   >
      <Stack.Screen
         name="OrderList"
         component={OrderAdminTopTabs}
         options={{
            headerShown: false,
         }}
      />
   </Stack.Navigator>
);

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
            tabBarLabelStyle: {
               fontSize: 12,
            },
            display: route.name === 'BusinessList' ? 'none' : 'flex',
            tabBarButton: ( props ) => <Pressable {...props}
            />

         } )}
      >
         {isAdmin ? (
            <>
               <Tab.Screen
                  name="Home"
                  options={{ headerShown: false, }}
                  component={AdminHome} />
               <Tab.Screen
                  name="Business List"
                  options={( { route } ) => ( {
                     headerShown: false,
                     tabBarStyle: ( ( route ) =>
                     {
                        const routeName = getFocusedRouteNameFromRoute( route ) ?? "";
                        if ( routeName === 'AddBusiness' || routeName === 'EditBusiness' || routeName === 'ProductDetail' )
                        {
                           return { display: "none" };
                        }
                        return { backgroundColor: '#2D70F3' };
                     } )( route ),
                  } )}
                  component={BusinessStack}
               />
               <Tab.Screen
                  name="Order List"
                  options={( { route } ) => ( {
                     headerShown: false,
                     tabBarStyle: ( ( route ) =>
                     {
                        const routeName = getFocusedRouteNameFromRoute( route ) ?? "";
                        if ( routeName === '' )
                        {
                           return { display: "none" };
                        }
                        return { backgroundColor: '#2D70F3' };
                     } )( route ),
                  } )}
                  component={OrderAdminStack}

               />
               <Tab.Screen
                  name="Profile"
                  options={{ headerShown: false }}
                  component={Profile} />
            </>
         ) : (
            <>
               <Tab.Screen
                  name="Home"
                  options={{ headerShown: false }}
                  component={CustomerHome} />
               <Tab.Screen
                  name="Your Business"
                  options={{ headerShown: false }}
                  component={YourBusiness} />
               <Tab.Screen
                  name="Your Order"
                  options={{ headerShown: false }}
                  component={YourOrder} />
               <Tab.Screen
                  name="Profile"
                  options={{ headerShown: false }}
                  component={Profile} />
            </>
         )}
      </Tab.Navigator>
   );
};

export default BottomTabNavigation;
