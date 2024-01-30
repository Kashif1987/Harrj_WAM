import axios from 'axios';

import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class getBrandServices {
  getBrands(token) {
    try {
      const url = BASE_URL + '/admin/brand/list';

      var header = {'x-access-token': token};

      console.log('header ');
      console.log(header);

      console.log('url ');
      console.log(url);

      return axios.get(url).then(response => {
        // console.log("Brands service response:");
        // console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('Brands service error:');
      console.log(error);

      return error;
    }
  }
}

export default new getBrandServices();
