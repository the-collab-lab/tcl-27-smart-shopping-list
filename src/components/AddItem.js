import React from 'react';
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

  // CHECKS FOR DUPLICATE ITEMS
  //  async - CONVERTS FUNCTION INTO AN ASYNCRONOUS FUNCTION
  isDuplicateItem = async () => {
    const groceriesRef = fb
      .firestore()
      .collection('groceries')
      .doc(localStorage.getItem('token'))
      .collection('items');

    // GETS GROCERIES AND FORMATS ITEMS FROM DB FOR COMPARISON
    //  await - PAUSES CODE UNTIL THE PROMISE FULFILLS
    return await groceriesRef.get().then((item) => {
      const items = item.docs.map((doc) =>
        doc
          .data()
          .itemName.toLowerCase()
          .replace(/[ *.,@#!$%&;:{}=\-_`~()]/g, ''),
      );

      const userInput = this.state.itemName
        .toLowerCase()
        .replace(/[ *.,@#!$%&;:{}=\-_`~()]/g, '');

      return items.includes(userInput);
    });
  };

  submitHandler = (event) => {
    event.preventDefault();

    // USING .then TO GET A RETURN VALUE FROM FULFILLED PROMISE
    this.isDuplicateItem().then((duplicate) => {
      if (localStorage && !duplicate) {
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
          )
          .then(() => {
            alert('Successfully added ' + this.state.itemName);
            this.setState({
              itemName: '',
              frequency: '',
              lastPurchase: null,
            });
          });
      } else {
        alert('ITEM ALREADY EXISTS!');
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
        <input
          type="text"
          name="itemName"
          value={this.state.itemName}
          onChange={this.changeHandler}
        />
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
