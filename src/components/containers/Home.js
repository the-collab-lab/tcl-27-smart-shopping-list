import React, { Component } from 'react';
import { fb } from '../../lib/firebase';
import Button from 'react-bootstrap/Button';
import InputGroup from 'react-bootstrap/InputGroup';
import Container from 'react-bootstrap/Container';
import FormControl from 'react-bootstrap/FormControl';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
      tokens: [],
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
      alert('Sorry, token not found. Try again or create a new list.');
    }
  };

  render() {
    return (
      <Container>
        <main>
          <h2>Welcome to Woot Woot!</h2>
          <h3>
            Please create a new shopping list or enter a token to join an
            existing list.
          </h3>
          <br />
          <h4>
            <label htmlFor="token">Please enter an existing token:</label>
          </h4>
          <InputGroup className="mb-3">
            <FormControl
              type="text"
              id="token"
              onChange={this.handleChange}
              value={this.state.token}
            />
            <Button
              variant="primary"
              type="submit"
              name="submit"
              value="submit"
              onClick={(e) => this.handleClick(e)}
            >
              Submit
            </Button>
          </InputGroup>
          <br />
          <br />

          <h4>Or create a new shopping list:</h4>
          <Button variant="primary" onClick={this.props.handleClick}>
            Create List...
          </Button>
        </main>
      </Container>
    );
  }
}

export default Home;
