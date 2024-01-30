import getOnlineProductsService from "../../service/getOnlineProducts.Service";


export const getOnlineProductAction = (token) => (dispatch) => {
    return getOnlineProductsService.getOnlineProducts(token).then(
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
