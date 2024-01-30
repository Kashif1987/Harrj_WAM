import axios from "axios";
import { Base_Url } from './../../config';
const BASE_URL = Base_Url;



class updateBidStatus {
    updateBidStatusService(token, customer_id, bid_id, bid_status) {
        try {
            const url = BASE_URL + "/api/customer/update_bid_status"

            const insertData = new FormData();

            insertData.append('customer_id', customer_id);
            insertData.append('bid_id', bid_id);
            insertData.append('bid_status', bid_status);

            console.log("updateBidStatus Info:");
            console.log(url);
            console.log(" updateBidStatus Data:");
            console.log(insertData);

            return axios
                .post(url, insertData)
                .then((response) => {
                    console.log("updateBidStatus Service Response:");
                    console.log(response.data);
                    return response.data;
                })

        } catch (error) {
            console.log("Get Service Info Error:")
            console.log(error)

            return error;
        }
    }
}

export default new updateBidStatus;