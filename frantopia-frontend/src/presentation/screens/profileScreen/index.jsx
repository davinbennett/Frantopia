import { Text, TouchableOpacity, Dimensions, StatusBar, View, Image } from 'react-native';
import React, { useState, useEffect } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { logoutController } from '../../../controller/authController';
import { Input } from 'react-native-elements';
import { getProfileByIdAPI } from '../../../infrastructure/api/userApi';
import Ionicons from '@expo/vector-icons/Ionicons';

const Profile = ( { navigation } ) =>
{
   const [ name, setName ] = useState( null );
   const dispatch = useDispatch();
   const { jwtToken, isAdmin, userId } = useSelector( ( state ) => state.auth );
   const [ isLoading, setIsLoading ] = useState( true );

   const screenHeight = Dimensions.get( 'screen' ).height;
   const screenWidth = Dimensions.get( 'screen' ).width;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

   const handleLogout = async () =>
   {
      await logoutController( dispatch );
      navigation.reset( {
         index: 0,
         routes: [ { name: 'AuthStackNavigator' } ],
      } );
   };

   const [ userName, setUserName ] = useState( '' );
   const [ profilePicture, setProfilePicture ] = useState( '' );

   const getProfileById = async () =>
   {
      try
      {
         const {
            userName,
            profilePicture
         } = await getProfileByIdAPI( jwtToken, userId );

         setUserName( userName );
         setProfilePicture( profilePicture );
      } catch ( error )
      {
         console.log( 'error getProfileById: ', error );
      }
   };

   useEffect( () =>
   {
      Promise.all( [
         getProfileById(),
      ] ).catch( error => console.error( 'Error fetching data:', error ) )
         .finally( () => setIsLoading( false ) );
   }, [] );

   return (
      <View className='flex-1 px-7 bg-blue items-center justify-between' style={{ paddingTop: StatusBar.currentHeight }}>
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
         <Image
            source={require( '../../../assets/icons/homeBGmiring.png' )}
            className='absolute -top-6 -left-9'
         />
         <Image
            source={require( '../../../assets/icons/homeBGmiring2.png' )}
            className='absolute -top-6 -right-9'
         />
         <View className='items-center justify-center gap-y-6'>
            <Text className='text-3xl text-white font-semibold text-center'>
               User Profile
            </Text>
            <Image
               className='rounded-full'
               style={{ height: screenWidth * 0.3, width: screenWidth * 0.3 }}
               source={{ uri: profilePicture || '' }}
            />
            <Text className='text-white text-lg font-medium'>
               {userName || ''}
            </Text>
         </View>
         <TouchableOpacity
            className='flex-row w-full items-center justify-center bg-yellow rounded-full py-3 mb-5'
            onPress={handleLogout}
         >
            <Ionicons name="log-out-outline" size={28} color="white" />
            <Text className='text-xl ml-2 font-medium text-white'>Log out</Text>
         </TouchableOpacity>

      </View>
   );
};

export default Profile;
