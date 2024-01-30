import updateMeetingStatusService from "../service/updateMeetingStatusService";


export const UpdateMeetingStatusAction = (product_id, meeting_status) => (dispatch) => {
    return updateMeetingStatusService.UpdateMeetingStatus(product_id, meeting_status).then(
        (response) => {
            dispatch({
                type: "UPDATE_MEETING_STATUS_SUCCESS",
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
                type: "UPDATE_MEETING_STATUS_FAIL",
                payload: []
            });

            return Promise.reject(error);
        }
    );
};