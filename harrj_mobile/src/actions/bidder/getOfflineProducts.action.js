import getOfflineProductsService from "../../service/getOfflineProducts.service";


export const getOfflineProductAction = (token) => (dispatch) => {
    return getOfflineProductsService.getOfflineProducts(token).then(
        (response) => {
            dispatch({
                type: "CATEGORY_SUCCESS",
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
                type: "CATEGORY_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};

