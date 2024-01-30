import getCategoriesService from "../../service/getCategories.service";

export const getCategories = (token) => (dispatch) => {
  return getCategoriesService.getCategories(token).then(
    (response) => {
      dispatch({
        type: "CATEGORY_SUCCESS",
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

      dispatch({
        type: "CATEGORY_FAIL",
        payload: []
      });

      return Promise.reject(error);
    }
  );
};

export const getCategoriesSubCategories = (token) => (dispatch) => {
  return getCategoriesService.getCategoriesSubCategories(token).then(
    (response) => {
      dispatch({
        type: "CATEGORY_SUCCESS",
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

      dispatch({
        type: "CATEGORY_FAIL",
        payload: []
      });

      return Promise.reject(error);
    }
  );
};