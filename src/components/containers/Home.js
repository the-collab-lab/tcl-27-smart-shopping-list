import React, { Component } from 'react';
import { fb } from '../../lib/firebase';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import FormControl from 'react-bootstrap/FormControl';
import MaterialIcon, { flutter_dash } from 'material-icons-react';
import Alert from '../Alert';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      tokens: [],
      successModal: false,
    };
  }

  ref = fb.firestore().collection('groceries');

  componentDidMount() {
    this.getTokens();
  }

  getTokens = () => {
    const tokens = [];
    this.ref.onSnapshot((querySnapshot) => {
      querySnapshot.forEach((item) => {
        tokens.push(item.data().userToken);
      });
      this.setState({
        tokens: tokens,
      });
    });
  };

  handleChange = (e) => {
    this.setState({
      token: e.target.value,
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    if (this.state.tokens.includes(this.state.token.trim())) {
      localStorage.setItem('token', this.state.token.trim());
      this.props.setLoggedIn(true);
      this.setState({
        token: '',
      });
    } else {
      this.setState({
        successModal: true,
        alertPrompt: 'Sorry, token not found. Try again or create a new list.',
      });
      setTimeout(() => {
        return this.setState({
          successModal: false,
        });
      }, 2000);
    }
  };

  render() {
    return (
      <main>
        <MaterialIcon icon="flutter_dash" id="largeLogo" />
        <h4>
          <b>Welcome to WootWoot!</b>
        </h4>
        <br />
        <p>
          <label htmlFor="token">Please enter an existing list token:</label>
        </p>
        <InputGroup className="mb-3" id="home-input-token">
          <FormControl
            type="text"
            id="token"
            onChange={this.handleChange}
            value={this.state.token}
            placeholder="Please enter an existing list token..."
          />
          <Button
            variant="outline-info"
            type="submit"
            name="submit"
            value="submit"
            onClick={(e) => this.handleClick(e)}
          >
            Submit
          </Button>
        </InputGroup>
        <br />

        <p>Or create a new shopping list:</p>
        <Button variant="outline-info" onClick={this.props.handleClick}>
          Create List...
        </Button>

        <Alert
          show={this.state.successModal}
          onHide={() => this.setState({ successModal: false })}
          alertPrompt={this.state.alertPrompt}
        />
      </main>
    );
  }
}

export default Home;
