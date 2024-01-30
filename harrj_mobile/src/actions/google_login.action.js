import google_loginService from "../service/google_login.service";

export const googleLoginService = (user_id) => (dispatch) => {
    return google_loginService.googleLogin(user_id).then(
        (response) => {
            dispatch({
                type: "googleLoginService_SUCCESS",
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
                type: "googleLoginService_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};