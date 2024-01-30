import bidListService from "../../service/bidList.service";


export const bidListAction = (token, product_id) => (dispatch) => {
    return bidListService.bidListService(token, product_id).then(
        (response) => {
            dispatch({
                type: "bidList_SUCCESS",
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
                type: "bidList_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};