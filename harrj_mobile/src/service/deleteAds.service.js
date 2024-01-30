import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class deleteAds {
  deleteAdsService(token, product_id) {
    try {
      // const url = BASE_URL + "/api/product/delete"
      const url = BASE_URL + '/api/product/archive';

      const insertData = new FormData();

      var header = {'x-access-token': token};

      insertData.append('product_id', product_id);

      console.log('header ');
      console.log(header);

      console.log('archive Product Info:');
      console.log(url);
      console.log(' Product archive Data:');
      console.log(insertData);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('archive Service Response:');
        console.log(response.data);
        return response.data;
      });
    } catch (error) {
      console.log('Get Service Info Error:');
      console.log(error);

      return error;
    }
  }
}

export default new deleteAds();
