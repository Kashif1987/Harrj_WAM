import getBidlist_by_productIdService from "../service/getBidlist_by_productId.service";


export const bidList_by_ProductIdService = (token, product_id) => (dispatch) => {
    return getBidlist_by_productIdService.bidList_by_ProductIdService(token, product_id).then(
        (response) => {
            dispatch({
                type: "bidList_by_ProductId_SUCCESS",
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
                type: "bidList_by_ProductId_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};