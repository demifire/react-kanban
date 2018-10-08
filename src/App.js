import React, { Component } from 'react';
import './App.css';
import { getItemsFromFakeXHR, addItemToFakeXHR, deleteItemByIdFromFakeXHR } from './db/inventory.db';
import ItemForm from './ItemForm';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
    }
  }

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
        <div id="App-content">
        <ul>
        <h1 className="myh1">To do</h1>
          <TodoList deleteItemById={this.deleteItemById} items={items}/>
        </ul>
        <ul>
        <h1 className="myh1">Doing</h1>
          <DoingList deleteItemById={this.deleteItemById} items={items}/>
        </ul>
        <ul>
        <h1 className="myh1">Done</h1>
          <DoneList deleteItemById={this.deleteItemById} items={items}/>
        </ul>
        </div>
        <ItemForm addItem={this.addItem}/>
      </div>
    );
  }
}

function TodoList(props) {
  return props.items.filter(item => item.type === 'To-do').map( item => <li className="task" onClick={ () => GetDescription(item.id)}>{item.task}<span onClick={ () => props.deleteItemById(item.id)} className="x">x</span><div id={item.id} className="desc">{item.description}</div></li> )
}

function DoingList(props) {
  return props.items.filter(item => item.type === 'Doing').map( item => <li className="task" onClick={ () => GetDescription(item.id)}>{item.task}<span onClick={ () => props.deleteItemById(item.id)} className="x">x</span><div id={item.id} className="desc">{item.description}</div></li> )
}

function DoneList(props) {
  // The original code
  // return props.items.filter(item => item.type === 'Done').map( item => <li onClick={ () => props.deleteItemdoById(item.id)}>{item.task}<span class="x">x</span><div class="desc">{item.description}</div></li> )
  return props.items.filter(item => item.type === 'Done').map( item => <li className="task" onClick={ () => GetDescription(item.id)}>{item.task}<span onClick={ () => props.deleteItemById(item.id)} className="x">x</span><div id={item.id} className="desc">{item.description}</div></li> )
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