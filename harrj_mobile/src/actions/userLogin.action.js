import userLoginService from '../service/userLogin.service';

export const userLogin = (email_id, password, firebase_token) => dispatch => {
  return userLoginService.userLogin(email_id, password, firebase_token).then(
    response => {
      dispatch({
        type: 'USER_LOGIN_SUCCESS',
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
        type: 'USER_LOGIN_FAIL',
        payload: [],
      });

      return Promise.reject(error);
    },
  );
};
