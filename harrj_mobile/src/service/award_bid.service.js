import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class award_bid {
  award_bidService(token, customer_id, bid_id, product_id) {
    try {
      const url = BASE_URL + '/api/bidder/award_bid';

      const insertData = new FormData();

      var header = {'x-access-token': token};

      insertData.append('customer_id', customer_id);
      insertData.append('bid_id', bid_id);
      insertData.append('bid_status', 'accepted');
      insertData.append('product_id', product_id);

      console.log('award_bid Info:');
      console.log(url);

      console.log('award_bid Data:');
      console.log(insertData);

      console.log('header ');
      console.log(header);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('award_bid Service Response:');
        console.log(response.data);
        return response.data;
      });
    } catch (error) {
      console.log('Get award_bid Service Info Error:');
      console.log(error);

      return error;
    }
  }
}

export default new award_bid();
