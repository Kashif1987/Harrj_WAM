import update_adsService from '../service/update_ads.service';

export const updateNormalAd =
  (
    // token, product_id, title, description, keywords, category_id, sub_category_id,  video, product_img1, product_img2, product_img3, brand_id, model_id, city_id, country_id, year_id
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
  ) =>
  dispatch => {
    return update_adsService
      .updateNormalAd(
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
      )
      .then(
        response => {
          dispatch({
            type: 'PRODUCT_UPDATE_SUCCESS',
            payload: [],
          });

          return Promise.resolve(response);
        },
        error => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          dispatch({
            type: 'PRODUCT_UPDATE_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        },
      );
  };

// Update Schedule Ads

export const updateScheduleLiveAd =
  (
    token,
    customer_id,
    product_id,
    title,
    // name,
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
  ) =>
  dispatch => {
    return update_adsService
      .updateScheduleLive(
        token,
        customer_id,
        product_id,
        title,
        // name,
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
      )
      .then(
        response => {
          dispatch({
            type: 'Update_Schedule_ADD_SUCCESS',
            payload: [],
          });

          return Promise.resolve(response);
        },
        error => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          dispatch({
            type: 'Update_Schedule_ADD_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        },
      );
  };

// Update Schedule Ads

export const updateGoliveNowAd =
  (
    token,
    customer_id,
    product_id,
    title,
    description,
    keywords,
    city_id,
    country_id,
  ) =>
  dispatch => {
    return update_adsService
      .updateLiveNow(
        token,
        customer_id,
        product_id,
        title,
        description,
        keywords,
        city_id,
        country_id,
      )
      .then(
        response => {
          dispatch({
            type: 'Update_GOLIVENOW_ADD_SUCCESS',
            payload: [],
          });

          return Promise.resolve(response);
        },
        error => {
          const message =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          dispatch({
            type: 'Update_GOLIVENOW_ADD_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        },
      );
  };
