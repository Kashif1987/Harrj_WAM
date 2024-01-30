import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class updatePassword {
  updatePasswordService() {
    try {
      const url = BASE_URL + '/register';
      const insertData = new FormData();

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

export default new updatePassword();
