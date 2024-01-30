import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class contactUsService {
  contactUs(name, email_id, mobile_no, message) {
    try {
      const url = BASE_URL + '/api/contact';
      const insertData = new FormData();

      insertData.append('name', name);
      insertData.append('email_id', email_id);
      insertData.append('mobile_no', mobile_no);
      insertData.append('message', message);

      console.log('insertData ');
      console.log(insertData);

      console.log('url ');
      console.log(url);

      return axios.post(url, insertData).then(response => {
        console.log('contactUs service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('contactUs service error:');
      console.log(error);

      return error;
    }
  }
}

export default new contactUsService();
