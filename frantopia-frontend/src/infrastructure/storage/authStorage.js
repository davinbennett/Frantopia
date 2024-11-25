import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveTokenAdminStorage = async ( jwtToken, isAdmin, userId ) =>
{
   try
   {
      await AsyncStorage.setItem( "jwtToken", jwtToken );
      await AsyncStorage.setItem( "isAdmin", JSON.stringify( isAdmin ) );
      await AsyncStorage.setItem( "userId", `${ userId }` );
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
      const userId = parseFloat( await AsyncStorage.getItem( "userId" ) );
      return { jwtToken, isAdmin, userId };
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
      await AsyncStorage.removeItem( "userId" );
   } catch ( error )
   {
      console.error( "Error removing token", error );
   }
};