import React from 'react';
import { fb } from '../lib/firebase';
import DatePicker from 'react-datepicker';
import BottomNav from './BottomNav';

const initialState = {
  itemName: '',
  frequency: '',
  lastPurchase: null,
  id: '',
  userToken: '',
  itemNameError: '',
  frequencyError: '',
};

class AddItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  validate = () => {
    let itemNameError = '';
    let frequencyError = '';
    if (!this.state.itemName) {
      itemNameError = 'Name needs to exist';
    }
    if (!this.state.frequency) {
      frequencyError = 'Please pick when you will need to buy next';
    }
    if (itemNameError || frequencyError) {
      this.setState({ itemNameError, frequencyError });
      return false;
    }
    return true;
  };

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
          .replace(/[^a-zA-Z]/g, ''),
      );

      const userInput = this.state.itemName
        .toLowerCase()
        .replace(/[^a-zA-Z]/g, '');

      return items.includes(userInput);
    });
  };

  submitHandler = (event) => {
    event.preventDefault();
    if (this.validate()) {
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
                purchased: false,
              },
              { merge: true },
            )
            .then(() => {
              alert('Successfully added ' + this.state.itemName);
              this.setState({
                itemName: '',
                frequency: '',
                lastPurchase: null,
                itemNameError: '',
                frequencyError: '',
              });
            });
        } else {
          alert('ITEM ALREADY EXISTS!');
        }
      });
    }
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
          onChange={this.changeHandler}
          value={this.state.itemName}
          placeholder="Item name..."
        />
        <div style={{ fontsize: 12, color: 'red' }}>
          {this.state.itemNameError}
        </div>
        <p>When will you need to buy this item next?</p>
        <div style={{ fontsize: 12, color: 'red' }}>
          {this.state.frequencyError}
        </div>
        <div>
          <p>Soon</p>
          <input
            type="radio"
            name="frequency"
            value="7"
            checked={this.state.frequency === '7'}
            onChange={this.changeHandler}
          />
          <p>Kind of soon</p>
          <input
            type="radio"
            name="frequency"
            value="14"
            checked={this.state.frequency === '14'}
            onChange={this.changeHandler}
          />
          <p>Not Soon</p>
          <input
            type="radio"
            name="frequency"
            value="30"
            checked={this.state.frequency === '30'}
            onChange={this.changeHandler}
          />
        </div>

        <p>Last purchase:</p>
        <DatePicker
          placeholderText="Click to select a date"
          selected={this.state.lastPurchase}
          onChange={(date) => this.setState({ lastPurchase: date })}
          isClearable
          popperPlacement="bottom"
        />
        <br />
        <button type="submit">Submit</button>
        <BottomNav />
      </form>
    );
  }
}

export default AddItem;
