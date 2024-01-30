import getModelListService from "../service/getModelList.service";

export const getModelAction = (token) => (dispatch) => {
    return getModelListService.getModel(token).then(
        (response) => {
            dispatch({
                type: "Model_SUCCESS",
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
            console.log('error')

            dispatch({
                type: "Model_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};
