import userRegisterService from "../service/userRegister.service";

export const userRegister = (name, mobile_no, email_id, password) => (dispatch) => {
  return userRegisterService.userRegister(name, mobile_no, email_id, password).then(
    (response) => {
      dispatch({
          type: "USER_REGISTER_SUCCESS",
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
        type: "USER_REGISTER_FAIL",
        payload: []
      });
      
      return Promise.reject(error);
    }
  );
};