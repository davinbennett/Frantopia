import { StatusBar, StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSelector } from 'react-redux';

const CustomerHome = () =>
{
   const { jwtToken, isAdmin } = useSelector( ( state ) => state.auth );

   return (
      <SafeAreaView className='bg-slate-600 flex-1 ' edges={[ 'left', 'right', 'bottom', 'top' ]}>
         <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

         <Text>customer</Text>
         <Text style={styles.text}>JWT Token: {jwtToken ? jwtToken : 'No token found'}</Text>
         <Text style={styles.text}>Is Admin: {isAdmin ? 'Yes' : 'No'}</Text>
      </SafeAreaView>
   );
};

export default CustomerHome;

const styles = StyleSheet.create( {} );