import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class deleteBids {
  deleteBidsService(token, bidder_id, bid_id) {
    try {
      const url = BASE_URL + '/api/customer/delete_bid';

      const insertData = new FormData();

      var header = {'x-access-token': token};

      insertData.append('bidder_id', bidder_id);
      insertData.append('bid_id', bid_id);

      console.log('Delete Product Info:');
      console.log(url);

      console.log(' Product Delete Data:');
      console.log(insertData);

      console.log('header ');
      console.log(header);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('Delete Service Response:');
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

export default new deleteBids();
