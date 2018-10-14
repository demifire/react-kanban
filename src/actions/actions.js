import axios from 'axios';
// import { bindActionCreators } from '../../../../../../Library/Caches/typescript/3.1/node_modules/redux';

const initialState = [{
    id: 1,
    task: 'Make sheeshee',
    priority: 'Low',
    description: 'Assigned by Jon',
    type: 'Todo'
  },
  {
    id: 2,
    task: 'Eat a sandwich',
    description: 'Assigned by Jon',
    type: 'Doing'
  },
  {
    id: 3,
    task: 'Make a poop',
    description: 'Assigned by Renee',
    type: 'Done'
  },
  {
    id: 4,
    task: 'Pop champagne',
    description: 'Assigned by Jon',
    type: 'Todo'
  },
  {
   id: 5,
    task: 'Drink juice',
    description: 'Assigned by Renee',
    type: 'Doing'
  },
  {                
    id: 6,
    task: 'Wear ladies clothing',
    description: 'Assigned by Jon',
    type: 'Done'
  }
]

export const GET_ALL_ITEMS = 'GET_ALL_ITEMS'
export const ADD_ITEM = 'ADD_ITEM';

export const getAllItems = () => {
    return dispatch => {
        axios.get('/items')
            .then( response => {
                console.log(response, 'data in actionCreator');
                dispatch({type: GET_ALL_ITEMS, payload: response.data})
            })
            .catch( err => {
                // dispatch({type: DISPLAY_ERROR_NOTIFICATION})
                console.log(err, 'err')
            })
    }

    // return {
    //     type: GET_ALL_ITEMS,
    //     payload: initialState
    // }
}

export const addItem = (item) => {
    // return {
    //     type: ADD_ITEM,
    //     payload: item
    // }
    return dispatch => {
        axios.post('/', item)
            .then (dispatch => {
                console.log('response', dispatch.data)
                dispatch({type: GET_ALL_ITEMS, payload: dispatch.data})
            })
            .catch( err => {
                console.log(err, 'dispatch err')
            })
    }
}