import React, { Component } from 'react';
import './ItemForm.css';
// import { format } from 'path';
import { connect } from 'react-redux';
import { addItem } from './actions/actions.js';

class ItemForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      task: null,
      description: null,
      type: 'Todo'
    }
  }

  handleSubmit = (e) => {
    // e.preventDefault();
    // this.props.addItem(this.state)

    e.preventDefault()
    console.log('SUBMITTED!!!!', this.state);
    this.props.dispatch(addItem(this.state));
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
      <div className="ActionItem" action="/" method="post">
      <form onSubmit={this.handleSubmit}>
        <label> Task:
          <input onChange={this.handleChange} name="task" type="text"/>
        </label> 
        <label> Description:
          <input onChange={this.handleChange} name="description" type="text"/>
        </label>
        <label> Priority:
          <input onChange={this.handleChange} name="priority" type="text"/>
        </label>
        <label> Type:
          <select onChange={this.handleChange} name="type">
            <option name="todo" value="Todo">To-do</option>
            <option name="doing" value="Doing">Doing</option>
            <option name="done" value="Done">Done</option>
          </select>
        </label>
        <input type="submit" value="Submit"/>
      </form>
      </div>
    )
  }
}

export default connect()(ItemForm)