import addCommentService from '../service/addCommentService';

export const addCommentAction =
  (product_id, comment, user_id, insertId) => (dispatch) => {
    return addCommentService
      .addCommentService(product_id, comment, user_id, insertId)
      .then(
        (response) => {
          dispatch({
            type: 'Comment_SUCCESS',
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
            type: 'Comment_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        }
      );
  };
