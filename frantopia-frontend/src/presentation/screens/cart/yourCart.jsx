import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StatusBar, Dimensions, Alert, RefreshControl, ActivityIndicator } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { deleteCartController, fetchCartByIdController } from '../../../controller/userController';
import { v4 as uuidv4 } from 'uuid';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import Feather from '@expo/vector-icons/Feather';

const YourCart = ( { navigation } ) =>
{
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   const [ listCart, setListCart ] = useState( [] );
   const [ selectedCartId, setSelectedCartId ] = useState( null );
   const [ isLoading, setIsLoading ] = useState( true );
   const [ refreshing, setRefreshing ] = useState( false );
   const [ totalCount, setTotalCount ] = useState( 0 );

   const { jwtToken, userId } = useSelector( ( state ) => state.auth );

   const fetchCarts = async () =>
   {
      try
      {
         const { formattedListCart } = await fetchCartByIdController( jwtToken, userId );
         setListCart( formattedListCart );
      } catch ( error )
      {
         console.error( "Error fetching list cart:", error );
      }
   };

   useEffect( () =>
   {
      fetchCarts().finally( () => setIsLoading( false ) );
   }, [ totalCount ] );

   const handleRefresh = async () =>
   {
      setRefreshing( true );
      await fetchCarts();
      setRefreshing( false );
   };

   const [ selectedCartItem, setSelectedCartItem ] = useState( 0 );

   const handleCheckout = () =>
   {
      if ( !selectedCartId )
      {
         Alert.alert( 'No Selection', 'Please select a cart item to proceed with checkout.' );
         return;
      };

      if ( selectedCartItem.status === 'sold' )
      {
         Alert.alert( 'Product has been sold', 'Please select another product.' );
         return;
      }

      navigation.navigate( 'Checkout', {
         packages: {
            "grossProfit": selectedCartItem.grossProfit,
            "id": selectedCartItem.packageId,
            "income": selectedCartItem.income,
            "price": selectedCartItem.price,
            "sizeConcept": selectedCartItem.sizeConcept,
            "title": selectedCartItem.packageName
         },
         productId: selectedCartItem.productId,
         productName: selectedCartItem.franchiseName,
         licensed: selectedCartItem.licensed,
         fromCart: true,
         cartId: selectedCartItem.cartId
      } );
   };



   const renderCartItem = ( { item } ) =>
   {
      const isSelected = selectedCartId === item.cartId;
      const isSold = item.status === 'sold';

      return (
         <TouchableOpacity
            style={{
               backgroundColor: isSelected && !isSold ? '#d3e5ff' : '#fff',
               borderWidth: 1,
               borderColor: '#ddd',
            }}
            className={`mx-7 px-3 py-4 rounded-2xl flex-row mt-5 ${ isSold ? 'opacity-50' : '' }`}
            onPress={() =>
            {
               if ( !isSold )
               {
                  setSelectedCartId( item.cartId );
                  setSelectedCartItem( item );
               }
            }}
            disabled={isSold}
         >


            {/* Radio Button */}
            <View className="mr-3">
               <Ionicons
                  name={isSelected && !isSold ? 'radio-button-on' : 'radio-button-off'}
                  size={20}
                  color={isSelected && !isSold ? '#2d70f3' : '#ccc'}
               />
            </View>

            {/* profile */}
            {
               item.profile ? (
                  <Image
                     source={{ uri: item.profile }}
                     width={screenHeight * 0.09}
                     height={screenHeight * 0.09}
                  />
               ) : (
                  <SkeletonPlaceholder>
                     <SkeletonPlaceholder.Item
                        width={screenHeight * 0.09}
                        height={screenHeight * 0.09}
                     />
                  </SkeletonPlaceholder>
               )
            }



            <View className='ml-4 flex-1 justify-between'>
               <View className=''>
                  <Text
                     numberOfLines={1}
                     ellipsizeMode='tail'
                     className='font-bold text-xl'
                  >{item.franchiseName}</Text>
                  <Text numberOfLines={1}
                     ellipsizeMode='tail'
                     className=' text-slate-500 font-medium'>
                     {item.packageName}
                  </Text>

                  {isSold && (
                     <Text className="text-red-500 font-semibold mt-2">Product not Available</Text>
                  )}
               </View>
               <View className='flex-row justify-between items-end'>
                  <Text
                     className='font-bold text-xl flex-1 text-[#062DF6]'
                     numberOfLines={1}
                     adjustsFontSizeToFit
                  >
                     {formatCurrency( item.price || '' )}
                  </Text>
                  <TouchableOpacity
                     className=''
                     onPress={async () =>
                     {
                        try
                        {
                           // Hapus dari cart
                           await deleteCartController( jwtToken, userId, item.cartId );
                           await fetchCarts();
                           setTotalCount( totalCount + 1 );
                           setSelectedCartItem( prevState => ( {
                              ...prevState,
                              price: 0
                           } ) );
                        } catch ( error )
                        {
                           console.error( 'Failed to delete carts:', error );
                        }
                     }}
                  >
                     <Feather name="trash-2" size={20} color="gray" />
                  </TouchableOpacity>
               </View>
            </View>
         </TouchableOpacity>
      );
   };

   const formatCurrency = ( value ) =>
   {
      return 'Rp ' + value.toString().replace( /\B(?=(\d{3})+(?!\d))/g, '.' );
   };

   return (
      <View className="flex-1 bg-background">
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

         {/* App Bar */}
         <View
            className="bg-blue flex-row px-5 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
            style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8, marginBottom: 0 }}
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
                  Your Cart
               </Text>
            </View>
         </View>

         {/* Content */}
         {isLoading ? (
            <ActivityIndicator size="large" color="#2d70f3" style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }} className='pt-5' />
         ) : listCart.length === 0 ? (
            <Text className='text-lg font-medium text-center flex-1 pt-5'>Your cart is empty</Text>
         ) : (
            <FlatList
               data={listCart}
               keyExtractor={( item ) => uuidv4()}
               renderItem={renderCartItem}
               contentContainerStyle={{ paddingBottom: 20 }}
               refreshControl={
                  <RefreshControl
                     refreshing={refreshing}
                     onRefresh={handleRefresh}
                     colors={[ "#1e90ff" ]}
                  />
               }
            />
         )}

         {/* Checkout Button */}
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
                  {formatCurrency( selectedCartItem.price || 0 )}
               </Text>
            </View>

            <TouchableOpacity
               onPress={handleCheckout}
               className="bg-yellow rounded-xl px-5 py-3 flex-1 items-center"
            >
               <Text className="text-white text-lg font-bold">Checkout</Text>
            </TouchableOpacity>
         </View>

      </View>
   );
};

export default YourCart;