import axios from "axios";
import { Base_Url } from './../../config';
const BASE_URL = Base_Url;



class bidList {
    bidListService(token, product_id) {
        try {
            const url = BASE_URL + "/api/bidder/bidlist_by_productid"

            const insertData = new FormData();

            var header = { 'x-access-token': token };

            insertData.append('product_id', product_id);

            console.log("bidList Info:");
            console.log(url);

            console.log("bidList Data:");
            console.log(insertData);

            console.log("header ");
            console.log(header);

            return axios
                .post(url, insertData, { headers: header })
                .then((response) => {
                    console.log("bidList Service Response:");
                    console.log(response.data);
                    return response.data;
                })

        } catch (error) {
            console.log("Get bidList Service Info Error:")
            console.log(error)

            return error;
        }
    }
}

export default new bidList;