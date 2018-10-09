import React, { Component } from 'react';
import './App.css';
import { getItemsFromFakeXHR, addItemToFakeXHR, deleteItemByIdFromFakeXHR } from './db/inventory.db';
import ItemForm from './ItemForm';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';

// fake data generator
const foo =
    'lorem ipsum dolor sit amet consectutrtpoyu sklhfdlkfh dklfh lkdhflhdflkh dlkfhdlkhflkd fldhflh';
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}${k + offset >= 10 ? foo : ''}`
    }));

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
    // console.log('these are the parameters, list, start index, and end index', list, startIndex, endIndex);
    const result = Array.from(list);
    // console.log(result, 'what is this again??')
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
};

/**
 * Moves an item from one list to another list.
 */
const move = (source, destination, droppableSource, droppableDestination, actualID) => {
    // console.log(droppableSource, 'dis da droppable Source');
    // console.log(droppableDestination, 'dis da droppable Destination');
    console.log(source, 'dis da original array');
    console.log(destination, 'dis da destination array');
    const sourceClone = Array.from(source);
    const destClone = Array.from(destination);
    const [removed] = sourceClone.splice(droppableSource.index, 1);
    // console.log(droppableSource, 'this is droppable source index and confusing me')
    // console.log(removed, 'this is what is supposedly being removed')
    let changeType = source.find( item => item.id === actualID);
    console.log(changeType, 'dis supposed to be the actual array source crap');
    changeType.type = droppableDestination.droppableId;
    // console.log(changeType.type, 'this is the changed type tho')

    destClone.splice(droppableDestination.index, 0, removed);

    const result = {};
    result[droppableSource.droppableId] = sourceClone;
    result[droppableDestination.droppableId] = destClone;

    return result;
};

const grid = 8;

const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',
    padding: grid * 2,
    margin: `0 0 ${grid}px 0`,

    // change background colour if dragging
    background: isDragging ? 'lightgreen' : 'grey',

    // styles we need to apply on draggables
    ...draggableStyle
});

const getListStyle = isDraggingOver => ({
    background: isDraggingOver ? 'lightblue' : 'lightgrey',
    overflow: 'auto',
    padding: grid,
    width: 250,
    height: 300
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

  onDragEnd = result => {
    console.log(result.draggableId, 'dis is on drag end')
      const { source, destination } = result;
      const actualId = result.draggableId;

      // console.log(source, 'this is the source?')
      // console.log(destination, 'this is the destination?')
      // dropped outside the list
      if (!destination) {
          return;
      }

      if (source.droppableId === destination.droppableId) {
          const items2 = reorder(
              this.getList(source.droppableId),
              source.index,
              destination.index
          );

          let state = { items2 };

          if (source.droppableId === 'droppable2') {
              state = { selected: items2 };
          }

          this.setState(state);
      } else {
          const result = move(
              this.getList(source.droppableId),
              this.getList(destination.droppableId),
              source,
              destination,
              actualId
          );

          this.setState({
              items2: result.droppable,
              selected: result.droppable2
          });
      }
  };

  componentDidMount() {
    this.updateStateFromDb();
  }

  updateStateFromDb = () => {
    getItemsFromFakeXHR()
      .then( items => {
        this.setState({items}, () => {
          console.log('this.state', this.state)
        })
      })
  }

  addItem = (item) => {
    addItemToFakeXHR(item)
    .then( items => {
      this.setState( {items } )
    })
  }

  deleteItemById = (itemId) => {
    deleteItemByIdFromFakeXHR(itemId)
    .then( result => {
      this.updateStateFromDb()
    })
  }


  render() {
    const { items } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Reack Attak</h1>
        </header>
        <div className="App-content">
        <DragDropContext onDragEnd={this.onDragEnd}>
        <ul>
        <h1 className="myh1">To do</h1>
                <Droppable droppableId="Todo">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <TestThis1 deleteItemById={this.deleteItemById} items={items}/> 
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                </ul>
                <ul>
        <h1 className="myh1">Doing</h1>
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
                <ul>
        <h1 className="myh1">Done</h1>
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
        <ItemForm addItem={this.addItem}/>
      </div>
    );
  }
}

function TodoList(props) {
  return props.items.filter(item => item.type === 'Todo').map( item => <li className="task" onClick={ () => GetDescription(item.id)}>{item.task}<span onClick={ () => props.deleteItemById(item.id)} className="x">x</span><div id={item.id} className="desc">{item.description}</div></li> )
}

function DoingList(props) {
  return props.items.filter(item => item.type === 'Doing').map( item => <li className="task" onClick={ () => GetDescription(item.id)}>{item.task}<span onClick={ () => props.deleteItemById(item.id)} className="x">x</span><div id={item.id} className="desc">{item.description}</div></li> )
}

function DoneList(props) {
  // The original code
  // return props.items.filter(item => item.type === 'Done').map( item => <li onClick={ () => props.deleteItemdoById(item.id)}>{item.task}<span class="x">x</span><div class="desc">{item.description}</div></li> )
  return props.items.filter(item => item.type === 'Done').map( item => <li className="task" onClick={ () => GetDescription(item.id)}>{item.task}<span onClick={ () => props.deleteItemById(item.id)} className="x">x</span><div id={item.id} className="desc">{item.description}</div></li> )
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
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                )}>
                {item.task}
                <span onClick={ () => props.deleteItemById(item.id)} className="x">x</span></div>
        )}
    </Draggable><div id={item.id} className="desc">{item.description}</div></li>
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
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                )}>
                {item.task}
                <span onClick={ () => props.deleteItemById(item.id)} className="x">x</span></div>
        )}
    </Draggable><div id={item.id} className="desc">{item.description}</div></li>
))
}

function TestThis3(props) {
  return props.items.filter(item => item.type === 'Done').map((item, index) => (
    <li className="task" onClick={ () => GetDescription(item.id)}>
    <Draggable
        key={item.id}
        draggableId={item.id}
        index={index}>
        {(provided, snapshot) => (
            <div
                ref={provided.innerRef}
                {...provided.draggableProps}
                {...provided.dragHandleProps}
                style={getItemStyle(
                    snapshot.isDragging,
                    provided.draggableProps.style
                )}>
                {item.task}
                <span onClick={ () => props.deleteItemById(item.id)} className="x">x</span></div>
        )}
    </Draggable><div id={item.id} className="desc">{item.description}</div></li>
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
}

export default App;