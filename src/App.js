import React, { Component } from 'react';
import './App.css';
import { getItemsFromFakeXHR, addItemToFakeXHR, deleteItemByIdFromFakeXHR } from './db/inventory.db';
import ItemForm from './ItemForm.js';
import ItemEdit from './EditItem.js';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import axios from 'axios';
import { connect } from 'react-redux';
import { getAllItems, deleteItemByIdAction, reorderItem, changeItemType } from './actions/actions.js'
import { library } from '@fortawesome/fontawesome-svg-core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faGhost } from '@fortawesome/free-solid-svg-icons'
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import { faEdit } from '@fortawesome/free-solid-svg-icons'

library.add(faEdit)
library.add(faCoffee)
library.add(faGhost)
library.add(faPencilAlt)

// fake data generator
const foo =
    'lorem ipsum dolor sit amet consectutrtpoyu sklhfdlkfh dklfh lkdhflhdflkh dlkfhdlkhflkd fldhflh';
const getItems = (count, offset = 0) =>
    Array.from({ length: count }, (v, k) => k).map(k => ({
        id: `item-${k + offset}`,
        content: `item ${k + offset}${k + offset >= 10 ? foo : ''}`
    }));

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
    // this.state = {
    //   items: [],
    //   items2: getItems(10),
    //   selected: getItems(5, 10)
    // }
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
    console.log(result, 'DIS DA RESULT ***************************')

      const { source, destination } = result;
      const actualId = result.draggableId;

      const list = this.props.items.items;
      console.log(list, 'hello list does this work?')

      // dropped outside the list
      if (!destination) {
          return;
      }

      if (source.droppableId === destination.droppableId) {
        this.reorder(
              result,
              list,
              source.index,
              destination.index,
              destination,
              source,
              this.props.items.items
          );

          // let state = { items };

          // // if (source.droppableId === 'droppable2') {
          // //     state = { selected: items };
          // // }

          // this.setState(state, console.log(state, ' DIS IS DA STATE !!!!!!!!!!'));
      } else {
          this.move(
              result
          );

        // let state = { result };
        // console.log(state, ' DIS IS DA STATE !!!!!!!!!!')

        // if (source.droppableId === 'droppable2') {
        //     state = { selected: items };
        // }

        // this.setState(state);

          // this.setState({
          //     items2: result.droppable,
          //     selected: result.droppable2
          // });
      }
  };

  // a little function to help us with reordering the result
  reorder = ( result, list, startIndex, endIndex, destination, source, currentCache ) => {

  // console.log(props, 'what?!?!?!?!?');
  this.props.dispatch(reorderItem( result, list, startIndex, endIndex, destination, source, currentCache ));

  // let result = Array.from(list);

  // console.log(destination, 'what"s destination again??')
  // let fak = result.filter(item => item.type === destination.droppableId);
  // console.log(fak, ' FAK DIS }HOLY FUK')
  // let temp = fak[endIndex].id-1;
  // let temp2 = fak[startIndex].id-1;
  // let tempId = fak[endIndex].id;
  // let temp2Id = fak[startIndex].id;

  // // Swap start id with end id
  // fak[startIndex].id = tempId; 

  // // Splice out the starting item from the array
  // let [removed] = result.splice(temp2, 1);

  // // Insert it @ temp
  // result.splice(temp, 0, removed)

  // // Reindex array 

  // for (let i = 0; i<result.length; i++) {
  //   result[i].id = i+1
  //   // console.log(result[i].task, 'new id is ' + result[i].id)
  // }

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

};

/**
* Moves an item from one list to another list.
*/
  move = (result) => {

    this.props.dispatch(changeItemType(result));

  // let result = Array.from(list);
  
  //   let changeType = result.find( result => result.id === actualID);
  //   changeType.type = destination.droppableId;
  
  
  //   return result; 
  };

  componentDidMount() {
    this.updateStateFromDb();
  }

  updateStateFromDb = () => {
    this.props.dispatch(getAllItems())
    console.log(this.props, 'dispatch');

  }

  deleteItemById = (item) => {

    console.log('DIS FIRED FUCK A')
    this.props.dispatch(deleteItemByIdAction(item))
    console.log('DIS FIRED SILVER LINING')
    // deleteItemByIdFromFakeXHR(itemId)
    // const itemIdx = this.state.items.findIndex( item => item.id === itemId);
    // if (itemIdx === -1) {
    //   console.log('Error: Item not found. Item could not be deleted.')
    // } else {
    //   this.state.items = this.state.items.filter( item => {
    //     return item.id !== itemId
    //   })
    // }

    // reindex?

    // for (let i = 0; i<this.state.items.length; i++) {
    //   this.state.items[i].id = i+1;
    //   // console.log(this.state.items[i].task, 'new id is ' + this.state.items[i].id)
    // }
    // this.setState( this.state.items )
  }


  render() {
    // const { items } = this.props.items

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="title-left">KANBAN</h1>
          <p className="title-right" onClick={ () => {console.log('this works')}}><span id="annoying">+</span><span id="enlarge">+</span> NEW TASK</p>
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
                            <TestThis1 props={this.props} deleteItemById={this.deleteItemById} items={this.props.items}/> 
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
                            <TestThis2 props={this.props} deleteItemById={this.deleteItemById} items={this.props.items}/>
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
                            <TestThis3 props={this.props} deleteItemById={this.deleteItemById} items={this.props.items}/> 
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
    );
  }
}

