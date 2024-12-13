
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StatusBar, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import { fetchOrderListController } from '../../../controller/orderController';
import { v4 as uuidv4, v4 } from 'uuid';
import moment from 'moment';
import { fetchProductDetailByIdController } from '../../../controller/productController';

const YourBusiness = () =>
{
   const { jwtToken, isAdmin, userId } = useSelector( ( state ) => state.auth );

   const navigation = useNavigation();

   const screenHeight = Dimensions.get( 'screen' ).height;
   const screenWidth = Dimensions.get( 'screen' ).width;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   const [ isLoading, setIsLoading ] = useState( true );
   const [ refreshing, setRefreshing ] = useState( false );

   const { orders, hasMore, loading, loadMore, getDataByFilter, resetPagination } = fetchOrderListController();

   const [ filters, setFilters ] = useState( {
      status: 'confirm', // nanti diubah ke confirm / pending
      userId: userId
   } );

   const [ data, setData ] = useState( [] );

   const fetchData = async () =>
   {

      try
      {
         setIsLoading( true );
         resetPagination();
         await getDataByFilter( filters, jwtToken );

         if ( !orders || orders.length === 0 )
         {
            return;
         }

         const dataArray = await Promise.all(
            orders.map( async ( order ) =>
            {
               try
               {
                  const { name } = await fetchProductDetailByIdController( jwtToken, order.product_id );

                  return {
                     package_franchise_id: order.package_franchise_id,
                     franchise_name: order.franchise_name,
                     order_date: order.order_date,
                     product_id: order.product_id,
                     total_amount: order.total_amount,
                     category: order.category,
                     order_id: order.order_id,
                     profile: order.profile,
                     productName: name || "Unknown Product",
                  };
               } catch ( error )
               {
                  console.error( `Error fetching product details for order ${ order.order_id }:`, error );
                  return {
                     package_franchise_id: order.package_franchise_id,
                     franchise_name: order.franchise_name,
                     order_date: order.order_date,
                     product_id: order.product_id,
                     total_amount: order.total_amount,
                     category: order.category,
                     order_id: order.order_id,
                     profile: order.profile,
                     productName: "Error fetching name",
                  };
               }
            } )
         );

         setData( dataArray ); // Simpan data ke state
      } catch ( error )
      {
         console.error;
      } finally
      {
         setIsLoading( false );
         setRefreshing( false );
      }
   };

   const handleRefresh = async () =>
   {
      setRefreshing( true );
      await fetchData();
      setRefreshing( false );
   };


   useEffect( () =>
   {
      fetchData();
   }, [ filters, jwtToken ]
   );



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

   const formatCurrency = ( value ) =>
   {
      return 'Rp ' + value.toString().replace( /\B(?=(\d{3})+(?!\d))/g, '.' );
   };

   const renderEmptyComponent = () => (
      <View className='w-full h-full flex-1' style={{ paddingBottom: screenHeight * 0.7 }}>
         <Text className='text-lg font-medium text-center'>Data is Empty</Text>
      </View>
   );

   const renderItem = ( { item } ) =>
   {
      return (
         <View
            className='bg-white mb-1 rounded-2xl p-4 shadow-sm'
            style={{
               shadowColor: '#000',
               shadowOffset: { width: 0, height: 2 },
               shadowOpacity: 0.2,
               shadowRadius: 18,
               elevation: 2,
            }}
         >
            <View className='flex-row'>
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
               <View className='ml-4 gap-y-2 flex-1'>
                  <Text className='text-xs'>
                     {moment( item.order_date ).format( 'DD MMMM YYYY' )}
                  </Text>
                  <Text
                     className="font-bold text-xl"
                     numberOfLines={1}
                     ellipsizeMode="tail"
                  >
                     {item.franchise_name || ''}
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
                     <Text className="text-sm ml-1 text-[#515151]">{item.category || ''}</Text>
                  </View>
               </View>
            </View>
            <Text className='mt-2 font-medium'>
               Price :
            </Text>
            <Text className='font-bold text-blueDark text-xl'>
               {formatCurrency( item.total_amount || '-' )}
            </Text>
            <TouchableOpacity
               className='rounded-full absolute right-4 bottom-4 bg-yellow p-2'
               onPress={() =>
               {
                  navigation.navigate( 'YourBusinessDetailTopTabs', {
                     orderId: item.order_id,
                     productId: item.product_id,
                     packageId: item.package_franchise_id,
                     productName: item.productName
                  } );
               }}
            >
               <MaterialIcons name="info-outline" size={20} color="white" />
            </TouchableOpacity>
         </View>
      );
   };

   return (
      <View className="flex-1 bg-background">
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

         {/* App Bar */}
         <View
            className="bg-blue flex-row px-7 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
            style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8}}
         >
            <Image
               source={require( '../../../assets/icons/storeMiringKecil.png' )}
               className='absolute -top-4 -left-7'
            />

            <Text className='text-3xl text-white font-semibold'>
               Your Business
            </Text>
         </View>

         <ScrollView showsVerticalScrollIndicator={false} className='px-7 my-5'>
            <FlatList
               data={data}
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
               refreshing={refreshing}
               onRefresh={handleRefresh}
               ListEmptyComponent={renderEmptyComponent}
            />
         </ScrollView>
      </View>
   );
};

export default YourBusiness;