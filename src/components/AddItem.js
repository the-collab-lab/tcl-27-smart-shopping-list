import React from 'react';
import GroceryContainer from './containers/GroceryContainer';
import { fb } from '../lib/firebase';

class AddItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      itemName: '',
      frequency: '',
      lastPurchase: null,
      id: '',
      userToken: '',
    };
  }

  submitHandler = (event) => {
    event.preventDefault();
    if (localStorage) {
      const ref = fb
        .firestore()
        .collection('groceries')
        .doc(localStorage.getItem('token'))
        .set({
          userToken: localStorage.getItem('token'),
        });

      const updateItems = fb
        .firestore()
        .collection('groceries')
        .doc(localStorage.getItem('token'))
        .collection('items')
        .doc(this.state.itemName)
        .set(
          {
            itemName: this.state.itemName,
            frequency: this.state.frequency,
            lastPurchase: this.state.lastPurchase,
          },
          { merge: true },
        );
    } else {
    }

    alert('Successfully added ' + this.state.itemName);
  };
  changeHandler = (event) => {
    let nam = event.target.name;
    let val = event.target.value;
    this.setState({ [nam]: val });
  };
  render() {
    return (
      <form onSubmit={this.submitHandler}>
        <h1>Item </h1>
        <p>Please enter an item:</p>
        <input type="text" name="itemName" onChange={this.changeHandler} />
        <p>When will you need to buy this item next?</p>
        <div>
          <p>Soon</p>
          <input
            type="radio"
            name="frequency"
            value="7"
            onChange={this.changeHandler}
          />
          <p>Kind of soon</p>
          <input
            type="radio"
            name="frequency"
            value="14"
            onChange={this.changeHandler}
          />
          <p>Not Soon</p>
          <input
            type="radio"
            name="frequency"
            value="30"
            onChange={this.changeHandler}
          />
        </div>
        <p>Last purchase:</p>
        <input
          type="datetime"
          name="lastPurchase"
          onChange={this.changeHandler}
        />
        <br />
        <button type="submit">Submit</button>
      </form>
    );
  }
}

export default AddItem;
