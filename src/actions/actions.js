import axios from 'axios';

export const GET_ALL_ITEMS = 'GET_ALL_ITEMS'
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM_BY_ID = 'DELETE_ITEM_BY_ID';
export const EDIT_ITEM_BY_ID = 'EDIT_ITEM_BY_ID';

let cache;

export const getAllItems = () => {
    return dispatch => {
        axios.get('/items')
            .then( response => {
                // console.log(response, 'data in actionCreator');
                cache = [...response.data];
                for ( let i = 0; i < cache.length; i++ ) {
                    cache[i].sortingid = i+1;
                    // console.log(result[i].task, 'new id is ' + result[i].id)
                }
                console.log(cache, ' dis a cache');
                dispatch({type: GET_ALL_ITEMS, payload: cache})
            })
            .catch( err => {
                // dispatch({type: DISPLAY_ERROR_NOTIFICATION})
                console.log(err, 'err')
            })
    }
}

export const addItem = (item) => {

    // return dispatch => {
    //     axios.post('/', item)
    // .then( response => {
    //     console.log('WHERE THE FUCK**********************************************************************************************', response.data)
    //     dispatch({type: ADD_ITEM, payload: response.data})
    // })
    // .catch( err => {
    //   console.log('err in addItem action axios call', err)
    // });
    // }


    console.log('ACTION: addItem',  item);
    cache = [...cache, item];
    for ( let i = 0; i < cache.length; i++ ) {
        cache[i].sortingid = i+1;
        // console.log(result[i].task, 'new id is ' + result[i].id)
    }
    axios.post('/', item)
    .then( response => {
      console.log('response', response.data)
    })
    .catch( err => {
      console.log('err in addItem action axios call', err)
    //   if ( err ) {
    //     const index = cache.findIndex(element => element.id === item.id);
    //     cache.splice(index, 1);
    //     return dispatch => {
    //         dispatch({type: ADD_ITEM, payload: cache})
    //     }
    //   }
    });
    return dispatch => {
        dispatch({type: ADD_ITEM, payload: cache})
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

  