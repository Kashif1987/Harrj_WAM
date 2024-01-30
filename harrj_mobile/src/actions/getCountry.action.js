import getCountryService from "../service/getCountry.service";


export const getCountryAction = (token) => (dispatch) => {
    return getCountryService.getCountryService(token).then(
        (response) => {
            dispatch({
                type: "COUNTRY_SUCCESS",
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
                type: "COUNTRY_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};
