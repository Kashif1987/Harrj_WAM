import deleteAdsService from "../service/deleteAds.service";

export const deleteAdAction = (token, product_id) => (dispatch) => {
    return deleteAdsService.deleteAdsService(token, product_id).then(
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