import bidListForAdOwnerService from "../service/bidListForAdOwner.service";


export const bidListForAdOwnerAction = (token,customer_id) => (dispatch) => {
    return bidListForAdOwnerService.bidListForAdOwnerService(token,customer_id).then(
        (response) => {
            dispatch({
                type: "bidListForAdOwner_SUCCESS",
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
                type: "bidListForAdOwner_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};