import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class userProfileService {
  userProfile(token) {
    try {
      const url = BASE_URL + '/profile';

      var header = {'x-access-token': token};

      console.log('header ');
      console.log(header);

      console.log('url ');
      console.log(url);

      return axios.get(url, {headers: header}).then(response => {
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

  updateProfile(token, id, name, email_id, mobile_no) {
    try {
      const url = BASE_URL + '/api/user/update';
      var header = {'x-access-token': token};

      const insertData = {};

      insertData['id'] = id;
      insertData['name'] = name;
      insertData['email_id'] = email_id;
      insertData['mobile_no'] = mobile_no;

      console.log('URL: ' + url);
      console.log('INSERT DATA: ', insertData);

      return axios.post(url, insertData, {headers: header}).then(response => {
        return response.data;
      });
    } catch (error) {
      return error;
    }
  }
}

export default new userProfileService();
