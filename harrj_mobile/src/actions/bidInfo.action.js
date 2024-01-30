import bid_infoService from "../service/bid_info.service";


export const bidInfoAction = (token,bid_id) => (dispatch) => {
    return bid_infoService.bidInfoService(token,bid_id).then(
        (response) => {
            dispatch({
                type: "bidListByBidder_SUCCESS",
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
                type: "bidListByBidder_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};