import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class getComment {
  getCommentService(product_id, page_records) {
    try {
      const url =
        BASE_URL +
        '/api/comment/list?' +
        'product_id=' +
        product_id +
        '&page_records=' +
        page_records;

      console.log(url);

      return axios.get(url).then(response => {
        console.log('getComment service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('getComment service error:');
      console.log(error);

      return error;
    }
  }
}

export default new getComment();
