import React from 'react';
import { fb } from '../lib/firebase';
import uuid from 'react-uuid';

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
    const groceriesRef = fb.firestore().collection('groceries');

    groceriesRef.get().then((item) => {
      const items = item.docs.map((doc) =>
        doc
          .data()
          .itemName.toLowerCase()
          .replace(/[ *.,@#!$%&;:{}=\-_`~()]/g, ''),
      );
      console.log(items);

      const userInput = this.state.itemName
        .toLowerCase()
        .replace(/[ *.,@#!$%&;:{}=\-_`~()]/g, '');
      if (items.includes(userInput)) {
        alert('ITEM ALREADY EXISTS!');
      } else {
        groceriesRef.add({
          itemName: this.state.itemName,
          frequency: this.state.frequency,
          lastPurchase: this.state.lastPurchase,
          id: uuid(),
          userToken: 'josef heron mudd',
        });
        alert('Successfully added ' + this.state.itemName);
      }
    });
  };

  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
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
