import React, { Component } from 'react';
import './App.css';
import { getItemsFromFakeXHR, addItemToFakeXHR, deleteItemByIdFromFakeXHR } from './db/inventory.db';
import ItemForm from './ItemForm';
import Card from './Card';
import HTML5Backend from 'react-dnd-html5-backend'
import { DragDropContext } from 'react-dnd'
const update = require('immutability-helper');

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      items: [],
      cards: [
        {
          id: 1,
          text: 'Write a cool JS library',
        },
        {
          id: 2,
          text: 'Make it generic enough',
        },
        {
          id: 3,
          text: 'Write README',
        },
        {
          id: 4,
          text: 'Create some examples',
        },
        {
          id: 5,
          text:
            'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
        },
        {
          id: 6,
          text: '???',
        },
        {
          id: 7,
          text: 'PROFIT',
        },
        {
          id: 8,
          text: 'Write a cool JS library',
        },
        {
          id: 9,
          text: 'Make it generic enough',
        },
        {
          id: 10,
          text: 'Write README',
        },
        {
          id: 11,
          text: 'Create some examples',
        },
        {
          id: 12,
          text:
            'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
        },
        {
          id: 13,
          text: '???',
        },
        {
          id: 14,
          text: 'PROFIT',
        },
        {
          id: 15,
          text: 'Write a cool JS library',
        },
        {
          id: 16,
          text: 'Make it generic enough',
        },
        {
          id: 17,
          text: 'Write README',
        },
        {
          id: 18,
          text: 'Create some examples',
        },
        {
          id: 19,
          text:
            'Spam in Twitter and IRC to promote it (note that this element is taller than the others)',
        },
        {
          id: 20,
          text: '???',
        },
        {
          id: 21,
          text: 'PROFIT',
        }
      ]
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

  moveCard = (dragIndex, hoverIndex) => {
    const { cards } = this.state
    const dragCard = cards[dragIndex]

    this.setState(
      update(this.state, {
        cards: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        },
      }),
    )
  }


  render() {
    const { items } = this.state

    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Reack Attak</h1>
        </header>
        <div className="App-content">
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
        <div className="card-container">
      {this.state.cards.map((card, i) => (
        <Card
          key={card.id}
          index={i}
          id={card.id}
          text={card.text}
          moveCard={this.moveCard}
        />
      ))}
    </div>
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

export default DragDropContext(HTML5Backend)(App);