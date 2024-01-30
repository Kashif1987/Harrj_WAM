import addBidService from "../service/addBid.service";


export const addBidAction = (token, bidder_id, product_id, bid_amount, customer_id) => (dispatch) => {
    return addBidService.addBidService(token, bidder_id, product_id, bid_amount, customer_id).then(
        (response) => {
            dispatch({
                type: "ADD_SUCCESS",
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
                type: "ADD_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};