import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, StatusBar, Dimensions, Keyboard, ActivityIndicator, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Portal, Button, RadioButton, Divider } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';


const Checkout = ( { route, navigation } ) =>
{
   const { item, productId, productName } = route.params;
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );
   const screenHeight = Dimensions.get( 'screen' ).height;
   const screenWidth = Dimensions.get( 'screen' ).width;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
   const [ isLoading, setIsLoading ] = useState( true );
   const bottomHeight = useSafeAreaInsets().bottom;

   const formatCurrency = ( value ) =>
   {
      return 'Rp ' + value.toString().replace( /\B(?=(\d{3})+(?!\d))/g, '.' );
   };

   

   return (
      <View className='flex-1 bg-background '>
         <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

         {/* App Bar */}
         <View
            className=" flex-row px-5 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
            style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8, marginBottom: 0 }}
         >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TouchableOpacity
                  onPress={() => navigation.goBack()}
               >
                  <MaterialIcons name="keyboard-arrow-left" size={32} color="black" />
               </TouchableOpacity>
               <Text className='text-3xl font-semibold ml-2'>
                  Checkout
               </Text>
            </View>
         </View>

         <ScrollView
            className="mx-7"
            showsVerticalScrollIndicator={false}
         >
            <TouchableOpacity
               className='flex-row items-center'
               onPress={()=> navigation.navigate('Address')}
            >
               <View className='flex-1'>
                  <Text className='text-lg'>
                     Shipping Address
                  </Text>
                  <View className=''>
                     <View className='flex-row items-center'>
                        <MaterialIcons name="location-pin" size={18} color="orange" />
                        <Text className='ml-1 font-semibold text-lg'>{'location' || "N/A"}</Text>
                     </View>
                  </View>
               </View>
               <View>
                  <MaterialIcons name="keyboard-arrow-right" size={28} color="#2d70f3" />
               </View>
            </TouchableOpacity>

            <View>

            </View>
            <View>

            </View>

         </ScrollView>

         {/* Bottom Bar */}
         <View className="bg-blue flex-row justify-between items-center px-6 pt-5 pb-2">

            <View className='flex-1'>
               <Text className="text-white">
                  Total Order
               </Text>
               <Text
                  className="text-white text-2xl font-bold"
                  numberOfLines={1}
                  adjustsFontSizeToFit
               >
                  {formatCurrency( '9' || 0 )}
               </Text>
            </View>

            <View className='w-5' />

            {/* Checkout Button */}
            <TouchableOpacity
               className="bg-yellow rounded-xl px-5 py-3 flex-1 items-center"
            // onPress={() => navigation.navigate( 'Checkout', {
            //    item: selectedItem,
            //    productId: id,
            //    ProductName: name
            // } )}
            >
               <Text className="text-white text-lg font-bold">Pay Now</Text>
            </TouchableOpacity>
         </View>
      </View>
   );
};

export default Checkout;