import getCityService from "../service/getCity.service";



export const getCityAction = (token) => (dispatch) => {
    return getCityService.getCityService(token).then(
        (response) => {
            dispatch({
                type: "CITY_SUCCESS",
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
                type: "CITY_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};
