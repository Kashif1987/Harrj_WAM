import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class getProductListService {
  getProductsList(
    token,
    customer_id,
    title,
    auction_type,
    category_id,
    sub_category_id,
    brand_id,
    model_id,
    max_price_filter,
    last_id,
    page_records,
  ) {
    try {
      const url = BASE_URL + '/api/product/list';
      var sub_url =
        '?page_records=' +
        page_records +
        '&last_id=' +
        last_id +
        '&customer_id=' +
        customer_id +
        '&title=' +
        title +
        '&max_price_filter=' +
        max_price_filter;

      if (auction_type && typeof auction_type !== 'undefined') {
        if (auction_type === 'online') {
          auction_type = 'golivenow,online';
        } else {
          auction_type = 'offline';
        }
        sub_url = sub_url + '&auction_type=' + auction_type;
      }

      if (
        category_id &&
        typeof category_id !== 'undefined' &&
        category_id.length > 0
      ) {
        sub_url = sub_url + '&category_id=' + category_id.toString();
      }

      if (
        sub_category_id &&
        typeof sub_category_id !== 'undefined' &&
        sub_category_id.length > 0
      ) {
        sub_url = sub_url + '&sub_category_id=' + sub_category_id.toString();
      }

      if (brand_id && typeof brand_id !== 'undefined' && brand_id.length > 0) {
        sub_url = sub_url + '&brand_id=' + brand_id.toString();
      }

      if (model_id && typeof model_id !== 'undefined' && model_id.length > 0) {
        sub_url = sub_url + '&model_id=' + model_id.toString();
      }

      var url_final = url + '' + sub_url;

      var header = {'x-access-token': token};

      console.log('getProductsList url_final');
      console.log(url_final);
      console.warn(url_final);

      console.log('header ');
      console.log(header);

      return axios.get(url_final, {headers: header}).then(response => {
        console.log('service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('service error:');
      console.log(error);

      return error;
    }
  }

  getLiveProductsList(
    token,
    customer_id,
    title,
    category_id,
    sub_category_id,
    brand_id,
    model_id,
    max_price_filter,
  ) {
    try {
      const url = BASE_URL + '/api/product/listbyorder';
      var sub_url =
        '?customer_id=' +
        customer_id +
        '&title=' +
        title +
        '&max_price_filter=' +
        max_price_filter;

      if (
        category_id &&
        typeof category_id !== 'undefined' &&
        category_id.length > 0
      ) {
        sub_url = sub_url + '&category_id=' + category_id.toString();
      }

      if (
        sub_category_id &&
        typeof sub_category_id !== 'undefined' &&
        sub_category_id.length > 0
      ) {
        sub_url = sub_url + '&sub_category_id=' + sub_category_id.toString();
      }

      if (brand_id && typeof brand_id !== 'undefined' && brand_id.length > 0) {
        sub_url = sub_url + '&brand_id=' + brand_id.toString();
      }

      if (model_id && typeof model_id !== 'undefined' && model_id.length > 0) {
        sub_url = sub_url + '&model_id=' + model_id.toString();
      }

      var url_final = url + '' + sub_url;

      var header = {'x-access-token': token};

      console.log('getProductsList url_final');
      console.log(url_final);

      console.log('header ');
      console.log(header);

      return axios.get(url_final, {headers: header}).then(response => {
        console.log('service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('service error:');
      console.log(error);

      return error;
    }
  }
}

export default new getProductListService();
