import deleteBidsService from "../service/deleteBids.service";

export const deleteBidsAction = (token, bidder_id, bid_id) => (dispatch) => {
    return deleteBidsService.deleteBidsService(token, bidder_id, bid_id).then(
        (response) => {
            dispatch({
                type: "DELETE_SUCCESS",
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
                type: "DELETE_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};