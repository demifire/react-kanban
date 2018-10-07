let itemsFromFakeDB = [{
    id: 1,
    task: 'Drink A Large Healing Potion',
    description: 0.1,
    type: 'To-do'
  },
  {
    id: 2,
    task: 'Wirts Leg',
    description: 10,
    type: 'Doing'
  },
  {
    id: 3,
    task: 'Dreamwalker Spaulders',
    description: 2,
    type: 'Done'
  },
  {
    id: 4,
    task: 'A Large Healing Potion',
    description: 0.1,
    type: 'To-do'
  },
  {
   id: 5,
    task: 'A Large Healing Potion',
    description: 0.1,
    type: 'Doing'
  },
  {                
    id: 6,
    task: 'A Large Healing Potion',
    description: 0.1,
    type: 'Done'
  }
]

let newId = 7

export const getItemsFromFakeXHR = () => new Promise((resolve, reject) => {
  setTimeout( () => {
    resolve(itemsFromFakeDB.slice())
  }, 500)
})

export const addItemToFakeXHR = (item) => new Promise((resolve, reject) => {
  setTimeout( () => {
    item.id = newId;
    newId++;
    itemsFromFakeDB.push(item);
    console.log('itemFromFakeDB', itemsFromFakeDB)
    resolve(itemsFromFakeDB)
  },500)
})

export const getItemByIdFromFakeXHR = (itemId) => new Promise( (resolve, reject) => {
  setTimeout( () => {
    const itemResponse = itemsFromFakeDB.find( item => item.id === itemId);
    if (itemResponse) resolve(itemResponse);
    else reject({status: 404, message: 'item not found'})
  }, 500)
})


export const deleteItemByIdFromFakeXHR = (itemId) => new Promise ( (resolve, reject) => {

// export const deleteItemById = (itemId) => new Promise ( (resolve, reject) => {

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