import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class productGetInfo {
  getProductinfoService(token, product_id) {
    try {
      const url = BASE_URL + '/api/product/getinfo';

      var header = {'x-access-token': token};

      const insertData = new FormData();

      insertData.append('product_id', product_id);

      console.log('header ');
      console.log(header);

      console.log('Get Product Info:');
      console.log(url);
      console.log('Get Product Insert Data:');
      console.log(insertData);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('Get Get Product Info Service  Response:');
        console.log(response.data);
        return response.data;
      });
    } catch (error) {
      console.log('Get Product Info Service Info Error:');
      console.log(error);

      return error;
    }
  }
}

export default new productGetInfo();
