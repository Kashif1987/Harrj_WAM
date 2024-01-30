import getCommentService from "../service/getCommentService";


export const getCommentAction = (product_id, page_records) => (dispatch) => {
    return getCommentService.getCommentService(product_id, page_records).then(
        (response) => {
            dispatch({
                type: "Comment_SUCCESS",
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
                type: "Comment_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};
