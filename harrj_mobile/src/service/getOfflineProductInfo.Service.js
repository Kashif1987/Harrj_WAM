import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class getProductInfoService {
  getProductInfo(token) {
    try {
      const url = BASE_URL + '/admin/product/getinfo?';

      var header = {'x-access-token': token};

      console.log('header ');
      console.log(header);

      console.log('url ');
      console.log(url);

      return axios.post(url, {headers: header}).then(response => {
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

export default new getProductInfoService();
