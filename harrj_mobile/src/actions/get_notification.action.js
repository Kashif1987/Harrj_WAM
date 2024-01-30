import getNotification from "../service/get_notification.service";



export const getNotificationService = () => (dispatch) => {
    return getNotification.getNotificationService().then(
        (response) => {
            dispatch({
                type: "getNotification_SUCCESS",
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
                type: "getNotification_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};
