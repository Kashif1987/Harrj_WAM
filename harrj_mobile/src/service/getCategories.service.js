import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class getCategoriesService {
  getCategories(token) {
    try {
      const url = BASE_URL + '/admin/category/list';

      var header = {'x-access-token': token};

      // console.log("header ");
      // console.log(header);

      // console.log("url ");
      // console.log(url);

      return axios.get(url, {headers: header}).then(response => {
        // console.log("service getCategoriesSubCategories response:");
        // console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log("service getCategoriesSubCategories error:");
      console.log(error);

      return error;
    }
  }

  getCategoriesSubCategories(token) {
    try {
      // const url = BASE_URL+"/admin/category/cat_sub_cat_list";
      const url = BASE_URL + '/admin/category/list';

      var header = {'x-access-token': token};

      // console.log("header ");
      // console.log(header);

      // console.log("url ");
      // console.log(url);

      return axios.get(url, {headers: header}).then(response => {
        // console.log("service getCategoriesSubCategories response:");
        // console.log(response);

        return response.data;
      });
    } catch (error) {
      // console.log("service getCategoriesSubCategories error:");
      // console.log(error);

      return error;
    }
  }
}

export default new getCategoriesService();
