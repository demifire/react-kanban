import axios from 'axios';

export const GET_ALL_ITEMS = 'GET_ALL_ITEMS'
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM_BY_ID = 'DELETE_ITEM_BY_ID';
export const EDIT_ITEM_BY_ID = 'EDIT_ITEM_BY_ID';

export const getAllItems = () => {
    return dispatch => {
        axios.get('/items')
            .then( response => {
                // console.log(response, 'data in actionCreator');
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

  export const deleteItemByIdAction = (item) => {
    console.log('ACTION: Delete Item')
    return dispatch => {
      axios.delete('/:id', { data: { item } })
        .then( response => {
          console.log('DELETE response', response.data)
          dispatch({type: DELETE_ITEM_BY_ID, payload: response.data})
        })
        .catch( err => {
          console.log('err in addItem action axios call', err)
        })
    }
  }

  export const editItem = (item) => {
    console.log('ACTION: Edit Item')
    return dispatch => {
      axios.put('/:id', { item })
        .then( response => {
          console.log('Edit response', response.data)
          dispatch({type: EDIT_ITEM_BY_ID, payload: response.data})
        })
        .catch( err => {
          console.log('err in addItem action axios call', err)
        })
    }
  }

  