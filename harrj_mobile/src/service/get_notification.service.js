import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class getNotification {
  getNotificationService() {
    try {
      const url = BASE_URL + '/api/notify/notify_liveads';

      console.log('url: ');
      console.log(url);

      return axios.get(url).then(response => {
        console.log('getNotification service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('getNotification service error:');
      console.log(error);

      return error;
    }
  }
}

export default new getNotification();
