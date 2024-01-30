import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class bidListByBidder {
  bidListByBidderService(token, bidder_id) {
    try {
      const url = BASE_URL + '/api/bidder/bid_list_by_bidder_id';

      const insertData = new FormData();

      // var header = { 'x-access-token': token };
      var header = {
        Accept: 'application/json, text/plain, */*',
        'x-access-token': token,
      };

      insertData.append('bidder_id', bidder_id);

      console.log('header ');
      console.log(header);

      console.log('Bid List Info:');
      console.log(url);
      console.log(' Bid List Data:');
      console.log(insertData);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('Bid List Service Response:');
        console.log(response.data);
        return response.data;
      });
    } catch (error) {
      console.log('Get Bid List Service Info Error:');
      console.log(error);

      return error;
    }
  }
}

export default new bidListByBidder();
