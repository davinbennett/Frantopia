import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveToken = async ( token ) =>
{
   await AsyncStorage.setItem( 'jwtToken', token );
};

export const getToken = async () =>
{
   return await AsyncStorage.getItem( 'jwtToken' );
};