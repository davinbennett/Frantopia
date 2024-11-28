import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import { fetchOrderListController } from '../../../controller/orderController';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const Confirm = () =>
{
   const navigation = useNavigation();
   const screenWidth = Dimensions.get( 'screen' ).width;

   const [ isLoading, setIsLoading ] = useState( true );
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

   const { orders, hasMore, loading, loadMore, getDataByFilter, resetPagination } = fetchOrderListController();

   const [ filters, setFilters ] = useState( {
      status: 'confirm',
   } );

   useFocusEffect(
      useCallback( () =>
      {
         resetPagination();
         getDataByFilter( filters, jwtToken );
      }, [] )
   );

   useEffect( () =>
   {
      resetPagination();
      getDataByFilter( filters, jwtToken );

   }, [] );

   const handleLoadMore = () =>
   {
      if ( !hasMore || loading ) return;
      loadMore( filters, jwtToken );
   };

   const categoryIcons = {
      "Barber & Salon": { library: MaterialIcons, name: "content-cut" },
      "Food & Beverage": { library: MaterialIcons, name: "local-dining" },
      "Expedition": { library: MaterialIcons, name: "airport-shuttle" },
      "Health & Beauty": { library: MaterialIcons, name: "spa" },
   };

   const renderItem = ( { item } ) =>
   {
      return (
         <TouchableOpacity
            className='bg-white flex-row rounded-2xl p-3 '
            onPress={() =>
            {
               navigation.navigate( 'DetailOrder', {
                  orderId: item.order_id,
                  user_name: item.user_name,
                  productId: item.product_id,
                  packageId: item.package_franchise_id,
                  franchiseName: item.franchise_name,
                  category: item.category,
                  status: item.status,
                  orderDate: item.order_date,
                  profile: item.profile,
                  totalAmount: item.total_amount
               } );
            }}
         >
            <View
               style={{
                  width: screenWidth * 0.2,
                  height: screenWidth * 0.2
               }}
               className=''
            >
               <Image
                  source={{ uri: item.profile }}
                  style={{ width: '100%', height: '100%', resizeMode: 'cover' }}
                  className='rounded-xl'
               />
            </View>
            <View className='ml-4 justify-between'>
               <Text className='font-sm'>
                  {moment( item.order_date ).format( 'DD MMMM YYYY' )}
               </Text>
               <Text className='font-bold'>
                  {item.franchise_name}
               </Text>
               <Text className='text-xl font-bold'>
                  {item.user_name}
               </Text>
               <View className='flex-row items-center'>
                  {
                     categoryIcons[ item.category ] ? (
                        React.createElement(
                           categoryIcons[ item.category ].library,
                           {
                              name: categoryIcons[ item.category ].name,
                              size: 16,
                              color: "#2d70f3",
                           }
                        )
                     ) : (
                        <Image source={{ uri: categoryIcons[ item.category ] }} className="w-4 h-4 mr-1" />
                     )
                  }
                  <Text className="text-sm ml-1 text-[#515151]">{item.category}</Text>
               </View>
            </View>
            <View className='absolute right-3 top-3'>
               <MaterialIcons name="keyboard-arrow-right" size={24} color="#515151" />
            </View>
            <View className='absolute right-3 bottom-3'>
               <Text
                  className={`font-bold text-lg ${ item.status === 'Failed' ? 'text-red-500' : 'text-green-500' }`}>
                  {item.status}
               </Text>

            </View>

         </TouchableOpacity>
      );
   };

   return (
      <View className='flex-1 bg-background px-7 py-5'>
         <ScrollView
            showsVerticalScrollIndicator={false}
         >
            <FlatList
               data={orders}
               renderItem={renderItem}
               keyExtractor={( item ) => uuidv4()}
               showsVerticalScrollIndicator={false}
               onEndReached={handleLoadMore}
               onEndReachedThreshold={0.5}
               ListFooterComponent={loading ? <ActivityIndicator size="large" color="#2d70f3" /> : null}
               scrollEnabled={false}
               contentContainerStyle={{
                  rowGap: 9
               }}
            />
         </ScrollView>
      </View>
   );
};

export default Confirm;