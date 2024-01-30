import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

var dataInsert = new FormData();
class addBid {
  addBidService(token, bidder_id, product_id, bid_amount, customer_id) {
    try {
      const url = BASE_URL + '/api/bidder/add_bid';

      const insertData = new FormData();

      var header = {
        Accept: 'application/json, text/plain, */*',
        'x-access-token': token,
      };

      insertData.append('bidder_id', bidder_id);
      insertData.append('product_id', product_id);
      insertData.append('bid_amount', bid_amount);
      insertData.append('customer_id', customer_id);

      console.log('Add Bid Info:');
      console.log(url);

      console.log('Add Bid Data:');
      console.log(insertData);

      dataInsert = insertData;

      console.log('header ');
      console.log(header);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('Add Bid Service Response:');
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

export default new addBid();
