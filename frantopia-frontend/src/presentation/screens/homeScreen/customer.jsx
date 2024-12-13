import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, StatusBar, Dimensions, Keyboard, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { Modal, Portal, Button, RadioButton } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import { useProductListController } from '../../../controller/productController';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import Cart from '../cart';

const CustomerHome = () =>
{

   const formatPrice = ( price ) =>
   {
      if ( price >= 1_000_000_000 )
      {
         return 'Rp. ' + ( Math.floor( price / 1_000_000_000 * 10 ) / 10 ).toString().replace( '.', ',' ) + ' B';
      }
      if ( price >= 1_000_000 )
      {
         return 'Rp. ' + ( Math.floor( price / 1_000_000 * 10 ) / 10 ).toString().replace( '.', ',' ) + ' M';
      }
      if ( price >= 1_000 )
      {
         return 'Rp. ' + ( Math.floor( price / 1_000 * 10 ) / 10 ).toString().replace( '.', ',' ) + ' K';
      }
      return 'Rp. ' + price;
   };


   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

   const navigation = useNavigation();

   const screenHeight = Dimensions.get( 'screen' ).height;
   const screenWidth = Dimensions.get( 'screen' ).width;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   const categoryIcons = {
      "Barber & Salon": { library: MaterialIcons, name: "content-cut" },
      "Food & Beverage": { library: MaterialIcons, name: "local-dining" },
      "Expedition": { library: MaterialIcons, name: "airport-shuttle" },
      "Health & Beauty": { library: MaterialIcons, name: "spa" },
   };

   const { products, hasMore, loading, loadMore, getDataByFilter, resetPagination } = useProductListController();

   const [ filters, setFilters ] = useState( {
      priceMin: null,
      priceMax: null,
      category: null,
      location: null,
      status: 'available',
   } );

   const renderItem = ( { item } ) =>
   {
      const handlePressDetail = () =>
      {
         navigation.navigate( 'ProductDetailCustomer', {
            id: item.id,
            name: item.name
         } );
      };

      return (
         <TouchableOpacity
            className="rounded-xl shadow-md overflow-hidden bg-white flex-1 mb-3"
            onPress={handlePressDetail}
         >

            {/* image profile */}
            <View className='h-[90]'>
               {loading ? (
                  <SkeletonPlaceholder>
                     <SkeletonPlaceholder.Item width="100%" height="100%" />
                  </SkeletonPlaceholder>
               ) : (
                  <ImageBackground
                     source={{ uri: item.profile }}
                     className="w-full h-full"
                     imageStyle={{ resizeMode: 'cover' }}
                  />
               )}
            </View>

            {/* content */}
            <View className="pt-2 px-3">
               <Text className="font-bold text-lg text-ellipsis overflow-hidden whitespace-nowrap" numberOfLines={1}>
                  {item.name}
               </Text>
               <View className="flex-row items-center mt-1">
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
                  <Text className="text-xs ml-1 text-[#515151]">{item.category}</Text>
               </View>
               <Text className="text-xs mt-1">est. {item.established}</Text>

               <Text className="text-xs text-[#515151] mt-1">Start from:</Text>
               <Text className='font-bold text-blueDark'>{formatPrice( item.price )}</Text>
            </View>

            {/*  FOOTER */}
            <View className="flex-row mt-1 w-full">
               <View className="flex-row items-center bg-grayLight justify-between w-full px-3 py-1">
                  <View className='flex-row gap-x-1 flex-1'>
                     <MaterialIcons name="star" size={13} color="#FFBF00" />
                     <Text className="text-xs">{item.rating}</Text>
                  </View>
                  <View className='flex-row items-center gap-x-1 flex-1 justify-end'>
                     <MaterialIcons name="location-on" size={13} color="#2d70f3" />
                     <Text
                        className="text-xs "
                        numberOfLines={1} // Membatasi hanya 1 baris
                        ellipsizeMode="tail" // Memotong teks di akhir
                     >
                        {item.location}
                     </Text>
                  </View>
               </View>
            </View>
         </TouchableOpacity>
      );
   };

   // Location
   const [ modalVisibleLocation, setModalVisibleLocation ] = useState( false );
   const [ selectedPlace, setSelectedPlace ] = useState( null );

   // Price
   const [ visiblePrice, setVisiblePrice ] = useState( false );
   const [ selectedPrice, setSelectedPrice ] = useState( "" );
   const [ minPrice, setMinPrice ] = useState( null );
   const [ maxPrice, setMaxPrice ] = useState( null );
   const showModalPrice = () => setVisiblePrice( true );
   const hideModalPrice = () => setVisiblePrice( false );
   const handleSelectionPrice = ( value ) =>
   {
      setSelectedPrice( value );
      if ( value === "" )
      {
         setMinPrice( null );
         setMaxPrice( null );
      }
      else if ( value === "<10000000" )
      {
         setMinPrice( null );
         setMaxPrice( 9999999 );
      } else if ( value === "10000000-50000000" )
      {
         setMinPrice( 10000000 );
         setMaxPrice( 50000000 );
      } else if ( value === ">50000000" )
      {
         setMinPrice( 50000001 );
         setMaxPrice( null );
      }
   };

   // Category
   const [ visibleCategory, setVisibleCategory ] = useState( false );
   const [ selectedCategory, setSelectedCategory ] = useState( "" );

   const showModalCategory = () => setVisibleCategory( true );
   const hideModalCategory = () => setVisibleCategory( false );

   const handleSelectionCategory = ( value ) =>
   {
      setSelectedCategory( value );
   };

   useFocusEffect(
      useCallback( () =>
      {
         const updatedFilters = {};

         if ( minPrice !== null )
         {
            updatedFilters.priceMin = minPrice.toString();
         }

         if ( maxPrice !== null )
         {
            updatedFilters.priceMax = maxPrice.toString();
         }

         if ( selectedCategory !== null )
         {
            updatedFilters.category = selectedCategory;
         }

         if ( selectedPlace !== null )
         {
            updatedFilters.location = selectedPlace.name;
         }

         updatedFilters.status = 'available';

         setFilters( updatedFilters );
         resetPagination();
         getDataByFilter( filters, jwtToken );
      }, [ minPrice, maxPrice, selectedCategory, selectedPlace ] )
   );

   useEffect( () =>
   {


      resetPagination();
      getDataByFilter( filters, jwtToken );

   }, [ filters, jwtToken ] );

   const handleLoadMore = () =>
   {
      if ( !hasMore || loading ) return;
      loadMore( filters, jwtToken );
   };


   return (
      <SafeAreaView className="flex-1 bg-background" edges={[ 'left', 'right', 'bottom' ]}>
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

         {/* App Bar */}
         <View
            className="bg-blue flex-row px-7 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center justify-between"
            style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8 }}
         >
            <Image
               source={require( '../../../assets/icons/storeMiringKecil.png' )}
               className='absolute -top-4 -left-7'
            />

            <Text className='text-3xl text-white font-semibold'>
               Home
            </Text>

            <Cart/>
         </View>

         <FlatList
            showsVerticalScrollIndicator={false}
            data={[]}
            renderItem={null}
            keyExtractor={() => null}
            ListHeaderComponent={
               () => (
                  <View className='mx-7' >
                     <View
                        className='flex-1 bg-white flex-row items-center mt-5 rounded-xl'
                        style={{
                           shadowColor: 'black',
                           shadowOffset: { width: 0, height: 2 },
                           shadowOpacity: 0.1,
                           elevation: 3,
                        }}>

                        {/* PRICE */}
                        <TouchableOpacity
                           className="flex-1 flex-row items-center justify-center py-4 gap-x-2"
                           onPress={showModalPrice}
                        >
                           <Icon name="cash" size={26} color="#062df6" />
                           <Text className="font-medium">Price</Text>
                        </TouchableOpacity>

                        {/* Modal price*/}
                        <Portal>
                           <Modal
                              visible={visiblePrice}
                              onDismiss={hideModalPrice}
                              contentContainerStyle={{
                                 backgroundColor: 'white',
                                 padding: 20,
                                 margin: 20,
                                 borderRadius: 10,
                              }}
                           >
                              {/* Modal Header */}
                              <View className="flex-row items-center mb-4">
                                 <Icon name="cash" size={32} color="#062df6" />
                                 <Text className="text-xl font-bold ml-2">Prices</Text>
                              </View>

                              {/* Radio Button Group */}
                              <RadioButton.Group
                                 onValueChange={handleSelectionPrice}
                                 value={selectedPrice}
                              >
                                 <View className="flex-row items-center mb-2">
                                    <RadioButton value="" color='#062DF6' />
                                    <Text className="ml-2">{"All"}</Text>
                                 </View>
                                 <View className="flex-row items-center mb-2">
                                    <RadioButton value="<10000000" color='#062DF6' />
                                    <Text className="ml-2">{"< Rp 10.000.000"}</Text>
                                 </View>
                                 <View className="flex-row items-center mb-2">
                                    <RadioButton value="10000000-50000000" color='#062DF6' />
                                    <Text className="ml-2">{"Rp 10.000.000 - 50.000.000"}</Text>
                                 </View>
                                 <View className="flex-row items-center">
                                    <RadioButton value=">50000000" color='#062DF6' />
                                    <Text className="ml-2">{"> Rp 50.000.000"}</Text>
                                 </View>
                              </RadioButton.Group>

                              {/* Confirm Button */}
                              <Button
                                 mode="contained"
                                 onPress={() =>
                                 {
                                    hideModalPrice();
                                 }}
                                 className="mt-4"
                                 buttonColor='#F3B02D'
                              >
                                 Confirm
                              </Button>
                           </Modal>
                        </Portal>

                        <View className={`w-[1px] h-7 bg-[#BFBFBF]`} />

                        {/* LOCATION */}
                        <TouchableOpacity
                           className="flex-1 flex-row items-center justify-center py-4 gap-x-2"
                           onPress={() => setModalVisibleLocation( true )}
                        >
                           <Ionicons name="location-outline" size={24} color="#062df6" />
                           <Text className="font-medium">Location</Text>
                        </TouchableOpacity>


                        {/* Modal Location */}
                        <Portal>
                           <Modal
                              visible={modalVisibleLocation}
                              onDismiss={() =>
                              {
                                 Keyboard.dismiss();
                                 setModalVisibleLocation( false );
                              }}
                              contentContainerStyle={{
                                 backgroundColor: 'white',
                                 padding: 20,
                                 marginHorizontal: 20,
                                 borderRadius: 10,
                                 maxHeight: '80%',
                                 minHeight: '60%',
                              }}
                           >
                              <View>
                                 <Text className='font-bold text-xl mb-2'>
                                    Select Location
                                 </Text>
                              </View>
                              {/* Google Places Input */}
                              <View className="flex-1">
                                 <GooglePlacesAutocomplete
                                    placeholder="Search..."
                                    onPress={( data, details = null ) =>
                                    {
                                       setSelectedPlace( {
                                          name: data.description,
                                          details: details?.geometry?.location,
                                       } );
                                    }}
                                    query={{
                                       key: process.env.EXPO_PUBLIC_API_GOOGLEPLACE,
                                       language: 'en',
                                    }}
                                    fetchDetails={true}
                                    enablePoweredByContainer={false}
                                    styles={{
                                       textInput: {
                                          backgroundColor: '#f9f9f9',
                                          height: 40,
                                          borderRadius: 5,
                                          paddingHorizontal: 10,
                                          borderWidth: 1,
                                          borderColor: '#ddd',
                                       },
                                    }}
                                 />
                              </View>

                              {/* Display Tempat yang Dipilih */}
                              {selectedPlace && (
                                 <View className="p-3 bg-gray-100 rounded-md">
                                    <Text className="text-lg font-bold">
                                       Selected Place:
                                    </Text>
                                    <Text className="">
                                       {selectedPlace.name}
                                    </Text>
                                    {/* {selectedPlace.details && (
                                       <Text className="text-sm text-gray-600">
                                          Coordinates: Lat {selectedPlace.details.lat}, Lng{' '}
                                          {selectedPlace.details.lng}
                                       </Text>
                                    )} */}

                                 </View>
                              )}

                              {selectedPlace && (
                                 <Button
                                    style={{
                                       marginBottom: 5,
                                       borderColor: "#F3B02D"
                                    }}
                                    mode="outlined"
                                    textColor='#F3B02D'
                                    onPress={() =>
                                    {
                                       setSelectedPlace( null );
                                    }}
                                 >
                                    Reset
                                 </Button>
                              )}

                              {/* Button untuk Menutup Modal */}
                              <Button
                                 mode="contained"
                                 onPress={() => setModalVisibleLocation( false )}
                                 buttonColor='#F3B02D'
                              >
                                 Confirm
                              </Button>
                           </Modal>
                        </Portal>

                        <View className={`w-[1px] h-7 bg-[#BFBFBF]`} />

                        {/* CATEGORY */}
                        <TouchableOpacity
                           className="flex-1 flex-row items-center justify-center py-4 gap-x-2"
                           onPress={showModalCategory}>
                           <MaterialIcons name="category" size={24} color="#062df6" />
                           <Text className="font-medium">Category</Text>
                        </TouchableOpacity>
                        {/* Modal Category */}
                        <Portal>
                           <Modal
                              visible={visibleCategory}
                              onDismiss={hideModalCategory}
                              contentContainerStyle={{
                                 backgroundColor: 'white',
                                 padding: 20,
                                 margin: 20,
                                 borderRadius: 10,
                              }}
                           >
                              {/* Modal Header */}
                              <View className="flex-row items-center mb-4">
                                 <MaterialIcons name="category" size={32} color="#062df6" />
                                 <Text className="text-xl font-bold ml-2">Categories</Text>
                              </View>

                              {/* Radio Button Group */}
                              <RadioButton.Group
                                 onValueChange={handleSelectionCategory}
                                 value={selectedCategory}
                              >
                                 {/* reset */}
                                 <View className="flex-row items-center ml-1 mb-2 justify-between">
                                    <View className="flex-row items-center">
                                       <MaterialIcons name="apps" size={24} color="#000" />
                                       <Text className="ml-4 text-lg">All</Text>
                                    </View>
                                    <RadioButton value="" color='#062DF6' />
                                 </View>

                                 {/* Category 1: Food & Beverages */}
                                 <View className="flex-row items-center ml-1 mb-2 justify-between">
                                    <View className="flex-row items-center">
                                       <MaterialIcons name="local-dining" size={24} color="#000" />
                                       <Text className="ml-4 text-lg">Food & Beverages</Text>
                                    </View>
                                    <RadioButton value="Food & Beverage" color='#062DF6' />
                                 </View>

                                 {/* Category 2: Health & Beauty */}
                                 <View className="flex-row items-center ml-1 mb-2 justify-between">
                                    <View className="flex-row items-center">
                                       <MaterialIcons name="spa" size={24} color="#000" />
                                       <Text className="ml-4 text-lg">Health & Beauty</Text>
                                    </View>
                                    <RadioButton value="Health & Beauty" color='#062DF6' />
                                 </View>

                                 {/* Category 3: Barber & Salon */}
                                 <View className="flex-row items-center ml-1 mb-2 justify-between">
                                    <View className="flex-row items-center">
                                       <MaterialIcons name="fitness-center" size={24} color="#000" />
                                       <Text className="ml-4 text-lg">Barber & Salon</Text>
                                    </View>
                                    <RadioButton value="Barber & Salon" color='#062DF6' />
                                 </View>

                                 {/* Category 4: Expedition */}
                                 <View className="flex-row items-center ml-1 mb-2 justify-between">
                                    <View className="flex-row items-center">
                                       <MaterialIcons name="airport-shuttle" size={24} color="#000" />
                                       <Text className="ml-4 text-lg">Expedition</Text>
                                    </View>
                                    <RadioButton value="Expedition" color='#062DF6' />
                                 </View>
                              </RadioButton.Group>

                              {/* Confirm Button */}
                              <Button
                                 mode="contained"
                                 onPress={() =>
                                 {
                                    hideModalCategory();
                                    console.log( selectedCategory ); // Log selected category value
                                 }}
                                 className="mt-4"
                                 buttonColor='#F3B02D'
                              >
                                 Confirm
                              </Button>
                           </Modal>
                        </Portal>
                     </View>

                     <View className='my-5'>
                        {
                           products ? (
                              <FlatList
                                 data={products}
                                 renderItem={renderItem}
                                 keyExtractor={( item ) => item.id.toString()}
                                 numColumns={2}
                                 contentContainerStyle={{
                                 }}
                                 columnWrapperStyle={{
                                    justifyContent: 'space-between',
                                    columnGap: 9
                                 }}
                                 showsVerticalScrollIndicator={false}
                                 onEndReached={handleLoadMore}
                                 onEndReachedThreshold={0.5}
                                 ListFooterComponent={loading ? <ActivityIndicator size="large" color="#2d70f3" /> : null}
                              />
                           ) : (
                              <Text className='text-lg font-medium text-center'>
                                 Data is Empty
                              </Text>
                           )
                        }

                     </View>
                  </View>
               )
            }
         />
      </SafeAreaView>
   );
};

export default CustomerHome;