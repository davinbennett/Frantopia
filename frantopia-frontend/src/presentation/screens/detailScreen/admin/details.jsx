import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, StatusBar, Dimensions, Keyboard, ActivityIndicator, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Portal, Button, RadioButton, Divider } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';

const DetailsAdmin = ( { id, name } ) =>
{
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

   const productGalleryData = [
      { id: '1', uri: 'https://via.placeholder.com/150' },
      { id: '2', uri: 'https://via.placeholder.com/150' },
      { id: '3', uri: 'https://via.placeholder.com/150' },
      { id: '4', uri: 'https://via.placeholder.com/150' },
      { id: '5', uri: 'https://via.placeholder.com/150' },
      { id: '6', uri: 'https://via.placeholder.com/150' },
   ];

   // Data untuk Packages
   const packagesData = [
      { id: '1', title: 'Package 1', price: '$10' },
      { id: '2', title: 'Package 2', price: '$20' },
      { id: '3', title: 'Package 3', price: '$30' },
   ];

   const renderProductItem = ( { item } ) => (
      <Image
         source={{ uri: item.uri }}
         style={{ width: 100, height: 100, borderRadius: 8, marginHorizontal: 5 }}
      />
   );

   const renderPackageItem = ( { item } ) => (
      <View
         className="p-5 gap-y-2 mr-3"
         style={{
            borderWidth: 1,
            borderColor: '#ccc',
            shadowColor: 'black',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 12,
            elevation: 0,
            borderRadius: 8,
         }}
      >
         <Text className="font-bold text-lg mb-3">{item.title}</Text>
         <Text className="">
            Concept:
         </Text>
         <Text className="ml-6 font-bold">
            Lorem
         </Text>
         <Text className="">
            Size Concept:
         </Text>
         <Text className="ml-6 font-bold">
            Lorem
         </Text>
         <Text className="">
            Grass Profit:
         </Text>
         <Text className="ml-6 font-bold">
            Lorem:
         </Text>
         <Text className="">
            Income:
         </Text>
         <Text className="ml-6 font-bold">
            Lorem
         </Text>
         <Text className="">
            License:
         </Text>
         <Text className="ml-6 font-bold">
            Lorem
         </Text>
         <Text className="">
            Price:
         </Text>
         <Text className="ml-6 font-bold">{item.price}</Text>
      </View>
   );

   return (
      <View className='flex-1 bg-background px-7 '>
         <FlatList
            showsVerticalScrollIndicator={false}
            data={{}}
            ListHeaderComponent={
               <View
                  style={{
                     shadowColor: 'black',
                     shadowOffset: { width: 0, height: 1 },
                     shadowOpacity: 0.1,
                     elevation: 1,
                     marginVertical: 18,
                  }}
                  className="bg-white rounded-2xl mb-5 "
               >
                  <Image
                     source={{
                        uri: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRlwn9-P2hxqO3WX1CYqWLHeP6H1Zk6KwSYfA&s',
                     }}
                     className="w-full rounded-tl-2xl rounded-tr-2xl mb-1"
                     style={{ height: screenHeight * 0.2 }}
                  />
                  <View className="p-5 gap-y-3">
                     <Text className="text-2xl font-bold">Barberking</Text>
                     <View className="flex-row gap-x-2 items-center">
                        <MaterialIcons name="content-cut" size={24} color="#2d70f3" />
                        <Text className="text-[#515151] font-medium">Salon & Barber</Text>
                     </View>
                     <Text>est. 2019</Text>
                     <Divider bold />
                     <Text className="font-bold text-xl text-blueDark">Detail</Text>
                     <Text>
                        Pariatur tempor pariatur dolore ea consequat occaecat consectetur sit
                        excepteur. Ullamco anim officia irure exercitation aliqua in nisi commodo
                        occaecat labore est amet voluptate. Excepteur ipsum ut culpa irure nulla
                        officia nostrud incididunt incididunt reprehenderit non.
                     </Text>
                     <Divider bold />
                     <Text className="font-bold text-xl text-blueDark">Products Gallery</Text>
                     <FlatList
                        data={productGalleryData}
                        keyExtractor={( item ) => item.id}
                        renderItem={renderProductItem}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ marginVertical: 10 }}
                     />
                     <Divider bold />
                     <Text className="font-bold text-xl text-blueDark">Packages</Text>
                     <FlatList
                        data={packagesData}
                        keyExtractor={( item ) => item.id}
                        renderItem={renderPackageItem}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{}}
                     />
                  </View>
               </View>
            }
         />
      </View>
   );
};

export default DetailsAdmin;
