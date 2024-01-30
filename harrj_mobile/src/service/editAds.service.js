import axios from 'axios';
import {Base_Url} from './../../config';
const BASE_URL = Base_Url;

class editAds {
  // Edit Ads

  editAdsService(
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
    customer_id,
    brand_id,
    model_id,
    city_id,
    country_id,
    refund,
    refund_days,
    zoom_link,
  ) {
    try {
      const url = BASE_URL + '/api/product/add';
      const insertData = new FormData();

      insertData.append('customer_id', customer_id);
      insertData.append('title', title);
      insertData.append('name', name);
      insertData.append('description', description);
      insertData.append('keywords', keywords);
      insertData.append('category_id', category_id);
      insertData.append('sub_category_id', sub_category_id);
      insertData.append('auction_type', 'offline');
      insertData.append('start_date_time', '');
      insertData.append('end_date_time', '');
      insertData.append('starting_price', starting_price);
      insertData.append('refund', 'no');
      insertData.append('refund_days', '');
      insertData.append('video', video);
      insertData.append('product_img', product_img);
      insertData.append('brand_id', brand_id);
      insertData.append('model_id', model_id);
      insertData.append('city_id', city_id);
      insertData.append('country_id', country_id);

      console.log('insertData ');
      console.log(insertData);

      console.log('url ');
      console.log(url);

      return axios.post(url, insertData).then(response => {
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

export default new editAds();
