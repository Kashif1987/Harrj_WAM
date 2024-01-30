import getSubCategoriesService from "../service/getSubCategories.service";

export const getSubCategories = (token) => (dispatch) => {
  return getSubCategoriesService.getSubCategories(token).then(
    (response) => {
      dispatch({
          type: "SUB_CATEGORY_SUCCESS",
          payload: []
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
        console.log('error')

      dispatch({
        type: "SUB_CATEGORY_FAIL",
        payload: []
      });
      
      return Promise.reject(error);
    }
  );
};
