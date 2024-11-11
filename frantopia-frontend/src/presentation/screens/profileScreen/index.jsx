import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { logoutController } from '../../../controller/authController';

const Profile = ( { navigation } ) =>
{
   const dispatch = useDispatch();
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

   const handleLogout = async () =>
   {
      await logoutController( dispatch );
      navigation.reset( {
         index: 0,
         routes: [ { name: 'AuthStackNavigator' } ],
      } );
   };

   return (
      <View>
         <Text>Profile</Text>
         <Text>Profile</Text>
         <Text>Profile</Text>
         <TouchableOpacity onPress={handleLogout}>
            <Text className='text-6xl'>LOGOUT</Text>
         </TouchableOpacity>
      </View>
   );
};

export default Profile;

const styles = StyleSheet.create( {} );