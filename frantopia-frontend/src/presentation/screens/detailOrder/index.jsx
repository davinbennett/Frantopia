import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, StatusBar, Dimensions, Keyboard, ActivityIndicator, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Portal, Button, RadioButton, Divider } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { v4 as uuidv4, v4 } from 'uuid';
import moment from 'moment';
import { getPackageByIdController, putProductStatusController } from '../../../controller/productController';
import { putOrderStatusController } from '../../../controller/orderController';

const DetailOrder = ( { navigation, route } ) =>
{
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );
   const screenHeight = Dimensions.get( 'screen' ).height;
   const screenWidth = Dimensions.get( 'screen' ).width;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   const {
      orderId,
      user_name,
      productId,
      packageId,
      franchiseName,
      category,
      status,
      orderDate,
      profile,
      totalAmount
   } = route.params;

   const categoryIcons = {
      "Barber & Salon": { library: MaterialIcons, name: "content-cut" },
      "Food & Beverage": { library: MaterialIcons, name: "local-dining" },
      "Expedition": { library: MaterialIcons, name: "airport-shuttle" },
      "Health & Beauty": { library: MaterialIcons, name: "spa" },
   };

   const [ grossProfit, setGrossProfit ] = useState( null );
   const [ income, setIncome ] = useState( null );
   const [ name, setName ] = useState( null );
   const [ price, setPrice ] = useState( null );
   const [ sizeConcept, setSizeConcept ] = useState( null );

   const fetchPackageById = async () =>
   {
      try
      {
         const { grossProfit,
            income,
            name,
            price,
            sizeConcept
         } = await getPackageByIdController( jwtToken, productId, packageId );

         setGrossProfit( grossProfit );
         setIncome( income );
         setName( name );
         setPrice( price );
         setSizeConcept( sizeConcept );

      } catch ( error )
      {
         console.error( "Error fetching packages:", error );
      }
   };

   useEffect( () =>
   {
      Promise.all( [
         fetchPackageById(),
      ] ).catch( error => console.error( 'Error fetching data:', error ) );
   }, [ orderId ] );

   const formatCurrency = ( value ) =>
   {
      return 'Rp ' + value.toString().replace( /\B(?=(\d{3})+(?!\d))/g, '.' );
   };
   const formatSizeConcept = ( size ) =>
   {
      return `${ size } x ${ size } m²`;
   };

   const handleDecline = async () =>
   {
      try
      {
         // Update product status to "decline"
         const productResponse = await putProductStatusController( jwtToken, 'decline', productId );

         // Update order status to "decline"
         const orderResponse = await putOrderStatusController( jwtToken, 'decline', orderId );
         

         if ( productResponse.code === 200 && orderResponse.code === 200 )
         {
            Alert.alert(
               'Success',
               'Product and Order status updated to Declined.',
               [ { text: 'OK', onPress: () => navigation.goBack() } ]
            );
         } else
         {
            Alert.alert(
               'Error',
               `Failed to update status:\n` +
               `Product: ${ productResponse.data?.error || 'No error message' }\n` +
               `Order: ${ orderResponse.data?.error || 'No error message' }`,
               [ { text: 'OK' } ]
            );
         }
      } catch ( error )
      {
         console.error( 'Error declining status:', error );
         Alert.alert(
            'Error',
            'An error occurred while declining the status.',
            [ { text: 'OK' } ]
         );
      }
   };

   const handleAccept = async () =>
   {
      try
      {
         // Update product status to "accept"
         const productResponse = await putProductStatusController( jwtToken, 'accept', productId );

         // Update order status to "accept"
         const orderResponse = await putOrderStatusController( jwtToken, 'accept', orderId );

         if ( productResponse.code === 200 && orderResponse.code === 200 )
         {
            Alert.alert(
               'Success',
               'Product and Order status updated to Accepted.',
               [ { text: 'OK', onPress: () => navigation.goBack() } ]
            );
         } else
         {
            Alert.alert(
               'Error',
               `Failed to update status:\n` +
               `Product: ${ productResponse.data?.error || 'No error message' }\n` +
               `Order: ${ orderResponse.data?.error || 'No error message' }`,
               [ { text: 'OK' } ]
            );
         }
      } catch ( error )
      {
         console.error( 'Error accepting status:', error );
         Alert.alert(
            'Error',
            'An error occurred while accepting the status.',
            [ { text: 'OK' } ]
         );
      }
   };


   return (

      <View className='flex-1'>
         {/* App Bar  */}
         <View
            className="bg-blue flex-row px-5 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
            style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8, marginBottom: 18 }}
         >
            <Image
               source={require( '../../../assets/icons/storeMiringKecil2.png' )}
               className='absolute -top-10 -right-10'
            />
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TouchableOpacity
                  onPress={() => navigation.goBack()}
               >
                  <MaterialIcons name="keyboard-arrow-left" size={32} color="white" />
               </TouchableOpacity>
               <Text className='text-3xl text-white font-semibold ml-2'>
                  Detail Order
               </Text>
            </View>
         </View>
         <ScrollView
            showsVerticalScrollIndicator={false}
            className='px-5'
         >
            <View
               style={{
                  height: screenHeight * 0.2
               }}
               className=''
            >
               <Image
                  source={{ uri: profile }}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                  className='rounded-xl'
               />
            </View>
            <View className='flex-row justify-between mt-5'>
               <View className='flex-1'>
                  <Text
                     className='font-bold text-3xl'
                     numberOfLines={2}
                     ellipsizeMode="tail"
                  >
                     {franchiseName}
                  </Text>
               </View>
               <View className='flex-row items-center ml-2'>
                  {
                     categoryIcons[ category ] ? (
                        React.createElement(
                           categoryIcons[ category ].library,
                           {
                              name: categoryIcons[ category ].name,
                              size: 16,
                              color: "#2d70f3",
                           }
                        )
                     ) : (
                        <Image source={{ uri: categoryIcons[ category ] }} className="w-4 h-4 mr-1" />
                     )
                  }
                  <Text className=" ml-1 text-[#515151]">{category}</Text>
               </View>
            </View>
            <Text className='font-semibold text-xl mt-2 mb-3'>
               Summary :
            </Text>
            <View className='bg-white rounded-xl p-5 gap-y-4'>
               <View className='flex-row justify-between w-full'>
                  <Text className='font-semibold text-lg'>
                     Ordered by:
                  </Text>
                  <Text className='text-lg'>{user_name}</Text>
               </View>
               <View className='flex-row justify-between w-full'>
                  <Text className='font-semibold text-lg'>
                     Status Order:
                  </Text>
                  <Text
                     className={`font-bold text-lg 
      ${ status === 'Failed' ? 'text-red-500' :
                           status === 'Pending' ? 'text-yellow' :
                              'text-green-500' }`}
                  >
                     {status}
                  </Text>
               </View>
               <View className='flex-row justify-between w-full'>
                  <Text className='font-semibold text-lg'>
                     Ordered Date :
                  </Text>
                  <Text className='text-lg'>{moment( orderDate ).format( 'DD MMMM YYYY' )}</Text>
               </View>
               <View>
                  <Text className='font-semibold text-lg mb-2'>
                     Package:
                  </Text>
                  <View className='ml-5 mt-1 gap-y-5'>
                     <View className='flex-row justify-between w-full'>
                        <Text className='font-semibold'>
                           Name:
                        </Text>
                        <Text className=''>{name}</Text>
                     </View><View className='flex-row justify-between w-full'>
                        <Text className='font-semibold '>
                           Size Concept:
                        </Text>
                        <Text className=''>{formatSizeConcept( sizeConcept || '-' )}</Text>
                     </View><View className='flex-row justify-between w-full'>
                        <Text className='font-semibold '>
                           Gross Profit:
                        </Text>
                        <Text className=''>{formatCurrency( grossProfit || '-' )}</Text>
                     </View><View className='flex-row justify-between w-full'>
                        <Text className='font-semibold '>
                           Income:
                        </Text>
                        <Text className=''>{formatCurrency( income || '-' )}</Text>
                     </View><View className='flex-row justify-between w-full'>
                        <Text className='font-semibold '>
                           Price:
                        </Text>
                        <Text className=''>{formatCurrency( price || '-' )}</Text>
                     </View>
                  </View>
               </View>
               <Divider bold />
               <View className='flex-row justify-between w-full'>
                  <Text className='font-semibold text-lg'>
                     Total Amount:
                  </Text>
                  <Text className='text-lg'>{formatCurrency( totalAmount || '' )}</Text>
               </View>
            </View>

         </ScrollView>
         {status === 'Pending' &&
            <View className='flex-row absolute bottom-3 px-5'>
               <TouchableOpacity
                  className='flex-1 rounded-full py-2 justify-center items-center'
                  style={{ borderWidth: 2, borderColor: '#F3b02d' }}
                  onPress={handleDecline}
               >
                  <Text style={{ color: '#F3b02d' }} className='font-semibold text-lg'>Decline</Text>
               </TouchableOpacity>
               <View className='w-5' />
               <TouchableOpacity
                  className='flex-1 bg-yellow rounded-full justify-center items-center'
                  onPress={handleAccept}
               >
                  <Text className='text-white font-semibold text-lg'>
                     Accept
                  </Text>
               </TouchableOpacity>
            </View>
         }
      </View>
   );
};

export default DetailOrder;