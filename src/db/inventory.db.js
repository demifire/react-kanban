let itemsFromFakeDB = [{
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



// let newId = 7

export const getItemsFromFakeXHR = () => new Promise((resolve, reject) => {
  setTimeout( () => {
    resolve(itemsFromFakeDB.slice())
  }, 500)
})

const checkFakeXHRForDuplicates = (itemID) => {
        const itemIdx = itemsFromFakeDB[itemsFromFakeDB.length-1].id
        if (itemIdx === itemID) {
            return true
        } else {
            return false
        }
  }

export const addItemToFakeXHR = (item) => new Promise((resolve, reject) => {
    setTimeout( () => {
        // item.id = newId;
        if (checkFakeXHRForDuplicates(item.id)){
            // newId++;
            reject({status: 500, message: 'Duplicate id'})
        } else {
            // newId++;
            console.log(itemsFromFakeDB, 'are changes reflected?')
            itemsFromFakeDB.push(item);
            resolve(itemsFromFakeDB)
        }
    }, 500)
})

export const getItemByIdFromFakeXHR = (itemId) => new Promise( (resolve, reject) => {
  setTimeout( () => {
    const itemResponse = itemsFromFakeDB.find( item => item.id === itemId);
    if (itemResponse) resolve(itemResponse);
    else reject({status: 404, message: 'item not found'})
  }, 500)
})


export const deleteItemByIdFromFakeXHR = (itemId) => new Promise ( (resolve, reject) => {
  setTimeout( () => {
    const itemIdx = itemsFromFakeDB.findIndex( item => item.id === itemId);
    if (itemIdx === -1) {
      reject({status: 500, message: 'item not found'})
    } else {
      itemsFromFakeDB = itemsFromFakeDB.filter( item => {
        return item.id !== itemId
      })
      console.log('itemsFromFakeDB', itemsFromFakeDB)
      console.log('itemIdx', itemIdx)
      resolve({status: 'ok'})
    }
  })
})

