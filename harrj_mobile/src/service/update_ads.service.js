import axios from 'axios';
import moment from 'moment';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class updateAdsService {
  // Add Normal Ads

  updateNormalAd(
    token,
    customer_id,
    product_id,
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
    auction_type,
  ) {
    try {
      const url = BASE_URL + '/api/product/update';
      const insertData = new FormData();

      var header = {'x-access-token': token};

      insertData.append('customer_id', customer_id);
      insertData.append('product_id', product_id);
      insertData.append('title', title);
      insertData.append('name', 'name');
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
      insertData.append(
        'start_date_time',
        moment().utc().format('YYYY-MM-DD hh:mm:ss'),
      );
      insertData.append('brand_id', brand_id);
      insertData.append('model_id', model_id);
      insertData.append('city_id', city_id);
      insertData.append('country_id', country_id);
      insertData.append('year_id', year_id);
      insertData.append('auction_type', 'offline');
      insertData.append('refund', 'no');
      insertData.append('refund_days', '');

      console.log('insertData updateNormalAd ');
      console.log(insertData);

      console.log('url ');
      console.log(url);

      console.log('header ');
      console.log(header);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('service updateNormalAd response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('service updateNormalAd error:');
      console.log(error);

      return error;
    }
  }

  // Add Schedule Ads

  updateScheduleLive(
    token,
    customer_id,
    product_id,
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
      const url = BASE_URL + '/api/product/add';
      const insertData = new FormData();
      var header = {'x-access-token': token};

      insertData.append('customer_id', customer_id);
      insertData.append('product_id', product_id);
      insertData.append('title', title);
      insertData.append('name', 'name');
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
      start_time = moment(start_time).utc().format('HH:mm:ss');
      end_time = moment(end_time).utc().add(2, 'h').format('HH:mm:ss');

      insertData.append('start_time', start_time);
      insertData.append('end_time', end_time);

      var start_date_time_temp = start_date_time.split(' ');
      start_date_time_temp = start_date_time_temp[0] + ' ' + start_time;

      var end_date_time_temp = start_date_time.split(' ');
      end_date_time_temp = end_date_time_temp[0] + ' ' + end_time;

      insertData.append('start_date_time', start_date_time_temp);
      insertData.append('end_date_time', end_date_time_temp);

      insertData.append('year_id', year_id);
      insertData.append('refund', 'no');
      insertData.append('refund_days', '');
      insertData.append('auction_type', 'online');

      console.log('insertData ');
      console.log(insertData);

      console.log('url ');
      console.log(url);

      console.log('header ');
      console.log(header);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('service updateScheduleLive response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('service updateScheduleLive error:');
      console.log(error);

      return error;
    }
  }

  // Add Live Ads

  updateLiveNow(
    token,
    customer_id,
    product_id,
    title,
    description,
    keywords,
    city_id,
    country_id,
  ) {
    try {
      const url = BASE_URL + '/api/product/update';
      const insertData = new FormData();

      var header = {'x-access-token': token};

      insertData.append('customer_id', customer_id);
      insertData.append('product_id', product_id);
      insertData.append('title', title);
      insertData.append('description', description);
      insertData.append('city_id', city_id);
      insertData.append('country_id', country_id);
      insertData.append('auction_type', 'golivenow');

      var current_date_time_utc = new Date()
        .toTimeString()
        .replace('GMT+0530', ' ')
        .substring(0, 19);

      var start_date_time = new Date()
        .toISOString()
        .replace('T', ' ')
        .substring(0, 19);

      var End_Date_Time = start_date_time.split(' ');

      var End_Date_Time_temp_one = End_Date_Time[1].split(':');

      var End_Date_Time_temp =
        Number(End_Date_Time_temp_one[0]) +
        2 +
        ':' +
        End_Date_Time_temp_one[1] +
        ':' +
        End_Date_Time_temp_one[2];

      var start_date_time_Temp_one = End_Date_Time[0];

      var start_date_time_Temp_two =
        start_date_time_Temp_one + ' ' + current_date_time_utc;

      var current_date_time_utc_split = current_date_time_utc.split(':');

      var endtime_temp_one =
        Number(current_date_time_utc_split[0]) +
        2 +
        ':' +
        current_date_time_utc_split[1] +
        ':' +
        current_date_time_utc_split[2];

      var end_date_time_str = End_Date_Time[0] + ' ' + endtime_temp_one;

      insertData.append('start_date_time', start_date_time_Temp_two);
      insertData.append('end_date_time', end_date_time_str);

      var start_time = new Date()
        .toTimeString()
        .replace('GMT+0530', ' ')
        .substring(0, 19);
      start_time = start_time.replace('(IST)', '');
      start_time = start_time.trim();

      insertData.append('start_time', start_time);

      var endtime = start_time.split(':');
      var endtime_temp =
        Number(endtime[0]) + 2 + ':' + endtime[1] + ':' + endtime[2];

      EndDate = endtime_temp;
      insertData.append('end_time', endtime_temp);

      console.log('insertData ');
      console.log(insertData);

      console.log('url ');
      console.log(url);

      console.log('header ');
      console.log(header);

      return axios.post(url, insertData, {headers: header}).then(response => {
        console.log('service updateLiveNow response:');
        console.log(response);

        return response.data;
      });
    } catch (error) {
      console.log('service updateLiveNow error:');
      console.log(error);

      return error;
    }
  }
}

export default new updateAdsService();
