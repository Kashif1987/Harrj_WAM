import getProductListService from '../service/getProductList.service';

export const getProductListAction =
  (
    token,
    customer_id,
    title,
    auction_type,
    category_id,
    sub_category_id,
    brand_id,
    model_id,
    starting_price,
    page_records,
    last_id
  ) =>
  (dispatch) => {
    return getProductListService
      .getProductsList(
        token,
        customer_id,
        title,
        auction_type,
        category_id,
        sub_category_id,
        brand_id,
        model_id,
        starting_price,
        page_records,
        last_id
      )
      .then(
        (response) => {
          dispatch({
            type: 'PRODUCT_SUCCESS',
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
            type: 'PRODUCT_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        }
      );
  };

export const getLiveProductListAction =
  (
    token,
    customer_id,
    title,
    auction_type,
    category_id,
    sub_category_id,
    brand_id,
    model_id,
    starting_price
  ) =>
  (dispatch) => {
    return getProductListService
      .getLiveProductsList(
        token,
        customer_id,
        title,
        auction_type,
        category_id,
        sub_category_id,
        brand_id,
        model_id,
        starting_price
      )
      .then(
        (response) => {
          dispatch({
            type: 'LIVE_PRODUCT_SUCCESS',
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
            type: 'LIVE_PRODUCT_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        }
      );
  };
