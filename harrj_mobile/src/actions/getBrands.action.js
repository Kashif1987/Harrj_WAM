import getBrandsService from "../service/getBrands.Service";

export const getBrands = (token) => (dispatch) => {
    return getBrandsService.getBrands(token).then(
        (response) => {
            dispatch({
                type: "BRAND_SUCCESS",
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
                type: "BRAND_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};