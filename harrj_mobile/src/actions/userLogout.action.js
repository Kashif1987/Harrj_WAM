import userLogoutService from "../service/userLogout.service";

export const userLogout = (token) => (dispatch) => {
  return userLogoutService.userLogout(token).then(
    (response) => {
      dispatch({
          type: "USER_LOGOUT_SUCCESS",
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
        type: "USER_LOGOUT_FAIL",
        payload: []
      });
      
      return Promise.reject(error);
    }
  );
};