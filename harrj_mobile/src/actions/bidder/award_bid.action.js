import award_bidService from "../../service/award_bid.service";


export const award_bidAction = (token, customer_id, bid_id, product_id) => (dispatch) => {
    return award_bidService.award_bidService(token, customer_id, bid_id, product_id).then(
        (response) => {
            dispatch({
                type: "award_bid_SUCCESS",
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
                type: "award_bid_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};