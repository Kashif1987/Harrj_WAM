// This util is to generate JWTs.
// THIS IS NOT A SAFE OPERATION TO DO IN YOUR APP IN PRODUCTION.
// JWTs should be provided by a backend server as they require a secret
// WHICH IS NOT SAFE TO STORE ON DEVICE!
// @ts-ignore
import jwt from 'react-native-pure-jwt';

import { ZOOM_APP_KEY, ZOOM_APP_SECRET } from '../../config';

function makeId(length: number) {
  var result = '';
  var characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export default async function generateJwt(sessionName: string, roleType: string) {
  console.log('ZOOM_APP_KEY+++++++++++++++++++++++++++++++++++++++++++++');

  console.log(ZOOM_APP_KEY);
  console.log(ZOOM_APP_SECRET);

  // @ts-ignore
  const token = await jwt.sign(
    {
      app_key: ZOOM_APP_KEY,
      version: 1,
      user_identity: makeId(10),
      iat: new Date().getTime(),
      exp: new Date(Date.now() + 23 * 3600 * 1000).getTime(),
      tpc: sessionName,
      role_type: Number(roleType),
    },
    ZOOM_APP_SECRET,
    {
      alg: 'HS256',
    }
  );

  console.log(token);
  return token;
}
