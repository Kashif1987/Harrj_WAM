import bidListbyBidderService1 from "../service/bidListbyBidder.service";


export const bidListByBidderService = (token,bidder_id) => (dispatch) => {
    return bidListbyBidderService1.bidListByBidderService(token,bidder_id).then(
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