import forgotPassword from "../service/forgotPassword.service";

export const forgotPasswordService = (user_id) => (dispatch) => {
    return forgotPassword.forgotPasswordService(user_id).then(
        (response) => {
            dispatch({
                type: "forgotPassword_SUCCESS",
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
                type: "forgotPassword_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};

// Check OTP

export const checkOTPService = (email_id, otp) => (dispatch) => {
    return forgotPassword.checkOTPService(email_id, otp).then(
        (response) => {
            dispatch({
                type: "checkOTPService_SUCCESS",
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
                type: "checkOTPService_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};

// update Password

export const updatePasswordService = (email_id, password) => (dispatch) => {
    return forgotPassword.updatePasswordService(email_id, password).then(
        (response) => {
            dispatch({
                type: "updatePasswordService_SUCCESS",
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
                type: "updatePasswordService_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};