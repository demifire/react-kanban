import axios from 'axios';

export const GET_ALL_ITEMS = 'GET_ALL_ITEMS'
export const ADD_ITEM = 'ADD_ITEM';
export const DELETE_ITEM_BY_ID = 'DELETE_ITEM_BY_ID';
export const EDIT_ITEM_BY_ID = 'EDIT_ITEM_BY_ID';
export const REORDER_ITEM = 'REORDER_ITEM';
export const CHANGE_ITEM_TYPE = 'CHANGE_ITEM_TYPE';
export const SET_VISIBLE_TO_TRUE = 'SET_VISIBLE_TO_TRUE'
export const SET_VISIBLE_TO_FALSE = 'SET_VISIBLE_TO_FALSE'

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
      console.log('response', response.data);
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

  export const deleteItemByIdAction = (item, currentCache) => {
    
    console.log('ACTION: Delete Item')
    const index = cache.findIndex(element => element.sortingid === item.sortingid);
    cache[index].type = false;
    cache = [...cache];
    for ( let i = 0; i < cache.length; i++ ) {
        cache[i].sortingid = i+1;
    }

    axios.delete('/:id', { data: { item } })
        .then( response => {
          console.log('DELETE response', response.data);
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

  export const reorderItem = ( result, list, startIndex, endIndex, destination, source, currentCache ) => {

    console.log(currentCache, 'this is the current cache bitch')
    // console.log(result, 'bitch');

    let fak = cache.filter(item => item.type === destination.droppableId);
    // console.log(fak, ' FAK DIS }HOLY FUK')
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

    axios.put('/save', { currentCache })
    .then( response => {
      console.log('Edit response', response.data)
    })
    .catch( err => {
      console.log('err in addItem action axios call', err)
    })

    return dispatch => {
        dispatch({type: REORDER_ITEM, payload: cache})
    }
  }
  
  export const changeItemType = (result) => {
  
    console.log(result, 'result');
    let sourceArr = cache.filter(item => item.type === result.source.droppableId)
    let changeType = sourceArr[result.source.index]
    changeType.type = result.destination.droppableId;

    const item = changeType;

    // let DestinationArr = cache.filter(item => item.type === result.destination.droppableId);
    // console.log(DestinationArr, 'Destination Arr');
    // changeType.sortingid = DestinationArr[result.destination.index].sortingid;

    // let [removed] = cache.splice(sourceArr[result.source.index], 1);
    // cache.splice(DestinationArr[result.destination.index].sortingid-1, 0, removed);

    // console.log(DestinationArr[result.destination.index], 'what is this', DestinationArr[result.destination.index].sortingid)

    // for (let i = 0; i < cache.length; i++) {
    //   cache[i].sortingid = i+1
    // }

    // console.log(cache, 'this is the current cache');

    axios.put('/:id', { item })
    .then( response => {
      console.log('Edit response', response.data)
    })
    .catch( err => {
      console.log('err in addItem action axios call', err)
    })
  
    return dispatch => {
        dispatch({type: CHANGE_ITEM_TYPE, payload: cache})
    } 
  }

//   export const save = (cache) => {

//     console.log('this is the one being fired')
//     axios.put('/save', { cache })
//     .then( response => {
//       console.log('Edit response', response.data)
//     })
//     .catch( err => {
//       console.log('err in addItem action axios call', err)
//     })

//     return dispatch => {
//         dispatch({type: SAVE, payload: cache})
//     }  
//   }

export const setVisibleTrue = () => {
    return dispatch => {
        dispatch({type: SET_VISIBLE_TO_TRUE, payload: true } )
    } 
}

export const setVisibleFalse = () => {
    return dispatch => {
        dispatch({type: SET_VISIBLE_TO_FALSE, payload: false } )
    } 
}