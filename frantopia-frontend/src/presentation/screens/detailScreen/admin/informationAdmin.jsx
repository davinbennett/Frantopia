import React, { useState, useEffect } from 'react';
import { View, Text, StatusBar, Dimensions } from 'react-native';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { fetchInformationController } from '../../../../controller/orderController';

const InformationAdmin = ( { id, name } ) =>
{
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

   const [ orderDetails, setOrderDetails ] = useState( {
      status: null,
      date: null,
      priceTotal: null,
      shipmentPrice: null,
      insurancePrice: null,
      adminPrice: null,
   } );

   useEffect( () =>
   {
      const fetchOrderData = async () =>
      {
         try
         {
            const details = await fetchInformationController( jwtToken, id );
            setOrderDetails( details );
         } catch ( error )
         {
            console.error( "Failed to fetch order data:", error );
         }
      };

      fetchOrderData();
   }, [ id ] );

   const { status, date, priceTotal, shipmentPrice, insurancePrice, adminPrice } = orderDetails;

   return (
      <View className='bg-background flex-1 '>
         <View
            style={{
               shadowColor: 'black',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.1,
               elevation: 3,
               marginVertical: 18,
            }}
            className='mx-7 p-5 bg-white rounded-2xl gap-y-5 mb-5 flex-1'
         >
            <Text className='font-medium'>
               Status: {status || "Unknown"}
            </Text>

            {/* Header */}
            <Text className='font-extrabold text-2xl'>
               History Payment
            </Text>

            {/* Payment Date */}
            <View className='flex-row justify-end'>
               <Text className='font-semibold'>
                  Date:
               </Text>
               <Text className='ml-2'>
                  {date ? new Date( date ).toLocaleDateString( 'en-US', {
                     day: 'numeric',
                     month: 'long',
                     year: 'numeric',
                  } ) : "-"}
               </Text>
            </View>

            {/* Price Details Header */}
            <Text className='font-bold text-xl mt-4'>
               Price Details:
            </Text>

            {/* Price Details Breakdown */}
            <View className='flex-row justify-between mt-2'>
               <Text className='ml-5'>Price totals</Text>
               <Text>{priceTotal ? `Rp ${ priceTotal.toLocaleString( 'id-ID' ) }` : "Rp 0"}</Text>
            </View>

            <View className='flex-row justify-between mt-2'>
               <Text className='ml-5'>Shipment price totals</Text>
               <Text>{shipmentPrice ? `Rp ${ shipmentPrice.toLocaleString( 'id-ID' ) }` : "Rp 0"}</Text>
            </View>

            <View className='flex-row justify-between mt-2'>
               <Text className='ml-5'>Insurance price totals</Text>
               <Text>{insurancePrice ? `Rp ${ insurancePrice.toLocaleString( 'id-ID' ) }` : "Rp 0"}</Text>

            </View>

            <View className='flex-row justify-between mt-2'>
               <Text className='ml-5'>Admin payment price</Text>
               <Text>{adminPrice ? `Rp ${ adminPrice.toLocaleString( 'id-ID' ) }` : "Rp 0"}</Text>
            </View>
         </View>
      </View>
   );
};

export default InformationAdmin;