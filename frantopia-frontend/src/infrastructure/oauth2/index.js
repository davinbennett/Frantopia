import
{
   GoogleSignin,
   GoogleSigninButton,
   statusCodes,
} from '@react-native-google-signin/google-signin';

GoogleSignin.configure( {
   webClientId: '465188695422-il627g4g80mrkpeia71k11m2lcj8k39m.apps.googleusercontent.com',
   scopes: [ 'https://www.googleapis.com/auth/drive.readonly' ],
   offlineAccess: true, 
   hostedDomain: '',
   forceCodeForRefreshToken: true,
   accountName: '',
   profileImageSize: 120,
} );

export const signInWithGoogleOauth2 = async () =>
{
   try
   {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      
      if ( !userInfo )
      {
         throw new Error( "User not signed in" );
      }

      const { idToken, accessToken } = await GoogleSignin.getTokens();
      return { idToken, accessToken, userInfo };
   } catch ( error )
   {
      if ( error.message && error.message.includes( 'getTokens requires a user to be signed in' ) )
      {
         return;
      }
      console.error( 'Google Sign-in error:', error );
      throw error;
   }
};

export const signOutOauth2 = async () =>
{
   try
   {
      await GoogleSignin.signOut();
      console.log( 'Google Sign-out Success' );
   } catch ( error )
   {
      console.error( error );
   }
};