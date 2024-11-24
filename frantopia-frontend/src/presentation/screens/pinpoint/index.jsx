import React, { useState, useEffect } from 'react';
import
{
   View,
   Text,
   TouchableOpacity,
   ActivityIndicator,
   StatusBar,
   Dimensions,
   Alert,
   Image
} from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const PinPoint = ( { navigation, route } ) =>
{
   const screenHeight = Dimensions.get( 'screen' ).height;
   const windowHeight = Dimensions.get( 'window' ).height;
   const navbarHeight = screenHeight - windowHeight + ( StatusBar.currentHeight || 0 );
   const bottomHeight = useSafeAreaInsets().bottom;

   const { onGoBack } = route.params || {};

   const [ location, setLocation ] = useState( null );
   const [ errorMsg, setErrorMsg ] = useState( null );
   const [ mapRegion, setMapRegion ] = useState( null );
   const [ loading, setLoading ] = useState( true );
   const [ selectedAddress, setSelectedAddress ] = useState( null );

   useEffect( () =>
   {
      ( async () =>
      {
         let { status } = await Location.requestForegroundPermissionsAsync();
         if ( status !== 'granted' )
         {
            setErrorMsg( 'Permission to access location was denied' );
            setLoading( false );
            return;
         }

         let currentLocation = await Location.getCurrentPositionAsync( {} );
         if ( currentLocation?.coords )
         {
            const { latitude, longitude } = currentLocation.coords;
            setLocation( { latitude, longitude } );
            setMapRegion( {
               latitude,
               longitude,
               latitudeDelta: 0.01,
               longitudeDelta: 0.01,
            } );
         }
         setLoading( false );
      } )();
   }, [] );

   if ( errorMsg )
   {
      Alert.alert( 'Error', errorMsg );
   }

   const goToUserLocation = async () =>
   {
      setLoading( true );
      try
      {
         let currentLocation = await Location.getCurrentPositionAsync( {} );
         if ( currentLocation?.coords )
         {
            const { latitude, longitude } = currentLocation.coords;
            setLocation( { latitude, longitude } );
            setMapRegion( {
               latitude,
               longitude,
               latitudeDelta: 0.01,
               longitudeDelta: 0.01,
            } );
         }
      } catch ( error )
      {
         Alert.alert( 'Error', 'Unable to fetch location. Please try again.' );
      } finally
      {
         setLoading( false );
      }
   };

   return (
      <View style={{ flex: 1 }}>
         <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

         {/* App Bar */}
         <View
            className=" flex-row px-5 w-full rounded-bl-2xl rounded-br-2xl gap-y-3 items-center bg-white"
            style={{ height: navbarHeight, paddingTop: StatusBar.currentHeight, paddingBottom: 8, marginBottom: 0 }}
         >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
               <TouchableOpacity
                  onPress={() => navigation.goBack()}
               >
                  <MaterialIcons name="keyboard-arrow-left" size={32} color="black" />
               </TouchableOpacity>
               <Text className='text-3xl font-semibold ml-2'>
                  Set Pinpoint
               </Text>
            </View>
         </View>

         {/* Maps */}
         <View style={{ flex: 1 }}>
            <View style={{ position: 'absolute', top: 10, width: '100%', zIndex: 1 }}>
               <GooglePlacesAutocomplete
                  placeholder="Search location"
                  onPress={( data, details = null ) =>
                  {
                     const { lat, lng } = details.geometry.location;
                     setLocation( { latitude: lat, longitude: lng } );
                     setMapRegion( {
                        latitude: lat,
                        longitude: lng,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                     } );

                     // Simpan alamat yang dipilih
                     setSelectedAddress( {
                        address: data.description,
                        coordinates: { latitude: lat, longitude: lng },
                     } );
                  }}
                  fetchDetails={true}
                  enablePoweredByContainer={false}
                  query={{
                     key: process.env.EXPO_PUBLIC_API_GOOGLEPLACE,
                     language: 'en',
                  }}
                  styles={{
                     textInput: {
                        height: 44,
                        borderRadius: 50,
                        paddingHorizontal: 15,
                        fontSize: 16,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0.2,
                        shadowRadius: 50,
                     },
                     container: {
                        flex: 0,
                        marginHorizontal: 30,
                        elevation: 3,
                        shadowColor: '#000',
                        shadowOffset: { width: 0, height: 1 },
                        shadowOpacity: 0,
                        shadowRadius: 50,
                        borderRadius: 50
                     },
                     listView: {
                        backgroundColor: '#fff',
                     },
                  }}
                  debounce={200}
               />
            </View>

            {loading ? (
               <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <ActivityIndicator size="large" color="#007AFF" />
               </View>
            ) : (
               <MapView
                  style={{ width: '100%', height: '100%' }}
                  region={mapRegion}
               >
                  {location && (
                     <Marker
                        coordinate={{
                           latitude: location.latitude,
                           longitude: location.longitude,
                        }}
                        title="Your Location"
                     />
                  )}
               </MapView>
            )}

            {/* Location Button */}
            <TouchableOpacity
               onPress={goToUserLocation}
               style={{
                  position: 'absolute',
                  bottom: 20 + bottomHeight,
                  right: 20,
                  backgroundColor: 'white',
                  borderRadius: 50,
                  padding: 10,
                  elevation: 5,
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.3,
                  shadowRadius: 3,
               }}
            >
               <MaterialIcons name="my-location" size={24} color="#007AFF" />
            </TouchableOpacity>
         </View>

         {/* Bottom Bar */}
         <View className="px-7 py-5 bg-blue">
            <Text
               className="text-white font-medium"
               style={{
                  lineHeight: 22,
               }}
            >
               {selectedAddress
                  ? `${ selectedAddress.address }\nLatitude: ${ selectedAddress.coordinates.latitude.toFixed(
                     6
                  ) }  |  Longitude: ${ selectedAddress.coordinates.longitude.toFixed( 6 ) }`
                  : 'No location selected'}
            </Text>
            <TouchableOpacity
               style={{
                  backgroundColor: '#f3b02d',
                  borderRadius: 10,
                  marginTop: 10,
                  paddingVertical: 10,
                  alignItems: 'center',
               }}
               onPress={() =>
               {
                  if ( selectedAddress )
                  {
                     navigation.replace( 'Address', {
                        address: selectedAddress.address,
                        latitude: selectedAddress.coordinates.latitude,
                        longitude: selectedAddress.coordinates.longitude,
                     } );
                  }

               }}
            >
               <Text style={{ color: '#fff', fontSize: 16, fontWeight: 'bold' }}>Choose Location</Text>
            </TouchableOpacity>
         </View>

      </View>
   );
};

export default PinPoint;
