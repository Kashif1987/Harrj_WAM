import getProductInfoService from "../service/getProductInfo.service";

export const getProductInfo = (token,product_id) => (dispatch) => {
    return getProductInfoService.getProductinfoService(token,product_id).then(
        (response) => {
            dispatch({
                type: "SUCCESS",
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
                type: "FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};