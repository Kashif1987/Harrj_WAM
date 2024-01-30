import getAdBannerService from "../../service/getAdBanners.service";

export const getAdBanners = (token) => (dispatch) => {
  return getAdBannerService.getAdBanners(token).then(
    (response) => {
      dispatch({
          type: "Ad_BANNER_SUCCESS",
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
        type: "Ad_BANNER_FAIL",
        payload: []
      });
      
      return Promise.reject(error);
    }
  );
};
