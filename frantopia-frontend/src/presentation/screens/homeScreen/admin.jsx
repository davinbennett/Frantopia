import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View, Image, Dimensions } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';
import { FontAwesome } from '@expo/vector-icons';
import { Searchbar } from 'react-native-paper';
import Ionicons from '@expo/vector-icons/Ionicons';


const AdminHome = () =>
{
  const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

  const screenHeight = Dimensions.get( 'screen' ).height;
  const windowHeight = Dimensions.get( 'window' ).height;
  const navbarHeight = screenHeight - windowHeight + StatusBar.currentHeight;

  const [ searchQuery, setSearchQuery ] = React.useState( '' );

  return (
    <SafeAreaView className='bg-background flex-1 ' edges={[ 'left', 'right', 'bottom' ]}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      {/* App Bar */}
      <View
        className="bg-blue flex-row px-7 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center"
        style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8 }}>
        {/* Image Store */}
        <Image
          source={require( '../../../assets/icons/storeMiringKecil.png' )}
          className='absolute top-0 -left-7'
        />

        {/* Search Field */}
        <View className='flex-1'>
          <Searchbar
            placeholder="Find your franchise"
            placeholderTextColor='#B1B1B1'
            cursorColor='grey'
            onChangeText={setSearchQuery}
            iconColor='#B1B1B1'
            backgroundColor='#FFFFFF'
            value={searchQuery}
            traileringIconColor='black'
            style={{
              overflow: 'hidden',
              backgroundColor: '#FFFFFF',
              elevation: 0,
              alignItems: 'center',
              paddingHorizontal: 5,
              height: 37
            }}
            inputStyle={{
              borderRadius: 50,
              minHeight: 0
            }}
          />
        </View>

        {/* Cart Icon */}
        <TouchableOpacity className="ml-3">
          <Ionicons name="cart-outline" size={30} color="white" />
        </TouchableOpacity>
      </View>


    </SafeAreaView>
  );
};

export default AdminHome;

const styles = StyleSheet.create( {
  text: {
    color: 'white',
    fontSize: 16,
    marginVertical: 5,
  },
} );