import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class userLoginService {
  userLogin(user_id, password, firebase_token) {
    try {
      const url = BASE_URL + '/login';

      let checkData = {};
      checkData['user_id'] = user_id;
      checkData['password'] = password;
      checkData['firebase_token'] = firebase_token;

      console.log('checkData ');
      console.log(checkData);

      console.log('url ');
      console.log(url);

      return axios.post(url, checkData).then(response => {
        console.log('service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('service error:');
      console.log(error);

      return error;
    }
  }
}

export default new userLoginService();
