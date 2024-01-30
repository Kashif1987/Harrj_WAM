import bid_update_statusService from "../service/bid_update_status.service";


export const updateBidStatusAction = (token, customer_id, bid_id, bid_status) => (dispatch) => {
    return bid_update_statusService.updateBidStatusService(token, customer_id, bid_id, bid_status).then(
        (response) => {
            dispatch({
                type: "UPDATE_SUCCESS",
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
                type: "UPDATE_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};