
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, Image, Dimensions, ActivityIndicator, ScrollView, RefreshControl } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';
import { fetchOrderListController } from '../../../controller/orderController';
import { v4 as uuidv4 } from 'uuid';
import moment from 'moment';

const ConfirmYourOrder = () =>
{
   const { jwtToken, isAdmin, userId } = useSelector( ( state ) => state.auth );
   const screenWidth = Dimensions.get( 'screen' ).width;

   const [ isLoading, setIsLoading ] = useState( true );

   const { orders, hasMore, loading, loadMore, getDataByFilter, resetPagination } = fetchOrderListController();

   const [ refreshing, setRefreshing ] = useState( false );

   const [ filters, setFilters ] = useState( {
      status: 'confirm',
      userId: userId
   } );

   useEffect( () =>
   {
      resetPagination();
      getDataByFilter( filters, jwtToken );
   }, [] );


   const handleRefresh = async () =>
   {
      setRefreshing( true );
      resetPagination();
      getDataByFilter( filters, jwtToken );
      setRefreshing( false );
   };

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
         <View
            className='bg-white flex-row rounded-2xl p-3 '
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
               {
                  item.status === 'Completed' ? (
                     <Text className='font-bold text-lg text-green-500'>
                        {item.status}
                     </Text>
                  ) : (
                     <Text className='font-bold text-lg text-red-500'>
                        {item.status}
                     </Text>
                  )
               }

            </View>

         </View>
      );
   };

   return (
      <View className='flex-1 bg-background px-7 py-5'>
         <ScrollView
            showsVerticalScrollIndicator={false}
         >
            {
               orders ? (
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
                     refreshControl={
                        <RefreshControl
                           refreshing={refreshing}
                           onRefresh={handleRefresh}
                           colors={[ "#1e90ff" ]}
                        />
                     }
                  />
               ) : (
                  <Text className='text-lg font-medium text-center flex-1'>Your order is empty</Text>
               )
            }
         </ScrollView>
      </View>
   );
};

export default ConfirmYourOrder;