import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class userLogoutService {
  userLogout(token) {
    try {
      const url = BASE_URL + '/login/logout';

      console.log('userLogout header ');
      console.log(header);

      console.log('userLogout url ');
      console.log(url);

      return axios.post(url, {headers: header}).then(response => {
        console.log('userLogout service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('userLogout service error:');
      console.log(error);

      return error;
    }
  }
}

export default new userLogoutService();
