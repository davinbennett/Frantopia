export default class AuthInterface
{
   loginWithGoogleImpl ()
   {
      throw new Error( 'loginWithGoogleImpl method must be implemented' );
   }

   logoutUser ()
   {
      throw new Error( 'logoutUser method must be implemented' );
   }

   checkToken ()
   {
      throw new Error( 'checkToken method must be implemented' );
   }
}