import React, { Component } from 'react';
import './ItemForm.css';
// import { format } from 'path';
import { connect } from 'react-redux';
import { editItem } from './actions/actions.js';

class ItemEdit extends Component {
  constructor(props) {
    super(props)
    this.state = {
        id: props.item.id,
      task: null,
      description: null,
      priority: null,
      type: props.item.type,
      sortingid: props.item.sortingid
    }
  }

  handleSubmit = (e) => {
    // e.preventDefault();
    // this.props.addItem(this.state)
    e.preventDefault()
    console.log('SUBMITTED!!!!', this.state);
    this.props.dispatch(editItem(this.state));
    const editform = document.getElementById('editform');
    editform.reset();
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
      <div id={this.state.id} className="EditItem" action="/:id" method="put">
      <form id="editform" className="EditForm" onSubmit={this.handleSubmit}>
        <label> Task:
          <input className="input" onChange={this.handleChange} name="task" type="text"/>
        </label> 
        <label> Description:
          <input className="input" onChange={this.handleChange} name="description" type="text"/>
        </label>
        <label> Priority:
          <input className="input" onChange={this.handleChange} name="priority" type="text"/>
        </label>
        <input type="submit" value="Submit"/>
      </form>
      </div>
    )
  }
}

export default connect()(ItemEdit)