import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class addComment {
  addCommentService(product_id, comment, user_id, insertId) {
    try {
      const url = BASE_URL + '/api/comment/add';

      const insertData = new FormData();

      insertData.append('product_id', product_id);
      insertData.append('comment', comment);
      insertData.append('user_id', user_id);
      insertData.append('bid_id', insertId);

      console.log('Add Comment Info:');
      console.log(url);

      console.log('Add Comment Data:');
      console.log(insertData);

      return axios.post(url, insertData).then(response => {
        console.log('Add Comment Service Response:');
        console.log(response.data);
        return response.data;
      });
    } catch (error) {
      console.log('Get Comment Service Info Error:');
      console.log(error);

      return error;
    }
  }
}

export default new addComment();
