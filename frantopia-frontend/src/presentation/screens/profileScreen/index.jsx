import { StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, {useState} from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector, useDispatch } from 'react-redux';
import { logoutController } from '../../../controller/authController';
import { Input } from 'react-native-elements';

const Profile = ( { navigation } ) =>
{
   const [ name, setName ] = useState( null );
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
         <Input
            label="Business Name*"
            labelStyle={styles.labelStyle}
            inputContainerStyle={styles.inputContainerStyle}
            containerStyle={styles.containerStyle}
            value={name}
            onChangeText={( text ) => setName( text )}
         />
      </View>
   );
};

export default Profile;

const styles = StyleSheet.create( {} );