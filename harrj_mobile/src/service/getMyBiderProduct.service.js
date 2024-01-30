import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;
const url = BASE_URL + '/api/bidder/bid_list_by_bidder_id?title=';
class getMyBiderProduct {
  getMyBiderProductList(token, user_id, title) {
    console.log(title);
    try {
      var header = {
        Accept: 'application/json, text/plain, */*',
        'x-access-token': token,
      };

      const insertData = new FormData();

      insertData.append('bidder_id', user_id);

      console.log('header ');
      console.log(header);

      console.log('Get Product Info:');
      console.log(url);
      console.log('Get Product Insert Data:');
      console.log(insertData);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('Get Service getMyBiderProductList Response:');
        console.log(response.data);

        return response.data;
      });
    } catch (error) {
      console.log('Get Service Info getMyBiderProductList Error:');
      console.log(error);

      return error;
    }
  }
}

export default new getMyBiderProduct();
