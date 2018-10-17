import { GET_ALL_ITEMS, ADD_ITEM, DELETE_ITEM_BY_ID, EDIT_ITEM_BY_ID, REORDER_ITEM, CHANGE_ITEM_TYPE, SAVE } from '../actions/actions.js';

const itemReducer = (state = {poop: 'shoot', items: []}, action) => {
    switch (action.type) {
        case GET_ALL_ITEMS:
            return { ...state, items: action.payload }
        case ADD_ITEM:
            return { ...state, items: action.payload }
        case DELETE_ITEM_BY_ID:
            return { ...state, items: [...action.payload] }
        case EDIT_ITEM_BY_ID:
            return { ...state, items: [...action.payload] }
        case REORDER_ITEM:
            return { ...state, items: action.payload }
        case CHANGE_ITEM_TYPE:
            return { ...state, items: action.payload }

        default:
            return state
    }
}

export default itemReducer;