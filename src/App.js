import React, { Component } from 'react';
import './App.css';
import { getItemsFromFakeXHR, addItemToFakeXHR, deleteItemByIdFromFakeXHR } from './db/inventory.db';
import ItemForm from './ItemForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { Provider } from 'react-redux';
// import { applyMiddleware } from '../../../../../Library/Caches/typescript/3.1/node_modules/redux';
// import store from './store';
import { connect } from 'react-redux';
import { fetchItems } from './actions/itemActions';


import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';


const initialState = {};

const middleware = [thunk];

const store = createStore(rootReducer, initialState, applyMiddleware(...middleware));

// fake data generator
const foo =
    'lorem ipsum dolor sit amet consectutrtpoyu sklhfdlkfh dklfh lkdhflhdflkh dlkfhdlkhflkd fldhflh';
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}${k + offset >= 10 ? foo : ''}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex, destination, source) => {

    let result = Array.from(list);

    console.log(destination, 'what"s destination again??')
    let fak = result.filter(item => item.type === destination.droppableId);
    console.log(fak, ' FAK DIS }HOLY FUK')
    let temp = fak[endIndex].id-1;
    let temp2 = fak[startIndex].id-1;
    let tempId = fak[endIndex].id;
    let temp2Id = fak[startIndex].id;

    // Swap start id with end id
    fak[startIndex].id = tempId; 

    // Splice out the starting item from the array
    let [removed] = result.splice(temp2, 1);

    // Insert it @ temp
    result.splice(temp, 0, removed)

    // Reindex array 

    for (let i = 0; i<result.length; i++) {
      result[i].id = i+1
      // console.log(result[i].task, 'new id is ' + result[i].id)
    }

    function checkDuplicateInObject(propertyName, inputArray) {
      let seenDuplicate = false,
          testObject = {};
    
      inputArray.map(function(item) {
        let itemPropertyName = item[propertyName];    
        if (itemPropertyName in testObject) {
          seenDuplicate = true;
        }
        else {
          testObject[itemPropertyName] = item;
          delete item.duplicate;
        }
      });
    
      return seenDuplicate;
    }

    // console.log(checkDuplicateInObject('id', result), 'dis da check duplicate stuff brh')

    return result;

};

/**
 * Moves an item from one list to another list.
 */
const move = (startIndex, endIndex, source, destination, actualID, list) => {

  let result = Array.from(list);

    let changeType = result.find( result => result.id === actualID);
    changeType.type = destination.droppableId;


    return result; 
};

const grid = 8;

const getItemStyle1 = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    
    background: isDragging ? 'lightblue' : 'rgb(253, 241, 222)',

    // styles we need to apply on draggables
    ...draggableStyle
});

// store = {store};

