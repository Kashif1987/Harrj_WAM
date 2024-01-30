import userProfileService from '../service/userProfile.service';

export const userProfile = token => dispatch => {
  return userProfileService.userProfile(token).then(
    response => {
      dispatch({
        type: 'USER_PROFILE_SUCCESS',
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
        type: 'USER_PROFILE_FAIL',
        payload: [],
      });

      return Promise.reject(error);
    },
  );
};

export const userUpdateAction =
  (token, id, name, email_id, mobile_no) => dispatch => {
    return userProfileService
      .updateProfile(token, id, name, email_id, mobile_no)
      .then(
        response => {
          dispatch({
            type: 'UPDATE_PROFILE_SUCCESS',
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
            type: 'UPDATE_PROFILE_FAIL',
            payload: [],
          });

          return Promise.reject(error);
        },
      );
  };
