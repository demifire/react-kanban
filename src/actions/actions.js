import axios from 'axios';

export const GET_ALL_ITEMS = 'GET_ALL_ITEMS'
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM_BY_ID = 'DELETE_ITEM_BY_ID';
export const EDIT_ITEM_BY_ID = 'EDIT_ITEM_BY_ID';
export const REORDER_ITEM = 'REORDER_ITEM';

let cache;

export const getAllItems = () => {
    return dispatch => {
        axios.get('/items')
            .then( response => {
                cache = [...response.data];
                for ( let i = 0; i < cache.length; i++ ) {
                    cache[i].sortingid = i+1;
                }
                dispatch({type: GET_ALL_ITEMS, payload: cache})
            })
            .catch( err => {
                console.log(err, 'err')
            })
    }
}

export const addItem = (item) => {

    console.log('ACTION: addItem',  item);
    cache = [...cache, item];
    for ( let i = 0; i < cache.length; i++ ) {
        cache[i].sortingid = i+1;
    }
    axios.post('/', item)
    .then( response => {
      console.log('response', response.data)
    })
    .catch( err => {
      console.log('err in addItem action axios call', err)
      if ( err ) {
        const index = cache.findIndex(element => element.id === item.id);
        cache.splice(index, 1);
        return dispatch => {
            dispatch({type: ADD_ITEM, payload: cache})
        }
      }
    });
    return dispatch => {
        dispatch({type: ADD_ITEM, payload: cache})
    }
  }

  export const deleteItemByIdAction = (item) => {
    
    console.log('ACTION: Delete Item')
    const index = cache.findIndex(element => element.sortingid === item.sortingid);
    cache.splice(index, 1);
    cache = [...cache];
    for ( let i = 0; i < cache.length; i++ ) {
        cache[i].sortingid = i+1;
    }

    axios.delete('/:id', { data: { item } })
        .then( response => {
          console.log('DELETE response', response.data)
        })
        .catch( err => {
          console.log('err in addItem action axios call', err)
        })

    return dispatch => {
        dispatch({type: DELETE_ITEM_BY_ID, payload: cache})
    }
  }

  export const editItem = (item) => {
    console.log('ACTION: Edit Item')

    const index = cache.findIndex(element => element.sortingid === item.sortingid);
    cache[index].task = item.task;
    cache[index].description = item.description;
    cache[index].priority = item.priority;

    axios.put('/:id', { item })
    .then( response => {
      console.log('Edit response', response.data)
    })
    .catch( err => {
      console.log('err in addItem action axios call', err)
    })

    return dispatch => {
        dispatch({type: EDIT_ITEM_BY_ID, payload: cache})
    }
  }

  export const reorderItem = ( result, list, startIndex, endIndex, destination, source ) => {

    console.log(result, 'bitch');

    // let result = Array.from(list);

    // console.log(destination, 'what"s destination again??')
    let fak = cache.filter(item => item.type === destination.droppableId);
    console.log(fak, ' FAK DIS }HOLY FUK')
    let temp = fak[endIndex].sortingid-1;
    let temp2 = fak[startIndex].sortingid-1;
    let tempId = fak[endIndex].sortingid;
    let temp2Id = fak[startIndex].sortingid;

    // Swap start id with end id
    fak[startIndex].sortingid = tempId; 

    // Splice out the starting item from the array
    let [removed] = cache.splice(temp2, 1);

    // Insert it @ temp
    cache.splice(temp, 0, removed)

    // Reindex array 

    for (let i = 0; i < cache.length; i++) {
      cache[i].sortingid = i+1
      // console.log(result[i].task, 'new id is ' + result[i].id)
    }

    // function checkDuplicateInObject(propertyName, inputArray) {
    //   let seenDuplicate = false,
    //       testObject = {};
    
    //   inputArray.map(function(item) {
    //     let itemPropertyName = item[propertyName];    
    //     if (itemPropertyName in testObject) {
    //       seenDuplicate = true;
    //     }
    //     else {
    //       testObject[itemPropertyName] = item;
    //       delete item.duplicate;
    //     }
    //   });
    
    //   return seenDuplicate;
    // }

    // // console.log(checkDuplicateInObject('id', result), 'dis da check duplicate stuff brh')

    // return result;

    return dispatch => {
        dispatch({type: REORDER_ITEM, payload: cache})
    }
  }
  