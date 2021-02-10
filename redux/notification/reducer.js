import { 
    FETCH_NOTIFICATION_REQUEST, 
    FETCH_NOTIFICATION_SUCCESS, 
    FETCH_NOTIFICATION_FAILURE 
} from "./types"


const initialProps = {
    notifications: {},
    loading: false,
    error: ''
}

const reducer = (state=initialProps, action) => {
    switch(action.type){
        case FETCH_NOTIFICATION_REQUEST: return {
            ...state,
            loading: true
        }

        case FETCH_NOTIFICATION_SUCCESS: return {
            notifications: action.payload,
            loading: false,
            error: ''
        }

        case FETCH_NOTIFICATION_FAILURE: return {
            notifications: {},
            loading: false,
            error: action.payload
        }
    }
}

export default reducer;