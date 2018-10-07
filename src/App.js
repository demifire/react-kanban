import React, { Component } from 'react';
import './App.css';
import { getItemsFromFakeXHR, addItemToFakeXHR, deleteItemByIdFromFakeXHR } from './db/inventory.db';
import { getTodoFromFakeXHR, addTodoToFakeXHR, deleteTodoByIdFromFakeXHR } from './db/todo.db';
import ItemForm from './ItemForm';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      todo: []
    }
    this.addItem = this.addItem.bind(this);
    this.updateStateFromDb = this.updateStateFromDb.bind(this);
    this.deleteItemById= this.deleteItemById.bind(this);
    this.addTodo = this.addTodo.bind(this);
    this.updateTodoFromDb = this.updateTodoFromDb.bind(this);
    this.deleteTodoById= this.deleteTodoById.bind(this);
  }

  componentDidMount() {
    this.updateStateFromDb();
    this.updateTodoFromDb();
  }

  updateStateFromDb() {
    getItemsFromFakeXHR()
      .then( items => {
        this.setState({items}, () => {
          console.log('this.state', this.state)
        })
      })
  }

  addItem(item) {
    addItemToFakeXHR(item)
    .then( items => {
      this.setState( {items })
    })
  }

  deleteItemById(itemId) {
    console.log('BALETED')
    deleteItemByIdFromFakeXHR(itemId)
    .then( result => {
      this.updateStateFromDb()
    })
  }

  updateTodoFromDb() {
    getTodoFromFakeXHR()
      .then( todo => {
        this.setState({todo}, () => {
          console.log('this.state', this.state)
        })
      })
  }

  addTodo(todo) {
    addTodoToFakeXHR(todo)
    .then( todo => {
      this.setState( {todo })
    })
  }

  deleteTodoById(todoId) {
    console.log('BALETED')
    deleteTodoByIdFromFakeXHR(todoId)
    .then( result => {
      this.updateTodoFromDb()
    })
  }

  render() {
    const { items } = this.state
    const { todo } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">React Kaban</h1>
        </header>
        <div id="App-content">
        <ul>
        <h1 className="myh1">To do</h1>
          <ItemsList deleteItemById={this.deleteItemById} items={items}/>
        </ul>
        <ul>
        <h1 className="myh1">Doing</h1>
          <TodoList deleteTodoById={this.deleteTodoById} todo={todo}/>
          {/* <ItemsList deleteItemById={this.deleteItemById} items={items}/> */}
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

function ItemsList(props) {
  return props.items.filter(item => item.type === 'To-do').map( item => <li onClick={ () => props.deleteItemById(item.id)}>{item.name}</li> )
}

function TodoList(props) {
  return props.todo.map( todo => <li onClick={ () => props.deleteTodoById(todo.id)}>{todo.name}</li> )
}

function DoneList(props) {
  return props.items.filter(item => item.type === 'Done').map( todo => <li onClick={ () => props.deleteTodoById(todo.id)}>{todo.name}</li> )
}


export default App;