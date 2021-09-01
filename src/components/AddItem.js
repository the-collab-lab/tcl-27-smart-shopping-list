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
import Alert from './Alert';

const initialState = {
  itemName: '',
  frequency: '',
  lastPurchase: null,
  id: '',
  userToken: '',
  itemNameError: '',
  frequencyError: '',
  successModal: false,
  alertPrompt: '',
  loading: true,
};

class AddItem extends React.Component {
  constructor(props) {
    super(props);
    this.state = initialState;
  }

  componentDidMount() {
    this.setState({
      loading: false,
    });
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
              this.setState({
                successModal: true,
                alertPrompt: 'has been added!',
              });
              event.target.reset();
            })
            .then(() => {
              setTimeout(() => {
                return this.setState({
                  itemName: '',
                  frequency: '',
                  lastPurchase: null,
                  itemNameError: '',
                  frequencyError: '',
                  successModal: false,
                });
              }, 2000);
            });
        } else {
          this.setState({
            successModal: true,
            alertPrompt: 'already exists!',
          });
          setTimeout(() => {
            return this.setState({
              successModal: false,
            });
          }, 2000);
        }
      });
    }
  };

  changeHandler = (event) => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    if (this.state.loading == true) {
      return <div>Loading...</div>;
    } else {
      return (
        <div>
          <UserToken />
          <Form onSubmit={(e) => this.submitHandler(e)}>
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
              <div style={{ fontsize: 12, color: 'red' }}>
                {this.state.frequencyError}
              </div>
              <div>
                <Form.Select
                  aria-label="next-purchase-selection"
                  className="frequency-select"
                  name="frequency"
                  onChange={this.changeHandler}
                  value={this.state.value}
                >
                  <option value="">
                    When do you need to purchase this item next?
                  </option>
                  <option value="7">Soon</option>
                  <option value="14">Kind of Soon</option>
                  <option value="30">Not Soon</option>
                </Form.Select>
              </div>
            </Form.Group>

            <Form.Group className="lastPurchase">
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
              <Button size="md" type="submit" variant="outline-info">
                Submit
              </Button>
            </Form.Group>
          </Form>

          <Alert
            show={this.state.successModal}
            onHide={() => this.setState({ successModal: false })}
            itemName={this.state.itemName}
            alertPrompt={this.state.alertPrompt}
          />

          <BottomNav setLoggedIn={this.props.setLoggedIn} />
        </div>
      );
    }
  }
}

export default AddItem;
