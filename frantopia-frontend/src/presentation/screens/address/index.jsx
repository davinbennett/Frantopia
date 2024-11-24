import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, ImageBackground, StatusBar, Dimensions, Keyboard, ActivityIndicator, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { Modal, Portal, Button, RadioButton, Divider } from 'react-native-paper';
import 'react-native-get-random-values';
import { useSelector } from 'react-redux';
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Feather from '@expo/vector-icons/Feather';

const Address = ( { route, navigation } ) =>
{
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );
   const screenHeight = Dimensions.get( 'screen' ).height;
   const screenWidth = Dimensions.get( 'screen' ).width;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;
   const [ isLoading, setIsLoading ] = useState( true );
   const bottomHeight = useSafeAreaInsets().bottom;

   const [ detailaAddress, setDetailAddress ] = useState( '' );
   const [ postalCode, setPostalCode ] = useState( '' );
   const { address, longitude, latitude } = route.params || {};

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
                     <Text className='flex-1 text-[#646468]'>{address}</Text>

                  </View>
               </View>
               <View className='px-7 mb-6'>
                  <Text className='mb-2 font-semibold text-lg'>
                     Detail Address
                  </Text>
                  <TextInput
                     value={detailaAddress} // Bind value to state
                     onChangeText={( text ) => setDetailAddress( text )} // Update state on change
                     className="border-b border-[#94acfc]"
                     placeholder="Enter your address" // Optional placeholder
                  />
               </View>

               {/* Postal Code */}
               <View className='px-7'>
                  <Text className='mb-2 font-semibold text-lg'>
                     Postal Code
                  </Text>
                  <TextInput
                     value={postalCode} // Bind value to state
                     onChangeText={( text ) => setPostalCode( text )} // Update state on change
                     className="border-b border-[#94acfc]"
                     placeholder="Enter postal code" // Optional placeholder
                     keyboardType="numeric" // Ensures only numeric input
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

                  }}
               >
                  Save
               </Button>
            </View>
         </View>

      </View>
   );
};

export default Address;