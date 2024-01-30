import getMyBiderProductService from "../service/getMyBiderProduct.service";

export const getMyBiderProductList = (token, user_id, title) => (dispatch) => {
    return getMyBiderProductService.getMyBiderProductList(token, user_id, title).then(
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