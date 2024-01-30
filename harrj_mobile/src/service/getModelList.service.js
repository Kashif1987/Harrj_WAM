import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class getModelService {
  getModel(token) {
    try {
      const url = BASE_URL + '/admin/model/list';

      var header = {'x-access-token': token};

      return axios.get(url, {headers: header}).then(response => {
        return response.data;
      });
    } catch (error) {
      return error;
    }
  }
}

export default new getModelService();
