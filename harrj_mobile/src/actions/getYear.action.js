import getYearService from "../service/getYear.service";

export const getYearAction = (token) => (dispatch) => {
    return getYearService.getYearService(token).then(
        (response) => {
            dispatch({
                type: "Year_SUCCESS",
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
                type: "Year_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};
