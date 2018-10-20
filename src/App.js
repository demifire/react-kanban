import React, { Component } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { getAllItems, deleteItemByIdAction, reorderItem, changeItemType, setVisibleTrue, setVisibleFalse } from './actions/actions.js';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencilAlt } from '@fortawesome/free-solid-svg-icons';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import Rodal from 'rodal';
import ItemForm from './ItemForm.js';
import ItemEdit from './EditItem.js';
import './App.css';
import 'rodal/lib/rodal.css';

library.add(faEdit);
library.add(faPencilAlt);

class App extends Component {
  constructor(props) {
    super(props)
  }
  
  show = () => {
    this.props.dispatch(setVisibleTrue());
  }

  hide = () => {
    this.props.dispatch(setVisibleFalse());
  }

  onDragEnd = result => {

    const { source, destination } = result;
    const list = this.props.items.items;

    if (!destination) {
      return;
    };

    if (source.droppableId === destination.droppableId) {
      this.reorder(result, list, source.index, destination.index, destination, source, this.props.items.items);
    } else {
      this.move(result);
    };
  };

  reorder = ( result, list, startIndex, endIndex, destination, source, currentCache ) => {
  this.props.dispatch(reorderItem( result, list, startIndex, endIndex, destination, source, currentCache ));
  };

  move = (result) => {
    this.props.dispatch(changeItemType(result));
  };

  componentDidMount() {
    this.updateStateFromDb();
  };

  updateStateFromDb = () => {
    this.props.dispatch(getAllItems());
  };

  deleteItemById = (item) => {
    this.props.dispatch(deleteItemByIdAction(item));
  };


  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 id="Home" onClick={console.log('uhh make this redirect to home?')} className="title-left">KANBAN</h1><div>
          <p className="title-right" onClick={this.show.bind(this)}><span id="annoying">+</span><span id="enlarge">+</span> NEW TASK</p>
          <span className="title-right-minus" onClick={ () => {for (let i = 1; i < this.props.items.items.length+1; i++) {ToggleOff(i)}} }>-</span>
          <span className="title-right-plus" onClick={ () => {for (let i = 1; i < this.props.items.items.length+1; i++) {ToggleAll(i)}} }>+</span>
                <Rodal animation='door' duration='800' visible={this.props.items.visible} onClose={this.hide.bind(this)}>
                    <div className="shortDiv" ><ItemForm triggerClose={this.hide.bind(this)} addItem={this.addItem}/></div>
                </Rodal>
            </div>
        </header>
        <div className="App-content">
        <DragDropContext onDragEnd={this.onDragEnd}>
        <ul>
        <h1 className="taskTitle">IN QUEUE</h1>
                <Droppable droppableId="Todo">
                    {(provided, snapshot) => (
                        <div 
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <Todo props={this.props} deleteItemById={this.deleteItemById} items={this.props.items}/> 
                            {provided.placeholder}
                            {/* {console.log(provided, ' this is provided')}
                            {console.log(snapshot, 'this is a snapshop')} */}
                        </div>
                    )}
                </Droppable>
                </ul>
                <hr className="border" />
                <ul>
        <h1 className="taskTitle">IN PROGRESS</h1>
                <Droppable droppableId="Doing">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <Doing props={this.props} deleteItemById={this.deleteItemById} items={this.props.items}/>
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
                </ul>
                <hr className="border" />
                <ul>
        <h1 className="taskTitle">COMPLETED</h1>
                <Droppable droppableId="Done">
                    {(provided, snapshot) => (
                        <div
                            ref={provided.innerRef}
                            style={getListStyle(snapshot.isDraggingOver)}>
                            <Done props={this.props} deleteItemById={this.deleteItemById} items={this.props.items}/> 
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            </ul>
            </DragDropContext>
        </div>
      </div>
    );
  }
}

class Todo extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      this.props.props.items.items.filter(item => item.type === 'Todo').map((item, index) => (
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
                    style={TodoStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}>
                    <span className="expand" onClick={ () => GetDescription(item.sortingid)}>[ Expand ]</span>
                    <span className="isHighlighted">{item.task}</span>
                    <span onClick={ () => ToggleEdit(item.id) } className="edit"><FontAwesomeIcon className="edit2" icon="edit" /></span>
                    <span onClick={ () => this.props.props.deleteItemById(item, this.props.props.items.items)} className="x">x</span>
                    <div id={item.sortingid} className="desc"><br /><span className='bold'>Priority: </span>{item.priority}<br/>{item.description}<span className="showless" onClick={ () => GetDescription(item.sortingid)}>[ Show Less ]</span></div>
                    <ItemEdit currentCache={this.props.props.items.items} item={item}/></div>
            )}
        </Draggable></li>
    ))
    );
  }
}

