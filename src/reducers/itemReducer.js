import { FETCH_ITEMS, NEW_ITEMS } from '../actions/types';

const initialState = {
    myItems: [],
    myItem: {}
}

export default function(state = initialState, action) {
    switch(action.type) {
        case FETCH_ITEMS:
            return {
                ...state,
                myItems: action.payload
            }
        default:
            return state;
    }
}