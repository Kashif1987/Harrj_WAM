import contactUsService from "../service/contactUs.service";

export const contactUs = (name, email_id, mobile_no, message) => (dispatch) => {
    return contactUsService.contactUs(name, email_id, mobile_no, message).then(
        (response) => {
            dispatch({
                type: "contactUs_SUCCESS",
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
                type: "contactUs_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};