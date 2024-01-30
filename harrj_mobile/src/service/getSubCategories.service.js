import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class getSubCategoriesService {
  getSubCategories(token) {
    try {
      const url = BASE_URL + '/admin/sub_category/list';

      var header = {'x-access-token': token};

      return axios.get(url, {headers: header}).then(response => {
        return response.data;
      });
    } catch (error) {
      return error;
    }
  }
}

export default new getSubCategoriesService();
