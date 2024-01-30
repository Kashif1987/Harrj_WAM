import axios from 'axios';
import moment from 'moment';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class addAdsService {
  // Add Normal Ads

  addNormalAd(
    token,
    customer_id,
    title,
    description,
    keywords,
    category_id,
    sub_category_id,
    starting_price,
    video,
    product_img1,
    product_img2,
    product_img3,
    brand_id,
    model_id,
    city_id,
    country_id,
    year_id,
    max_price,
  ) {
    try {
      const url = BASE_URL + '/api/product/add';
      const insertData = new FormData();

      var header = {'x-access-token': token};

      insertData.append('customer_id', customer_id);
      insertData.append('title', title);
      insertData.append('name', 'abcd');
      insertData.append('description', description);
      insertData.append('keywords', keywords);
      insertData.append('category_id', category_id);
      insertData.append('sub_category_id', sub_category_id);
      insertData.append('starting_price', starting_price);
      insertData.append('video', video);
      insertData.append('product_img', product_img1);
      if (
        product_img2 &&
        typeof product_img2 !== 'undefined' &&
        product_img2 !== ''
      ) {
        insertData.append('product_img', product_img2);
      }
      if (
        product_img3 &&
        typeof product_img3 !== 'undefined' &&
        product_img3 !== ''
      ) {
        insertData.append('product_img', product_img3);
      }
      insertData.append('brand_id', brand_id);
      insertData.append('model_id', model_id);
      insertData.append('city_id', city_id);
      insertData.append('country_id', country_id);
      insertData.append('auction_type', 'offline');
      insertData.append('year_id', year_id);
      insertData.append('max_price', max_price);
      insertData.append(
        'start_date_time',
        moment().utc().format('YYYY-MM-DD hh:mm:ss'),
      );
      insertData.append('end_date_time', '');
      insertData.append('refund', 'no');
      insertData.append('refund_days', '');

      return axios.post(url, insertData, {headers: header}).then(response => {
        return response.data;
      });
    } catch (error) {
      return error;
    }
  }

  // Add Schedule Ads

  addScheduleLive(
    token,
    customer_id,
    title,
    name,
    description,
    keywords,
    category_id,
    sub_category_id,
    starting_price,
    video,
    product_img1,
    product_img2,
    product_img3,
    start_date_time,
    end_date_time,
    brand_id,
    model_id,
    city_id,
    country_id,
    start_time,
    end_time,
    year_id,
  ) {
    try {
      const url = BASE_URL + '/api/product/golive';
      const insertData = new FormData();
      var header = {'x-access-token': token};

      insertData.append('customer_id', customer_id);
      insertData.append('title', title);
      insertData.append('name', name);
      insertData.append('description', description);
      insertData.append('keywords', keywords);
      insertData.append('category_id', category_id);
      insertData.append('sub_category_id', sub_category_id);
      insertData.append('starting_price', starting_price);
      insertData.append('video', video);
      insertData.append('product_img', product_img1);
      if (
        product_img2 &&
        typeof product_img2 !== 'undefined' &&
        product_img2 !== ''
      ) {
        insertData.append('product_img', product_img2);
      }
      if (
        product_img3 &&
        typeof product_img3 !== 'undefined' &&
        product_img3 !== ''
      ) {
        insertData.append('product_img', product_img3);
      }

      insertData.append('brand_id', brand_id);
      insertData.append('model_id', model_id);
      insertData.append('city_id', city_id);
      insertData.append('country_id', country_id);
      insertData.append('year_id', year_id);

      start_time = moment(start_time).utc().format('HH:mm:ss');
      console.log('end_time b');
      console.log(end_time);
      end_time = moment(end_time).utc().add(2, 'h').format('HH:mm:ss');

      insertData.append('start_time', start_time);
      insertData.append('end_time', end_time);

      var start_date_time_temp = start_date_time.split(' ');
      start_date_time_temp = start_date_time_temp[0] + ' ' + start_time;

      var end_date_time_temp = start_date_time.split(' ');
      end_date_time_temp = end_date_time_temp[0] + ' ' + end_time;

      insertData.append('start_date_time', start_date_time_temp);
      insertData.append('end_date_time', end_date_time_temp);

      insertData.append('refund', 'no');
      insertData.append('refund_days', '');
      insertData.append('auction_type', 'online');

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('addScheduleLive service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('addScheduleLive service error:');
      console.log(error);

      return error;
    }
  }

  // Add Live Ads

  addLiveNow(token, customer_id, title, description, city_id, country_id) {
    try {
      const url = BASE_URL + '/api/product/golive';
      const insertData = new FormData();

      var header = {'x-access-token': token};

      insertData.append('customer_id', customer_id);
      insertData.append('title', title);
      insertData.append('description', description);
      insertData.append('city_id', city_id);
      insertData.append('country_id', country_id);
      insertData.append('auction_type', 'golivenow');

      var start_date_time = moment(new Date())
        .utc()
        .format('YYYY-MM-DD HH:mm:ss');
      var end_date_time = moment(new Date())
        .utc()
        .add(2, 'h')
        .format('YYYY-MM-DD HH:mm:ss');

      insertData.append('start_date_time', start_date_time);
      insertData.append('end_date_time', end_date_time);

      var start_time = moment(new Date()).utc().format('HH:mm:ss');
      var end_time = moment(new Date()).utc().add(2, 'h').format('HH:mm:ss');

      insertData.append('start_time', start_time);

      insertData.append('end_time', end_time);

      console.log('insertData ');
      console.log(insertData);

      console.log('url ');
      console.log(url);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('addLiveNow service response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('addLiveNow service error:');
      console.log(error);

      return error;
    }
  }
}

export default new addAdsService();
