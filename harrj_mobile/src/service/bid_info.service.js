import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class bidInfo {
  bidInfoService(token, bid_id) {
    try {
      const url = BASE_URL + '/api/customer/bid_getinfo';

      const insertData = new FormData();

      insertData.append('bid_id', bid_id);

      console.log('Bid Product Info:');
      console.log(url);
      console.log(' Bid Delete Data:');
      console.log(insertData);

      return axios.post(url, insertData).then(response => {
        console.log('Bid Service Response:');
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

export default new bidInfo();
