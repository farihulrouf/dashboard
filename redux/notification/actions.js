import { 
    FETCH_NOTIFICATION_REQUEST, 
    FETCH_NOTIFICATION_SUCCESS, 
    FETCH_NOTIFICATION_FAILURE 
} from "./types";
import axios from "axios";

const fetchNotificationRequest = () => {
    return {
        type: FETCH_NOTIFICATION_REQUEST
    }
} 

const fetchNotificationSuccess = (response) => {
    const {data} = response;
    return {
        type: FETCH_NOTIFICATION_SUCCESS,
        payload: data.notifications
    }
}

const fetchNotificationFailure = (error) => {
    const {message} = error
    return {
        type: FETCH_NOTIFICATION_FAILURE,
        payload: message
    }
}

export const fetchNotifications = () => {
    return function(dispatch){
        dispatch(fetchNotificationRequest());
        axios.get("/api/users/me/notifications")
            .then(response => dispatch(fetchNotificationSuccess(response)))
            .catch(err => dispatch(fetchNotificationFailure(err)))
    }
}