function TestThis1(props) {
  console.log(props, 'this is props again but from test 1')
  return props.items.items.filter(item => item.type === 'Todo').map((item, index) => (
    <li className="task">
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
                <span className="expand" onClick={ () => GetDescription(item.sortingid)}>[ Expand ]</span>
                <span className="isHighlighted">{item.task}</span>
                <span onClick={ () => ToggleEdit(item.id) } className="edit"><FontAwesomeIcon className="edit2" icon="edit" /></span>
                <span onClick={ () => props.deleteItemById(item)} className="x">x</span>
                <div id={item.sortingid} className="desc"><br /><span className='bold'>Priority: </span>{item.priority}<br/>{item.description}<span className="showless" onClick={ () => GetDescription(item.sortingid)}>[ Show Less ]</span></div>
                <ItemEdit currentCache={props.items.items} item={item}/></div>
        )}
    </Draggable></li>
))
}

function TestThis2(props) {
  return props.items.items.filter(item => item.type === 'Doing').map((item, index) => (
    <li className="task">
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
                <span className="expand" onClick={ () => GetDescription(item.sortingid)}>[ Expand ]</span>
                <span className="isHighlighted">{item.task}</span>
                <span onClick={ () => ToggleEdit(item.id) } className="edit"><FontAwesomeIcon className="edit2" icon="edit" /></span>
                <span onClick={ () => props.deleteItemById(item)} className="x">x</span>
                <div id={item.sortingid} className="desc"><br /><span className='bold'>Priority: </span>{item.priority}<br/>{item.description}<span className="showless" onClick={ () => GetDescription(item.sortingid)}>[ Show Less ]</span></div>
                <ItemEdit currentCache={props.items.items} item={item}/>
                </div>
        )}
    </Draggable></li>
))
}

function TestThis3(props) {
  return props.items.items.filter(item => item.type === 'Done').map((item, index) => (
    <li className="task">
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
                )}><span className="expand" onClick={ () => GetDescription(item.sortingid)}>[ Expand ]</span>
                <span className="isHighlighted">{item.task}</span>
                <span onClick={ () => ToggleEdit(item.id) } className="edit"><FontAwesomeIcon className="edit2" icon="edit" /></span>
                <span onClick={ () => props.deleteItemById(item)} className="x">x</span>
                <div id={item.sortingid} className="desc"><br /><span className='bold'>Priority: </span>{item.priority}<br/>{item.description}<span className="showless" onClick={ () => GetDescription(item.sortingid)}>[ Show Less ]</span></div>
                <ItemEdit currentCache={props.items.items} item={item}/>
                </div>
        )}
    </Draggable></li>
))
}

function GetDescription(itemID) {
  let allDescItems = document.getElementsByClassName('desc');
  let allExpandItems = document.getElementsByClassName('expand');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  let toggleThis;
  for (let i = 0; i < allDescItems.length; i++) {
    if ( allDescItems[i].id == itemID ) {
      toggleThis = allDescItems[i];
      if ( toggleThis.style.display === 'block'){
        toggleThis.style.display = 'none';
        allExpandItems[i].style.display = 'block';
        allHighlightedItems[i].style.fontWeight = 'normal';
        allHighlightedItems[i].style.fontSize = '14px';
        allHighlightedItems[i].style.textTransform = 'none';
      } else {
        toggleThis.style.display = 'block';
        allExpandItems[i].style.display = 'none';
        allHighlightedItems[i].style.fontWeight = 'bolder';
        allHighlightedItems[i].style.fontSize = '15px';
        allHighlightedItems[i].style.textTransform = 'uppercase';
      }
    }
  }
}

function ToggleEdit(itemID) {
  let allEditItems = document.getElementsByClassName('EditItem');
  let allExpandItems = document.getElementsByClassName('expand');
  let allDescItems = document.getElementsByClassName('desc');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  console.log(allEditItems[0], 'poopshoot')
  let toggleThis;
  for (let i = 0; i < allEditItems.length; i++) {
    if ( allEditItems[i].id == itemID ) {
      toggleThis = allEditItems[i];
      if ( toggleThis.style.display === 'block') {
        toggleThis.style.display = 'none';
        allExpandItems[i].style.display = 'block';
        allHighlightedItems[i].style.fontWeight = 'normal';
        allHighlightedItems[i].style.fontSize = '14px';
        allHighlightedItems[i].style.textTransform = 'none';
      } else {
        toggleThis.style.display = 'block'
        allExpandItems[i].style.display = 'none';
        allDescItems[i].style.display = 'none';
        allHighlightedItems[i].style.fontWeight = 'bolder';
        allHighlightedItems[i].style.fontSize = '15px';
        allHighlightedItems[i].style.textTransform = 'uppercase';
      }
    }
  }
}

export const closeEdit = (itemID) => {
  let allEditItems = document.getElementsByClassName('EditItem');
  let allExpandItems = document.getElementsByClassName('expand');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  let toggleThis;

  for (let i = 0; i < allEditItems.length; i++) {
    if ( allEditItems[i].id == itemID ) {
      toggleThis = allEditItems[i];
      toggleThis.style.display = 'none';
      allExpandItems[i].style.display = 'block';
      allHighlightedItems[i].style.fontWeight = 'normal';
      allHighlightedItems[i].style.fontSize = '14px';
      allHighlightedItems[i].style.textTransform = 'none';
    }
  }
}

const mapStateToProps = state => {
  return {
    items: state,
    lol: 'omgIJustEnteredAPropInThisComponent'
  }
}

export default connect(mapStateToProps)(App);