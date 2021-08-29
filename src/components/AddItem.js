import React from 'react';
import { fb } from '../lib/firebase';
import firebase from 'firebase/app';
import DatePicker from 'react-datepicker';
import BottomNav from './BottomNav';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';
import Form from 'react-bootstrap/Form';
import UserToken from './UserToken';

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
          let numberOfPurchases = 0;
          if (this.state.lastPurchase) {
            numberOfPurchases = 1;
          }

          const ref = fb
            .firestore()
            .collection('groceries')
            .doc(localStorage.getItem('token'))
            .set({
              userToken: localStorage.getItem('token'),
            });

          const nextPurchaseDate = (days) =>
            new Date(Date.now() + days * 24 * 60 * 60 * 1000);

          const updateItems = fb
            .firestore()
            .collection('groceries')
            .doc(localStorage.getItem('token'))
            .collection('items')
            .doc(this.state.itemName)
            .set(
              {
                dateAdded: firebase.firestore.FieldValue.serverTimestamp(),
                itemName: this.state.itemName,
                estimatedFrequency: Number(this.state.frequency),
                lastPurchase: this.state.lastPurchase,
                purchased: false,
                numberOfPurchases: numberOfPurchases,
                nextPurchaseDate: nextPurchaseDate(
                  Number(this.state.frequency),
                ),
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
      <Container>
        <Form onSubmit={this.submitHandler}>
          <h1>Item </h1>
          <Form.Group>
            <Form.Label htmlFor="item-name">Please enter an item:</Form.Label>
            <FormControl
              type="text"
              id="item-name"
              name="itemName"
              onChange={this.changeHandler}
              value={this.state.itemName}
              placeholder="Item name..."
            />
            <div style={{ fontsize: 12, color: 'red' }}>
              {this.state.itemNameError}
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="frequency">
              When will you need to buy this item next?
            </Form.Label>
            <div style={{ fontsize: 12, color: 'red' }}>
              {this.state.frequencyError}
            </div>
            <div>
              <Form.Check.Label htmlFor="soon">Soon</Form.Check.Label>
              <Form.Check
                type="radio"
                name="frequency"
                id="soon"
                value="7"
                checked={this.state.frequency === '7'}
                onChange={this.changeHandler}
              />
              <Form.Check.Label htmlFor="kind-of-soon">
                Kind of soon
              </Form.Check.Label>
              <Form.Check
                type="radio"
                name="frequency"
                id="kind-of-soon"
                value="14"
                checked={this.state.frequency === '14'}
                onChange={this.changeHandler}
              />
              <Form.Check.Label htmlFor="not-soon">Not Soon</Form.Check.Label>
              <Form.Check
                type="radio"
                name="frequency"
                id="not-soon"
                value="30"
                checked={this.state.frequency === '30'}
                onChange={this.changeHandler}
              />
            </div>
          </Form.Group>

          <Form.Group>
            <Form.Label htmlFor="last-purchase">Last purchase:</Form.Label>
            <DatePicker
              id="last-purchase"
              placeholderText="Click to select a date"
              selected={this.state.lastPurchase}
              onChange={(date) => this.setState({ lastPurchase: date })}
              isClearable
              popperPlacement="bottom"
            />
            <br />
            <button type="submit">Submit</button>
          </Form.Group>
        </Form>

        <UserToken />
        <BottomNav setLoggedIn={this.props.setLoggedIn} />
      </Container>
    );
  }
}

export default AddItem;
