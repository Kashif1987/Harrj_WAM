import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class userInfoService {
  userInfo(email_id, token) {
    try {
      const url = BASE_URL + '/api/user/getinfo';

      let checkData = {};
      checkData['email_id'] = email_id;

      var header = {
        Accept: 'application/json, text/plain, */*',
        'x-access-token': token,
      };

      return axios.post(url, checkData, {headers: header}).then(response => {
        return response.data;
      });
    } catch (error) {
      return error;
    }
  }
}

export default new userInfoService();