class Doing extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      this.props.props.items.items.filter(item => item.type === 'Doing').map((item, index) => (
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
                    style={DoingStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}>
                    <span className="expand" onClick={ () => GetDescription(item.sortingid)}>[ Expand ]</span>
                    <span className="isHighlighted">{item.task}</span>
                    <span onClick={ () => ToggleEdit(item.id) } className="edit"><FontAwesomeIcon className="edit2" icon="edit" /></span>
                    <span onClick={ () => this.props.props.deleteItemById(item, this.props.props.items.items)} className="x">x</span>
                    <div id={item.sortingid} className="desc"><br /><span className='bold'>Priority: </span>{item.priority}<br/>{item.description}<span className="showless" onClick={ () => GetDescription(item.sortingid)}>[ Show Less ]</span></div>
                    <ItemEdit currentCache={this.props.props.items.items} item={item}/></div>
            )}
        </Draggable></li>
    ))
    );
  }
}

class Done extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    return (
      this.props.props.items.items.filter(item => item.type === 'Done').map((item, index) => (
        <li className="task">
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
                    style={DoneStyle(
                        snapshot.isDragging,
                        provided.draggableProps.style
                    )}>
                    <span className="expand" onClick={ () => GetDescription(item.sortingid)}>[ Expand ]</span>
                    <span className="isHighlighted">{item.task}</span>
                    <span onClick={ () => ToggleEdit(item.id) } className="edit"><FontAwesomeIcon className="edit2" icon="edit" /></span>
                    <span onClick={ () => this.props.props.deleteItemById(item, this.props.props.items.items)} className="x">x</span>
                    <div id={item.sortingid} className="desc"><br /><span className='bold'>Priority: </span>{item.priority}<br/>{item.description}<span className="showless" onClick={ () => GetDescription(item.sortingid)}>[ Show Less ]</span></div>
                    <ItemEdit currentCache={this.props.props.items.items} item={item}/></div>
            )}
        </Draggable></li>
    ))
    );
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

const TodoStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: 8 * 2,
  margin: `0 0 ${8}px 0`,    
  background: isDragging ? 'lightblue' : 'rgb(253, 241, 222)',
  ...draggableStyle
});

const DoingStyle = (isDragging, draggableStyle) => ({
userSelect: 'none',
padding: 8 * 2,
margin: `0 0 ${8}px 0`,
background: isDragging ? 'lightblue' : 'rgb(229, 253, 204)',
...draggableStyle
});

const DoneStyle = (isDragging, draggableStyle) => ({
userSelect: 'none',
padding: 8 * 2,
margin: `0 0 ${8}px 0`,
background: isDragging ? 'lightblue' : 'rgb(246, 247, 250)',
...draggableStyle
});

const getListStyle = isDraggingOver => ({
  border: isDraggingOver ? '1px solid lightblue' : '1px solid white',
  overflow: 'auto',
  padding: 8,
  width: 300,
  height: 530
});

const GetDescription = (itemID) => {
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
        allHighlightedItems[i].style.fontWeight = 'bold';
        allHighlightedItems[i].style.fontSize = '15px';
        allHighlightedItems[i].style.textTransform = 'uppercase';
      }
    }
  }
}

const ToggleAll = (itemID) => {

  let allDescItems = document.getElementsByClassName('desc');
  let allExpandItems = document.getElementsByClassName('expand');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  let allEditItems = document.getElementsByClassName('EditItem');
  let toggleThis;
  for (let i = 0; i < allDescItems.length; i++) {
    if ( allDescItems[i].id == itemID ) {
      toggleThis = allDescItems[i];
        toggleThis.style.display = 'block';
        allEditItems[i].style.display = 'none';
        allExpandItems[i].style.display = 'none';
        allHighlightedItems[i].style.fontWeight = 'bold';
        allHighlightedItems[i].style.fontSize = '15px';
        allHighlightedItems[i].style.textTransform = 'uppercase';
    }
  }
}

const ToggleOff = (itemID) => {

  let allDescItems = document.getElementsByClassName('desc');
  let allExpandItems = document.getElementsByClassName('expand');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
  let allEditItems = document.getElementsByClassName('EditItem');
  let toggleThis;
  for (let i = 0; i < allDescItems.length; i++) {
    if ( allDescItems[i].id == itemID ) {
      toggleThis = allDescItems[i];
      toggleThis.style.display = 'none';
        allEditItems[i].style.display = 'none';
        allExpandItems[i].style.display = 'block';
        allHighlightedItems[i].style.fontWeight = 'normal';
        allHighlightedItems[i].style.fontSize = '14px';
        allHighlightedItems[i].style.textTransform = 'none';
    }
  }
}

const ToggleEdit = (itemID) => {
  
  let allEditItems = document.getElementsByClassName('EditItem');
  let allExpandItems = document.getElementsByClassName('expand');
  let allDescItems = document.getElementsByClassName('desc');
  let allHighlightedItems = document.getElementsByClassName('isHighlighted');
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
        allHighlightedItems[i].style.fontWeight = 'bold';
        allHighlightedItems[i].style.fontSize = '15px';
        allHighlightedItems[i].style.textTransform = 'uppercase';
      }
    }
  }
}

const mapStateToProps = state => {
  return {
    items: state
  }
}

export default connect(mapStateToProps)(App);