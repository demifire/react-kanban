import React, { Component } from 'react';
import './ItemForm.css';
// import { format } from 'path';

class ItemForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: null,
      weight: null,
      type: null
    }
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.props.addItem(this.state)
  }

  handleChange = (e) => {
    const target = e.target
    const value = target.value;
    const name = target.name;
    console.log('value', value)
    console.log('name', name)
    this.setState( {
      [name] : value
    }, () => {
      console.log('state', this.state)
    })
  }

  render() {
    return (
      <div className="Item">
      <form onSubmit={this.handleSubmit}>
        <label> Name:
          <input onChange={this.handleChange} name="name" type="text"/>
        </label> 
        <label> Weight:
          <input onChange={this.handleChange} name="weight" type="text"/>
        </label>
        <label> Type:
          <select onChange={this.handleChange} name="type">
            <option value="To-do">Consumable</option>
            <option value="Doing">Weapon</option>
            <option value="Done">Armor</option>
          </select>
        </label>
        <input type="submit" value="Submit"/>
      </form>
      </div>
    )
  }
}

export default ItemForm