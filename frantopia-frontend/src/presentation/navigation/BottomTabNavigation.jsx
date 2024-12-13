import React, { useState, useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import Profile from '../screens/profileScreen';
import AdminHome from '../screens/homeScreen/admin';
import BusinessList from '../screens/businessListScreen';
import CustomerHome from '../screens/homeScreen/customer';
import YourBusiness from '../screens/yourBusiness';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Pressable } from 'react-native';
import { useSelector } from 'react-redux';
import InformationAdmin from '../screens/detailScreen/admin/informationAdmin';
import DetailsAdmin from '../screens/detailScreen/admin/details';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { View, Text, TouchableOpacity, Image, StatusBar, Dimensions } from 'react-native';
import AddBussiness from '../screens/addBusiness';
import EditBussiness from '../screens/editBusiness';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Pending from '../screens/orderListScreen/pending';
import Confirm from '../screens/orderListScreen/confirm';
import DetailOrder from '../screens/detailOrder';
import DetailsCustomer from '../screens/detailScreen/customer/details';
import Checkout from '../screens/checkout';
import Loading from '../screens/loading';
import Cart from '../screens/cart';
import Address from '../screens/address';
import PinPoint from '../screens/pinpoint';
import PendingYourOrder from '../screens/yourOrder/pending';
import ConfirmYourOrder from '../screens/yourOrder/confirm';
import InformationYourBusiness from '../screens/yourBusiness/information';
import DetailYourBusiness from '../screens/yourBusiness/detail';
import YourCart from '../screens/cart/yourCart';

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
               <Text className='text-3xl text-white font-semibold ml-2'>
                  Order List
               </Text>
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
            {( props ) => <Pending {...props} />}
         </TopTab.Screen>
         <TopTab.Screen name="Confirm">
            {( props ) => <Confirm {...props} />}
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
      <Stack.Screen
         name="DetailOrder"
         component={DetailOrder}
         options={{
            headerShown: false,
            navigationBarColor: '#F3F4FE',
         }}
      />
   </Stack.Navigator>
);

const YourOrderTopTabs = ( { route, navigation } ) =>
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
               <Text className='text-3xl text-white font-semibold ml-2'>
                  Your Order
               </Text>
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
            {( props ) => <PendingYourOrder {...props} />}
         </TopTab.Screen>
         <TopTab.Screen name="Confirm">
            {( props ) => <ConfirmYourOrder {...props} />}
         </TopTab.Screen>
      </TopTab.Navigator>
   );
};

const YourOrderCustomerStack = () => (
   <Stack.Navigator
      screenOptions={{ animation: 'none' }}
   >
      <Stack.Screen
         name="YourOrder"
         component={YourOrderTopTabs}
         options={{
            headerShown: false,
         }}
      />
   </Stack.Navigator>
);

const HomeCustomerStack = () => (
   <Stack.Navigator
      screenOptions={{ animation: 'none' }}
   >
      <Stack.Screen
         name="HomeCustomer"
         component={CustomerHome}
         options={{
            headerShown: false,
         }}
      />
      <Stack.Screen
         name="ProductDetailCustomer"
         component={DetailsCustomer}
         options={{
            headerShown: false,
         }}
      />
      <Stack.Screen
         name="Checkout"
         component={Checkout}
         options={{
            headerShown: false,
         }}
      />
      <Stack.Screen
         name="Loading"
         component={Loading}
         options={{
            headerShown: false,
         }}
      />
      <Stack.Screen
         name="YourCart"
         component={YourCart}
         options={{
            headerShown: false,
         }}
      />
      <Stack.Screen
         name="Address"
         component={Address}
         options={{
            headerShown: false,
            navigationBarColor: '#F3F4FE',
         }}
      />
      <Stack.Screen
         name="PinPoint"
         component={PinPoint}
         options={{
            headerShown: false,
         }}
      />
   </Stack.Navigator>
);

const YourBusinessDetailTopTabs = ( { route, navigation } ) =>
{
   const { orderId, productId, packageId, productName } = route.params;
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
                     {productName}
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
            {( props ) => <InformationYourBusiness {...props} orderId={orderId} productId={productId} packageId={packageId} productName={productName} />}
         </TopTab.Screen>
         <TopTab.Screen name="Details">
            {( props ) => <DetailYourBusiness {...props} orderId={orderId} productId={productId} packageId={packageId} productName={productName} />}
         </TopTab.Screen>
      </TopTab.Navigator>
   );
};


const YourBusinessStack = () => (
   <Stack.Navigator
      screenOptions={{ animation: 'none' }}
   >
      <Stack.Screen
         name="YourBusiness"
         component={YourBusiness}
         options={{
            headerShown: false,
         }}
      />
      <Stack.Screen
         name="YourBusinessDetailTopTabs"
         component={YourBusinessDetailTopTabs}
         options={{
            headerShown: false,
            navigationBarColor: '#F3F4FE',
         }}
      />
   </Stack.Navigator>
);

const BottomTabNavigation = () =>
{
   const { isAdmin } = useSelector( ( state ) => state.auth );

   const [ admin, setAdmin ] = useState( true );

   useEffect( () =>
   {
      const timer = setTimeout( () =>
      {
         if ( isAdmin === false )
         {
            console.log( 'isAdmin is false: ', isAdmin );
         }
         if ( isAdmin === true )
         {
            console.log( 'isAdmin is true: ', isAdmin );
         }

         setAdmin( isAdmin );
      }, 0 );
      return () => clearTimeout( timer );
   }, [ isAdmin ] );


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
         {admin ? (
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
                        if ( routeName === 'DetailOrder' )
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
                  options={( { route } ) => ( {
                     headerShown: false,
                     tabBarStyle: ( ( route ) =>
                     {
                        const routeName = getFocusedRouteNameFromRoute( route ) ?? "";
                        if ( routeName === 'ProductDetailCustomer' || routeName === 'Checkout' || routeName === 'Loading' || routeName === 'YourCart' || routeName === 'Address' ||
                           routeName === 'PinPoint' )
                        {
                           return { display: "none" };
                        }
                        return { backgroundColor: '#2D70F3' };
                     } )( route ),
                  } )}
                  component={HomeCustomerStack}
               />
               <Tab.Screen
                  name="Your Business"
                  options={( { route } ) => ( {
                     headerShown: false,
                     tabBarStyle: ( ( route ) =>
                     {
                        const routeName = getFocusedRouteNameFromRoute( route ) ?? "";
                        if ( routeName === 'YourBusinessDetailTopTabs' )
                        {
                           return { display: "none" };
                        }
                        return { backgroundColor: '#2D70F3' };
                     } )( route ),
                  } )}
                  component={YourBusinessStack}
               />
               <Tab.Screen
                  name="Your Order"
                  options={( { route } ) => ( {
                     headerShown: false,
                     tabBarStyle: ( ( route ) =>
                     {
                        const routeName = getFocusedRouteNameFromRoute( route ) ?? "";
                        if ( routeName === 'DetailFranchiseCustomer' )
                        {
                           return { display: "none" };
                        }
                        return { backgroundColor: '#2D70F3' };
                     } )( route ),
                  } )}
                  component={YourOrderCustomerStack}
               />
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
