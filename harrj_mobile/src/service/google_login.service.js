import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class googleLoginService {
  googleLogin(user_id) {
    try {
      const url = BASE_URL + '/login/google_login';
      const insertData = new FormData();

      insertData.append('user_id', user_id);

      console.log(' googleLogin insertData ');
      console.log(insertData);

      console.log(' googleLogin url ');
      console.log(url);

      return axios.post(url, insertData).then(response => {
        console.log('googleLogin service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('googleLogin service error:');
      console.log(error);

      return error;
    }
  }
}

export default new googleLoginService();