const getItemStyle2 = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  
  background: isDragging ? 'lightblue' : 'rgb(229, 253, 204)',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getItemStyle3 = (isDragging, draggableStyle) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,

  // change background colour if dragging
  
  background: isDragging ? 'lightblue' : 'rgb(246, 247, 250)',

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    border: isDraggingOver ? '1px solid lightblue' : '1px solid white',
    // background: isDraggingOver ? 'lightblue' : 'white',
    overflow: 'auto',
    padding: grid,
    width: 300,
    height: 400
});

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      items2: getItems(10),
      selected: getItems(5, 10)
    }
  }

  /**
     * A semi-generic way to handle multiple lists. Matches
     * the IDs of the droppable container to the names of the
     * source arrays stored in the state.
     */
    id2List = {
      Todo: 'items',
      Doing: 'items',
      Done: 'items',
  };
  

  getList = id => this.state[this.id2List[id]];

  getActualList = () => this.id2List;

  onDragEnd = result => {
    // console.log(result, 'result ? ')

      const { source, destination } = result;
      const actualId = result.draggableId;

      const list = this.getList(source.droppableId);

      // dropped outside the list
      if (!destination) {
          return;
      }

      if (source.droppableId === destination.droppableId) {
          const items = reorder(
              this.getList(source.droppableId),
              source.index,
              destination.index,
              destination,
              source
          );

          let state = { items };

          // if (source.droppableId === 'droppable2') {
          //     state = { selected: items };
          // }

          this.setState(state, console.log(state, ' DIS IS DA STATE !!!!!!!!!!'));
      } else {
          const result = move(
              source.index,
              destination.index,
              source,
              destination,
              actualId,
              list
          );

        let state = { result };
        // console.log(state, ' DIS IS DA STATE !!!!!!!!!!')

        // if (source.droppableId === 'droppable2') {
        //     state = { selected: items };
        // }

        this.setState(state);

          // this.setState({
          //     items2: result.droppable,
          //     selected: result.droppable2
          // });
      }
  };

  componentDidMount() {
    this.updateStateFromDb();
  }

  updateStateFromDb = () => {
    // getItemsFromFakeXHR()
    //   .then( items => {
    //     this.setState({items}, () => {
    //       console.log('this.state', this.state)
    //     })
    //   })
    
    // // Second iteration
    // axios
    // .get('/items')
    // .then( items => {
    //   console.log("items", items)
    //   this.setState({items: items.data})
    // })
    // .catch( err => {
    //   console.log('err', err)
    // })

    this.props.fetchItems();
  }

  addItem = (item) => {
    // addItemToFakeXHR(item)

    let original = item.id
    let newId = this.state.items.length+1;
    item.id = newId;
    // console.log(item.id, 'HELLO????')
    
    // Check for duplicates
    if (this.state.items.some( arrayItem => arrayItem.id === item.id)) {
      // console.log(this.state.items, 'waait does it really exist in here tho?')
      // console.log('Item id exists. Edit submission.')
      item.id = original;
      return false
    } else {

      this.state.items.push(item)
          // Reindex array  --- Uhhh do I have to re index here?

    for (let i = 0; i<this.state.items.length; i++) {
      this.state.items[i].id = i+1;
      // console.log(this.state.items[i].task, 'new id is ' + this.state.items[i].id)
    }
      this.setState( this.state.items  )
      // .then( items => {
      //   console.log(items, ' THIS IS ITEMS')
      //   this.setState( this.state.items  )
      // })

      axios
      .post('/', item)
      .then( items => {
        // console.log("items", items)
        // this.setState({items: items.data})
      })
      .catch( err => {
        console.log('err', err)
      })
    }
  }

  deleteItemById = (itemId) => {
    deleteItemByIdFromFakeXHR(itemId)
    const itemIdx = this.state.items.findIndex( item => item.id === itemId);
    if (itemIdx === -1) {
      console.log('Error: Item not found. Item could not be deleted.')
    } else {
      this.state.items = this.state.items.filter( item => {
        return item.id !== itemId
      })
    }

    // reindex?

    for (let i = 0; i<this.state.items.length; i++) {
      this.state.items[i].id = i+1;
      // console.log(this.state.items[i].task, 'new id is ' + this.state.items[i].id)
    }
    this.setState( this.state.items )
  }


  render() {
    const { items } = this.state

    return (
      <Provider store={store}>
      <div className="App">
        <header className="App-header">
          <h1 className="title-left">KANBAN</h1>
          <p onClick={ () => {console.log('this works')}} className="title-right">+ NEW TASK</p>
        </header>
        <div className="App-wrapper">
        <div className="App-content">
        <DragDropContext onDragEnd={this.onDragEnd}>
        <ul className="ass">
        <h1 className="myh1">IN QUEUE</h1>
                <Droppable droppableId="Todo">
                    {(provided, snapshot) => (
                        <div 
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <TestThis1 deleteItemById={this.deleteItemById} items={items}/> 
                            {provided.placeholder}
                            {/* {console.log(provided, ' this is provided')}
                            {console.log(snapshot, 'this is a snapshop')} */}
                        </div>
                    )}
                </Droppable>
                </ul>
                <hr className="border" />
                <ul>
        <h1 className="myh1">IN PROGRESS</h1>
                <Droppable droppableId="Doing">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <TestThis2 deleteItemById={this.deleteItemById} items={items}/>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                </ul>
                <hr className="border" />
                <ul>
        <h1 className="myh1">COMPLETED</h1>
                <Droppable droppableId="Done">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <TestThis3 deleteItemById={this.deleteItemById} items={items}/> 
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </ul>
            </DragDropContext>
        </div>
        <br></br>
        <ItemForm addItem={this.addItem}/>
        </div>
      </div>
      </Provider>
    );
  }
}

