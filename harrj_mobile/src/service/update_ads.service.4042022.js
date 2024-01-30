import axios from 'axios';
const BASE_URL = 'http://185.185.83.220:3021';

class updateAdsService {
  // Add Normal Ads

  updateNormalAd(
    token,
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
  ) {
    try {
      // const url = BASE_URL + "/api/product/update";
      const url = 'http://185.185.83.220:3021/api/product/update';
      const insertData = new FormData();

      var header = {'x-access-token': token};

      insertData.append('product_id', product_id);
      insertData.append('title', title);
      insertData.append('name', 'name');
      insertData.append('description', description);
      insertData.append('keywords', keywords);
      insertData.append('category_id', category_id);
      insertData.append('sub_category_id', sub_category_id);
      insertData.append('auction_type', 'offline');
      insertData.append('start_date_time', '2022-03-16');
      insertData.append('end_date_time', '');
      insertData.append('starting_price', starting_price);
      // insertData.append('starting_price', 565);
      insertData.append('refund', 'no');
      insertData.append('refund_days', '0');
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
    product_id,
    title,
    description,
    name,
    keywords,
    category_id,
    sub_category_id,
    starting_price,
    video,
    product_img,
    auction_type,
    start_date_time,
    end_date_time,
    brand_id,
    model_id,
    city_id,
    country_id,
    refund,
    refund_days,
    zoom_link,
    year_id,
  ) {
    try {
      const url = BASE_URL + '/api/product/update';
      const insertData = new FormData();

      var header = {'x-access-token': token};

      insertData.append('title', product_id);
      insertData.append('title', title);
      insertData.append('name', name);
      insertData.append('description', description);
      insertData.append('keywords', keywords);
      insertData.append('category_id', category_id);
      insertData.append('sub_category_id', sub_category_id);
      insertData.append('auction_type', 'online');
      insertData.append('start_date_time', start_date_time);
      insertData.append('end_date_time', end_date_time);
      insertData.append('starting_price', starting_price);
      insertData.append('refund', 'no');
      insertData.append('refund_days', '');
      insertData.append('video', video);
      insertData.append('product_img', product_img);
      insertData.append('brand_id', brand_id);
      insertData.append('model_id', model_id);
      insertData.append('city_id', city_id);
      insertData.append('country_id', country_id);
      insertData.append('year_id', year_id);

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
    product_id,
    title,
    description,
    keywords,
    auction_type,
    city_id,
    country_id,
    zoom_link,
  ) {
    try {
      const url = BASE_URL + '/api/product/update';
      const insertData = new FormData();

      var header = {'x-access-token': token};

      // insertData.append('customer_id', customer_id);
      insertData.append('product_id', product_id);
      insertData.append('title', title);
      insertData.append('description', description);
      insertData.append('keywords', keywords);
      insertData.append('auction_type', 'online');
      insertData.append('city_id', city_id);
      insertData.append('country_id', country_id);

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
