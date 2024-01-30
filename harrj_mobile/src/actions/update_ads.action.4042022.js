import update_adsService from "../service/update_ads.service";

export const updateNormalAd = (

    token, product_id, title, description, keywords, category_id, sub_category_id, starting_price, video, product_img1, product_img2, product_img3, brand_id, model_id, city_id, country_id, year_id

) => (dispatch) => {
    return update_adsService.updateNormalAd(

        token, product_id, title, description, keywords, category_id, sub_category_id, starting_price, video, product_img1, product_img2, product_img3, brand_id, model_id, city_id, country_id, year_id

    ).then(
        (response) => {
            dispatch({
                type: "PRODUCT_UPDATE_SUCCESS",
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
                type: "PRODUCT_UPDATE_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};