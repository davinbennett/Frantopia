import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTokenAdminStorage = async ( jwtToken, isAdmin ) =>
{
   try
   {
      await AsyncStorage.setItem( "jwtToken", jwtToken );
      await AsyncStorage.setItem( "isAdmin", JSON.stringify( isAdmin ) );
   } catch ( error )
   {
      console.error( "Error saving token", error );
   }
};

export const getTokenAdminStorage = async () =>
{
   try
   {
      const jwtToken = await AsyncStorage.getItem( "jwtToken" );
      const isAdmin = JSON.parse( await AsyncStorage.getItem( "isAdmin" ) );
      return { jwtToken, isAdmin };
   } catch ( error )
   {
      console.error( "Error retrieving token", error );
      return null;
   }
};

export const removeTokenAdminStorage = async () =>
{
   try
   {
      await AsyncStorage.removeItem( "jwtToken" );
      await AsyncStorage.removeItem( "isAdmin" );
   } catch ( error )
   {
      console.error( "Error removing token", error );
   }
};