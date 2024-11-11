import axios from 'axios';

const BASE_URL = 'https://fc68-180-254-245-201.ngrok-free.app/api/v1/auth';

export const loginToBackendApi = async ( idToken, accessToken ) =>
{
   const response = await axios.post( `${ BASE_URL }/login`, {
      idToken,
      accessToken,
   } );
   return response.data.data.jwtToken;
};