import React, { useState, useEffect } from 'react';
import { View, Alert, Text, FlatList, TouchableOpacity, StatusBar, Dimensions, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Portal, Divider } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import { deleteCartController, getAddressByIdController, putStatusCartController } from '../../../controller/userController';
import { fetchShippingController } from '../../../controller/shippingController';
import { v4 as uuidv4 } from 'uuid';
import { postOrderController } from '../../../controller/orderController';
import Ionicons from '@expo/vector-icons/Ionicons';

const Checkout = ( { route, navigation } ) =>
{
   const { packages, productId, productName, licensed, fromCart, cartId } = route.params;
   const { jwtToken, isAdmin, userId } = useSelector( ( state ) => state.auth );
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
   const [ isLoading, setIsLoading ] = useState( true );

   const formatCurrency = ( value ) =>
   {
      return 'Rp ' + value.toString().replace( /\B(?=(\d{3})+(?!\d))/g, '.' );
   };

   const [ detailAddress, setDetailAddress ] = useState( null );
   const [ postalCode, setPostalCode ] = useState( null );
   const [ latitude, setLatitude ] = useState( 0 );
   const [ longitude, setLongitude ] = useState( 0 );

   const getAddress = async () =>
   {
      try
      {
         const { latitude, longitude, postalCode, address } = await getAddressByIdController( jwtToken, userId );

         setLatitude( latitude );
         setLongitude( longitude );
         setPostalCode( postalCode );
         setDetailAddress( address );


      } catch ( error )
      {
         console.error( "Error fetching address:", error );
      }
   };

   const [ shippings, setShippings ] = useState( [] );
   const [ visibleShipping, setVisibleShipping ] = useState( false );
   const [ selectedShipping, setSelectedShipping ] = useState( null );
   const showModalShipping = () => setVisibleShipping( true );
   const hideModalShipping = () => setVisibleShipping( false );

   const selectShipping = ( item ) =>
   {
      setSelectedShipping( item );
      hideModalShipping();
   };

   const fetchShipping = async () =>
   {
      try
      {
         const { shippings: fetchShippings } = await fetchShippingController( jwtToken );

         const formatShipping = fetchShippings.map( ( item ) =>
         ( {
            shippingId: item.shippingId,
            shippingMethod: item.shippingMethod,
            shippingCost: item.shippingCost,
         } ) );

         setShippings( formatShipping || [] );
      } catch ( error )
      {
         console.error( "Error fetching shipping - checkout:", error );
      }
   };

   useEffect( () =>
   {
      const unsubscribe = navigation.addListener( 'focus', () =>
      {
         setIsLoading( true );

         Promise.all( [
            getAddress(),
            fetchShipping()
         ] )
            .catch( error => console.error( 'Error fetching data:', error ) )
            .finally( () => setIsLoading( false ) );
      } );

      return unsubscribe;
   }, [ navigation ] );


   const adminFee = 1000;
   const insuranceCosts = 1000;

   const calculateEstimate = ( id ) =>
   {
      const today = new Date();
      let startOffset = 0;
      let range = 0;

      if ( id === 1 )
      {
         startOffset = 3;
         range = 1;
      } else if ( id === 2 )
      {
         startOffset = 4;
         range = 2;
      } else if ( id === 3 )
      {
         startOffset = 5;
         range = 2;
      }

      const startDate = new Date( today );
      startDate.setDate( today.getDate() + startOffset );
      startDate.setHours( startDate.getHours() + 7 );

      const endDate = new Date( startDate );
      endDate.setDate( startDate.getDate() + range );
      endDate.setHours( endDate.getHours() + 7 );

      const options = { day: 'numeric', month: 'short' };
      const startString = startDate.toLocaleDateString( 'en-US', options );
      const endString = endDate.toLocaleDateString( 'en-US', options );

      return `${ startString } - ${ endString }`;
   };

   const formatEstimate = ( id ) =>
   {
      const today = new Date();
      let startOffset = 0;
      let range = 0;

      if ( id === 1 )
      {
         startOffset = 3;
         range = 1;
      } else if ( id === 2 )
      {
         startOffset = 4;
         range = 2;
      } else if ( id === 3 )
      {
         startOffset = 5;
         range = 2;
      }

      const startDate = new Date( today );
      startDate.setDate( today.getDate() + startOffset );
      startDate.setHours( startDate.getHours() + 7 );

      const endDate = new Date( startDate );
      endDate.setDate( startDate.getDate() + range );
      endDate.setHours( endDate.getHours() + 7 );

      return endDate.toISOString();
   };



   const handlePayment = async () =>
   {
      if ( !detailAddress || !postalCode || !latitude || !longitude || !selectedShipping || !selectedPayment )
      {
         Alert.alert( 'Alert', 'All fields must be filled out.' );
         return;
      }
      Alert.alert(
         'Pay Now',
         'Complete your payment!',
         [
            {
               text: 'Cancel',
               style: 'cancel',
            },
            {
               text: 'Pay Now',
               onPress: async () =>
               {
                  try
                  {
                     const currentDate = new Date();
                     currentDate.setHours( currentDate.getHours() + 7 );

                     const orderDate = currentDate.toISOString();

                     const data = {
                        user_id: userId,
                        bank_id: 1,
                        franchise_id: productId,
                        package_franchise_id: packages.id,
                        status: 'Pending',
                        payment_type: "Bank Transfer",
                        total_amount: parseFloat( packages.price || 0 ) + parseFloat( selectedShipping?.shippingCost || 0 ) + insuranceCosts + adminFee,
                        shipping_id: selectedShipping?.shippingId || 1,
                        order_date: orderDate,
                        shipment_price_total: selectedShipping?.shippingCost || 0,
                        insurance_price_total: insuranceCosts,
                        admin_payment_price: adminFee,
                        failure_reason: "",
                        shipping_status: "Processing",
                        tracking_number: uuidv4().toString(),
                        estimated_delivery_date: formatEstimate( selectedShipping?.shippingId || 1 ),
                     };

                     if ( fromCart === true )
                     {
                        try
                        {
                           // Hapus dari cart
                           const result = await deleteCartController( jwtToken, userId, cartId );
                           console.log( 'Delete cart result:', result );
                        } catch ( error )
                        {
                           console.error( 'Failed to delete cart:', error );
                        }
                     }

                     
                     // try {
                     //    await putStatusCartController( jwtToken, userId, cartId, 'sold' );
                     // } catch (error) {
                     //    console.error( 'Failed to update status cart:', error );
                     // }

                     const response = await postOrderController( jwtToken, data );
                     Alert.alert(
                        'Success',
                        'Payment successfully!',
                        [
                           {
                              text: 'OK',
                              onPress: () =>
                              {
                                 navigation.replace( 'HomeCustomer' );
                              },
                           },
                        ]
                     );

                     console.log( 'response add business', response );
                  } catch ( error )
                  {
                     console.error( 'Error payment:', error );
                     Alert.alert( 'Error', 'Something went wrong while payment.' );
                  }
               },
            },
         ],
         { cancelable: true }
      );
   };

   const [ payments, setPayments ] = useState(
      [
         {
            paymentMethod: [ 'COD (Cash on Delivery)' ]
         }
      ]
   );
   const [ visiblePayment, setVisiblePayment ] = useState( false );
   const [ selectedPayment, setSelectedPayment ] = useState( null );
   const showModalPayment = () => setVisiblePayment( true );
   const hideModalPayment = () => setVisiblePayment( false );

   const selectPayment = ( item ) =>
   {
      setSelectedPayment( item );
      hideModalPayment();
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
               className='flex-row items-center mb-4'
               onPress={() => navigation.navigate( 'Address', {
                  detailAddressCheckout: detailAddress,
                  latitudeCheckout: latitude,
                  longitudeCheckout: longitude,
                  postalCodeCheckout: postalCode
               } )}
            >
               <View className='flex-1'>
                  <Text className=' '>
                     Shipping Address
                  </Text>
                  <View className='mt-2'>
                     <View className='flex-row items-center'>
                        <MaterialIcons name="location-pin" size={18} color="orange" />
                        <Text
                           className='ml-1 font-medium flex-1'
                           numberOfLines={1}
                           ellipsizeMode="tail"
                        >
                           {detailAddress || '-'}
                        </Text>
                     </View>
                  </View>
               </View>
               <View>
                  <MaterialIcons name="keyboard-arrow-right" size={28} color="#2d70f3" />
               </View>
            </TouchableOpacity>

            <Divider bold />

            <View className='mt-4 mb-6'>
               <Text className="font-medium text-lg mb-3">
                  {licensed || '-'}
               </Text>
               <Text
                  className="font-bold mb-3 text-2xl ml-6"
               >
                  {productName || '-'}
               </Text>
               <Text className="font-bold ml-6 mb-3 text-xl" >
                  {packages.title || '-'}
               </Text>
               <Text className=" ml-6 mb-1">
                  Size Concept
               </Text>
               <Text className="ml-12 mb-1 font-medium">
                  {packages.sizeConcept || '-'} x {packages.sizeConcept || '-'} m²
               </Text>
               <Text className=" ml-6 mb-1">
                  Gross Profit
               </Text>
               <Text className="ml-12 font-medium mb-1">
                  {formatCurrency( packages.grossProfit || '' )}
               </Text>
               <Text className=" ml-6 mb-1">
                  Income
               </Text>
               <Text className="ml-12 font-medium mb-1">
                  {formatCurrency( packages.income || '' )}
               </Text>
               <Text className=" ml-6 mb-1">
                  Price
               </Text>
               <Text className="ml-12 font-medium">
                  {formatCurrency( packages.price || '' )}
               </Text>

               {/* shipping */}
               <TouchableOpacity
                  className='py-3 px-6 border-2 rounded-xl border-yellow flex-row mt-3'
                  onPress={showModalShipping}
               >
                  <View className='flex-1'>
                     <Text className='font-medium mb-1'>
                        {selectedShipping
                           ? `${ selectedShipping.shippingMethod || '' } (${ formatCurrency( selectedShipping?.shippingCost || '' ) })`
                           : `Select Shipping`}
                     </Text>
                     <Text>
                        {selectedShipping
                           ? `Estimate arrive ${ calculateEstimate( selectedShipping.shippingId ) }`
                           : `-`}
                     </Text>
                  </View>
                  <View className='justify-center items-end'>
                     <MaterialIcons name="keyboard-arrow-right" size={32} color="#f3b02d" />
                  </View>
               </TouchableOpacity>

               {/* payment */}
               <TouchableOpacity
                  className='py-3 px-6 border-2 rounded-xl border-yellow flex-row mt-3'
                  onPress={showModalPayment}
               >
                  <View className='flex-1 justify-center'>
                     <Text className='font-medium '>
                        {selectedPayment
                           ? `${ selectedPayment.paymentMethod || '' }`
                           : `Select Payment`}
                     </Text>
                     {
                        !selectedPayment ? (
                           <Text>
                              -
                           </Text>
                        ) : null
                     }
                  </View>
                  <View className='justify-center items-end'>
                     <MaterialIcons name="keyboard-arrow-right" size={32} color="#f3b02d" />
                  </View>
               </TouchableOpacity>
            </View>

            {/* shipping */}
            <Portal>
               <Modal
                  visible={visibleShipping}
                  onDismiss={hideModalShipping}
                  contentContainerStyle={{
                     backgroundColor: '#F3F4FE',
                     padding: 20,
                     marginHorizontal: 20,
                     borderRadius: 10,
                  }}
               >
                  <Text className="text-2xl font-bold mb-3">Select Shipping</Text>

                  {/* List Shipping */}
                  <FlatList
                     data={shippings}
                     keyExtractor={( item ) => item.shippingId.toString()}
                     renderItem={( { item } ) => (
                        <TouchableOpacity
                           className="py-4 px-3 border-b border-gray"
                           onPress={() => selectShipping( item )}
                        >
                           <Text className="font-bold mb-1">{item.shippingMethod} ({formatCurrency( item.shippingCost || '' )})</Text>
                           <Text className='text-sm'>Estimate arrive {calculateEstimate( item.shippingId )}</Text>
                        </TouchableOpacity>
                     )}
                  />
               </Modal>
            </Portal>

            {/* payment */}
            <Portal>
               <Modal
                  visible={visiblePayment}
                  onDismiss={hideModalPayment}
                  contentContainerStyle={{
                     backgroundColor: '#F3F4FE',
                     padding: 20,
                     marginHorizontal: 20,
                     borderRadius: 10,
                  }}
               >
                  <Text className="text-2xl font-bold mb-3">Select Payment</Text>

                  {/* List Shipping */}
                  <FlatList
                     data={payments}
                     keyExtractor={( item ) => uuidv4()}
                     renderItem={( { item } ) => (
                        <TouchableOpacity
                           className="py-4 px-3 flex-row gap-x-2 items-center border-b border-gray"
                           onPress={() => selectPayment( item )}
                        >
                           <Ionicons name="cash-outline" size={24} color="black" />
                           <Text className="font-bold mb-1">{item.paymentMethod}</Text>
                        </TouchableOpacity>
                     )}
                  />
               </Modal>
            </Portal>

            <Divider bold />

            <View className='mt-6'>
               <Text className='font-semibold text-lg mb-4'>
                  Price Details
               </Text>
               <View className='mb-6 ml-3 flex-row justify-between'>
                  <Text className='flex-1'>
                     Package Price Total
                  </Text>
                  <Text className='font-medium flex-1 text-right'>
                     {formatCurrency( packages.price || '' )}
                  </Text>
               </View>
               <View className='mb-6 ml-3 flex-row justify-between'>
                  <Text className='flex-1'>
                     Shipping costs
                  </Text>
                  <Text className='font-medium flex-1 text-right'>
                     {formatCurrency( selectedShipping?.shippingCost || '0' )}
                  </Text>
               </View>
               <View className='mb-6 ml-3 flex-row justify-between'>
                  <Text className='flex-1'>
                     Insurance Cost
                  </Text>
                  <Text className='font-medium flex-1 text-right'>
                     {formatCurrency( insuranceCosts ) || ''}
                  </Text>
               </View>
               <View className='mb-6 ml-3 flex-row justify-between'>
                  <Text className='flex-1'>
                     Admin Fee
                  </Text>
                  <Text className='font-medium flex-1 text-right'>
                     {formatCurrency( adminFee ) || ''}
                  </Text>
               </View>

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
                  {
                     formatCurrency( adminFee +
                        insuranceCosts +
                        ( selectedShipping?.shippingCost || 0 ) +
                        parseFloat( packages.price || 0 ) )
                  }
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
               onPress={() =>
               {
                  handlePayment();
               }}
            >
               <Text className="text-white text-lg font-bold">Pay Now</Text>
            </TouchableOpacity>
         </View>
      </View>
   );
};

export default Checkout;