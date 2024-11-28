import React, { useState, useEffect } from 'react';
import { View, Text, Alert, TouchableOpacity, StatusBar, Dimensions, TextInput } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Button } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import Feather from '@expo/vector-icons/Feather';
import { putAddressController } from '../../../controller/userController';

const Address = ( { route, navigation } ) =>
{
   const { jwtToken, isAdmin, userId } = useSelector( ( state ) => state.auth );
   const { latitudePinPoint, longitudePinPoint, addressPinPoint } = useSelector( state => state.user );

   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
   const [ isLoading, setIsLoading ] = useState( true );
   const [ detailAddress, setDetailAddress ] = useState( '' );
   const [ postalCode, setPostalCode ] = useState( '' );
   const [ latitude, setLatitude ] = useState( 0.0 );
   const [ longitude, setLongitude ] = useState( 0.0 );

   const { detailAddressCheckout, latitudeCheckout, longitudeCheckout, postalCodeCheckout } = route.params;

   const [ uploading, setUploading ] = useState( false );

   useEffect( () =>
   {
      setLongitude( longitudeCheckout );
      setLatitude( latitudeCheckout );
      setPostalCode( postalCodeCheckout );
      setDetailAddress( detailAddressCheckout );
   }, [] );

   useEffect( () =>
   {

      if ( latitudePinPoint && longitudePinPoint )
      {
         setLatitude( latitudePinPoint );
         setLongitude( longitudePinPoint );
      }

   }, [ latitudePinPoint, longitudePinPoint ] );


   const handleSave = async () =>
   {
      if ( !detailAddress || !postalCode || !latitude || !longitude )
      {
         Alert.alert( 'Alert', 'All fields must be filled out.' );
         return;
      }

      setUploading( true );

      try
      {
         const addressData = {
            latitude: parseFloat( latitude ),
            longitude: parseFloat( longitude ),
            postal_code: postalCode,
            address: detailAddress
         };

         const response = await putAddressController( jwtToken, addressData, userId );
         Alert.alert(
            'Success',
            'Address updated successfully!',
            [
               {
                  text: 'OK',
                  onPress: () =>
                  {
                     navigation.goBack();
                  },
               },
            ]
         );

      } catch ( error )
      {
         console.error( 'Error uploading files:', error );
         Alert.alert( 'Error', 'Something went wrong while saving the address.' );
      } finally
      {
         setUploading( false );
      }
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
                  Your Address
               </Text>
            </View>
         </View>

         <View className='justify-between flex-1'>
            <View>
               <View className='px-7 mb-6'>
                  <View className='flex-row items-center justify-between mb-4'>
                     <View className='flex-row items-center'>
                        <Feather name="map-pin" size={20} color="black" />
                        <Text className='ml-2 font-semibold text-lg'>
                           Pinpoint Address
                        </Text>
                     </View>
                     <TouchableOpacity
                        onPress={() => navigation.navigate( 'PinPoint' )}
                     >
                        <Text
                           className='text-blue'
                        >
                           Change PinPoint
                        </Text>
                     </TouchableOpacity>
                  </View>

                  <View className="border-b border-[#94acfc]  pb-1 flex-row items-center">
                     <Text className='flex-1 text-[#646468]'>
                        {addressPinPoint
                           ? addressPinPoint
                           : `${ latitude.toFixed( 6 ) }, ${ longitude.toFixed( 6 ) }`}
                     </Text>
                  </View>
               </View>

               <View className='px-7 mb-6'>
                  <Text className='mb-2 font-semibold text-lg'>
                     Detail Address
                  </Text>
                  <TextInput
                     value={detailAddress}
                     onChangeText={( text ) => setDetailAddress( text )}
                     className="border-b border-[#94acfc]"
                     placeholder={detailAddressCheckout || '(Ex. Jl. ABC Blok A No.5. Pagar Hijau)'}
                  />
               </View>

               {/* Postal Code */}
               <View className='px-7'>
                  <Text className='mb-2 font-semibold text-lg'>
                     Postal Code
                  </Text>
                  <TextInput
                     value={postalCode}
                     onChangeText={( text ) => setPostalCode( text )}
                     className="border-b border-[#94acfc]"
                     placeholder={postalCodeCheckout || 'Enter postal code'}
                     keyboardType="numeric"
                  />
               </View>
            </View>


            <View className='px-7'>
               <View className='flex-row items-center mb-6'>
                  <Feather name="info" size={24} color="black" />
                  <Text className='ml-5'>
                     By clicking the button below, you agree to the terms & conditions and privacy policy of address settings on Frantopia.
                  </Text>
               </View>
               <Button
                  style={{
                     marginBottom: 12,
                     borderColor: "#F3B02D"
                  }}
                  mode="contained"
                  textColor='#fff'
                  buttonColor='#F3B02D'
                  onPress={() =>
                  {
                     handleSave();
                  }}
                  loading={uploading}
               >
                  Save
               </Button>
            </View>
         </View>

      </View>
   );
};

export default Address;