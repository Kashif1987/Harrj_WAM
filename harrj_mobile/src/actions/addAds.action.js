import addAdsService from '../service/addAds.service';

export const addNormalAd =
  (
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
    max_price
  ) =>
  (dispatch) => {
    return addAdsService
      .addNormalAd(
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
        max_price
      )
      .then(
        (response) => {
          dispatch({
            type: 'NORMAL_PRODUCT_ADD_SUCCESS',
            payload: [],
          });

          return Promise.resolve(response);
        },
        (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          dispatch({
            type: 'NORMAL_PRODUCT_ADD_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        }
      );
  };

// Create Schedule Ads

export const addScheduleAd =
  (
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
    year_id
  ) =>
  (dispatch) => {
    return addAdsService
      .addScheduleLive(
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
        year_id
      )
      .then(
        (response) => {
          dispatch({
            type: 'Schedule_ADD_SUCCESS',
            payload: [],
          });

          return Promise.resolve(response);
        },
        (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          dispatch({
            type: 'Schedule_ADD_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        }
      );
  };

// Create Live Ads

export const addLiveNowAd =
  (token, customer_id, title, description, city_id, country_id) =>
  (dispatch) => {
    return addAdsService
      .addLiveNow(token, customer_id, title, description, city_id, country_id)
      .then(
        (response) => {
          dispatch({
            type: 'Live_ADD_SUCCESS',
            payload: [],
          });

          return Promise.resolve(response);
        },
        (error) => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          dispatch({
            type: 'Live_ADD_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        }
      );
  };
