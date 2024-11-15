import { StyleSheet, Text, View, Constants } from 'react-native';
import React from 'react';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
const GOOGLE_PLACES_API_KEY = process.env.EXPO_PUBLIC_API_GOOGLEPLACE;
const OrderList = () =>
{
   return (
      <View style={styles.container}>
         <GooglePlacesAutocomplete
            placeholder="Search"
            query={{
               key: GOOGLE_PLACES_API_KEY,
               language: 'en', // language of the results
            }}
            onPress={( data, details = null ) => console.log( data )}
            onFail={( error ) => console.error( error )}
            enablePoweredByContainer={false}
         />
         <Text>aa</Text>
      </View>
   );
};

export default OrderList;

const styles = StyleSheet.create( {
   container: {
      flex: 1,
      padding: 10,
      paddingTop: 40,
      backgroundColor: '#ecf0f1',
   },
} );