function TestThis1(props) {
  return props.items.filter(item => item.type === 'Todo').map((item, index) => (
    <li className="task" onClick={ () => GetDescription(item.id)}>
    <Draggable
        key={item.id}
        draggableId={item.id}
        index={index}>
        {(provided, snapshot) => (
            <div
                className="Todo card"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle1(
                    snapshot.isDragging,
                    provided.draggableProps.style
                )}>
                {item.task}
                <span onClick={ () => props.deleteItemById(item.id)} className="x">x</span>
                <div id={item.id} className="desc"><br /><span className='bold'>Priority: </span>{item.priority}<br/>{item.description}</div>
                </div>
        )}
    </Draggable></li>
))
}

function TestThis2(props) {
  return props.items.filter(item => item.type === 'Doing').map((item, index) => (
    <li className="task" onClick={ () => GetDescription(item.id)}>
    <Draggable
        key={item.id}
        draggableId={item.id}
        index={index}>
        {(provided, snapshot) => (
            <div
                className="Doing card"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle2(
                    snapshot.isDragging,
                    provided.draggableProps.style
                )}>
                {item.task}
                <span onClick={ () => props.deleteItemById(item.id)} className="x">x</span>
                <div id={item.id} className="desc">{item.description}</div>
                </div>
        )}
    </Draggable></li>
))
}

function TestThis3(props) {
  console.log(props, 'DIS BE PROPS')
  return props.items.filter(item => item.type === 'Done').map((item, index) => (
    <li className="task" onClick={ () => GetDescription(item.id)}>
    {/* {console.log('AHHHAHAHSHFHASHFHASH', props)} */}
    <Draggable
        key={item.id}
        draggableId={item.id}
        index={index}>
        {(provided, snapshot) => (
            <div
                className="Done card"
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle3(
                    snapshot.isDragging,
                    provided.draggableProps.style
                )}>
                {item.task}
                <span onClick={ () => props.deleteItemById(item.id)} className="x">x</span>
                <div id={item.id} className="desc">{item.description}</div>
                </div>
        )}
    </Draggable></li>
))
}

function GetDescription(itemID){
  let allDescItems = document.getElementsByClassName('desc');
  let toggleThis;
  for (var i = 0; i < allDescItems.length; i++){
    if ( allDescItems[i].id == itemID ) {
      toggleThis = allDescItems[i];
      if ( toggleThis.style.display === 'block'){
        toggleThis.style.display = 'none'
      } else {
        toggleThis.style.display = 'block'
      }
    }
  }
  // highlightItem(itemID)
}

// function highlightItem(ID){
//   let allCardItems = document.getElementsByClassName('card');
//   let toggleThis;
//   for (var i = 0; i < allCardItems.length; i++){
//     if ( allCardItems[i].id == ID ) {
//       console.log(allCardItems[i].task);
//       toggleThis = allCardItems[i];
//       if ( toggleThis.style.fontSize === '14px'){
//         toggleThis.style.fontSize = '40px'
//       } else {
//         toggleThis.style.fontSize = '14px'
//       }
//     }
//   }
// }

const mapStateToProps = state => ({
  items: state.items.myItems
})

export default connect(mapStateToProps, { fetchItems })(App);
