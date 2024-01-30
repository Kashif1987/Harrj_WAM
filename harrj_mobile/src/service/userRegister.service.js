import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class userRegisterService {
  userRegister(name, mobile_no, email_id, password) {
    console.log('user register service');
    try {
      const url = BASE_URL + '/register';
      const insertData = new FormData();

      insertData.append('name', name);
      insertData.append('mobile_no', mobile_no);
      insertData.append('email_id', email_id);
      insertData.append('password', password);
      insertData.append('role', 'customer');

      console.log('insertData ');
      console.log(insertData);

      console.log('url ');
      console.log(url);

      return axios.post(url, insertData).then(response => {
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

export default new userRegisterService();
