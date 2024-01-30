import MyAdsList from "../service/myAds.service";


export const MyAdsListAction = (token,user_id,search_title) => (dispatch) => {
    return MyAdsList.MyAdsListService(token,user_id,search_title).then(
        (response) => {
            dispatch({
                type: "My_Ads_list_SUCCESS",
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
                type: "My_Ads_list_FAIL",
                payload: []
            });
            return Promise.reject(error);
        }
    );
};