import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const DetailsCustomer = ( { route, navigation } ) =>
{
   const {id} = route.params;

   return (
      <View>
         <Text>DetailsCustomer</Text>
         <Text>id: {id}</Text>
      </View>
   );
};

export default DetailsCustomer;

const styles = StyleSheet.create( {} );