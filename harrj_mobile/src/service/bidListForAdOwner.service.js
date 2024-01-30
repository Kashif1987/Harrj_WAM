import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class bidListForAdOwner {
  bidListForAdOwnerService(token, customer_id) {
    try {
      const url = BASE_URL + '/api/customer/bid_list_by_customer_id';

      const insertData = new FormData();

      insertData.append('customer_id', customer_id);

      console.log('AD Bidder List Info:');
      console.log(url);
      console.log(' AD Bidder List Data:');
      console.log(insertData);

      return axios.post(url, insertData).then(response => {
        console.log('AD Bidder List Service Response:');
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

export default new bidListForAdOwner();
