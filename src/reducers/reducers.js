import { GET_ALL_ITEMS, ADD_ITEM, DELETE_ITEM_BY_ID } from '../actions/actions.js';

const itemReducer = (state = [], action) => {
    switch (action.type) {
        case GET_ALL_ITEMS:
            return action.payload
        case ADD_ITEM:
            return [...state, action.payload]
        case DELETE_ITEM_BY_ID:
            return [...action.payload]
        default:
            return state
    }
}

export default itemReducer;