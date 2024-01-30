import axios from 'axios';
import {Base_Url} from './../../config';
import {slackServiceFun} from './slack/slack';
const BASE_URL = Base_Url;

const url = BASE_URL + '/api/customer/list_myads';
class MyAdsList {
  MyAdsListService(token, user_id, search_title) {
    try {
      const insertData = new FormData();

      var header = {
        Accept: 'application/json, text/plain, */*',
        'x-access-token': token,
      };

      insertData.append('customer_id', user_id);
      insertData.append('search_title', search_title);

      console.log('header ');
      console.log(header);

      console.log('Ads List Info:');
      console.log(url);
      console.log(' Ads List Data:');
      console.log(insertData);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('Ads List Service Response:');
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

export default new MyAdsList();
