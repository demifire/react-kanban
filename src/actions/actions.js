import axios from 'axios';

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
}

export const addItem = (item) => {
    console.log('ACTION: addItem',  item)
    return dispatch => {
      axios.post('/', item)
        .then( response => {
          console.log('response', response.data)
          dispatch({type: GET_ALL_ITEMS, payload: response.data})
        })
        .catch( err => {
          console.log('err in addItem action axios call', err)
        })
    }
  }