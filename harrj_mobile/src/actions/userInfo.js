import getUserInfo from "../service/getUserInfo";

export const userInfoAction = (email_id, token) => (dispatch) => {

  return getUserInfo.userInfo(email_id,token).then( 
    (response) => {
      dispatch({
          type: "USER_INFO_SUCCESS",
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
        type: "USER_INFO_FAIL",
        payload: []
      });
      
      return Promise.reject(error);
    }
  );
};