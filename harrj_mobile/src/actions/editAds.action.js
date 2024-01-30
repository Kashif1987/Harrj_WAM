import editAdsService from "../service/editAds.service";


export const editAds = (product_id) => (dispatch) => {
    return editAdsService.editAdsService(product_id).then(
        (response) => {
            dispatch({
                type: "EDIT_SUCCESS",
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
                type: "EDIT_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};