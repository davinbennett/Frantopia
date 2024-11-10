import axios from 'axios';

const BASE_URL = 'https://2852-2001-448a-400f-1b4d-8d9c-9311-c83e-f27d.ngrok-free.app/api/v1/auth';

export const loginToBackend = async ( idToken, accessToken ) =>
{
   const response = await axios.post( `${ BASE_URL }/login`, {
      idToken,
      accessToken,
   } );
   return response.data.data.jwtToken;
};