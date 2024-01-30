import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class UpdateMeetingService {
  UpdateMeetingStatus(product_id, meeting_status) {
    try {
      const url = BASE_URL + '/api/product/update_meeting_status';

      const insertData = new FormData();

      insertData.append('product_id', product_id);
      insertData.append('meeting_status', meeting_status);

      return axios.post(url, insertData).then(response => {
        console.log('Update Meeting Status Service Response:');
        console.log(response.data);
        return response.data;
      });
    } catch (error) {
      console.log('Update Meeting Status Service Info Error:');
      console.log(error);

      return error;
    }
  }
}

export default new UpdateMeetingService();
