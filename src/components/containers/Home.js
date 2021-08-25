import React, { Component } from 'react';
import { fb } from '../../lib/firebase';

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
      <div>
        <p>
          Please create a new shopping list or enter a token to join an existing
          list.
        </p>
        <button onClick={this.props.handleClick}>Create List...</button>
        <br />
        <label htmlFor="token">Enter token:</label>
        <input
          type="text"
          id="token"
          onChange={this.handleChange}
          value={this.state.token}
        />
        <button
          type="submit"
          name="submit"
          value="submit"
          onClick={(e) => this.handleClick(e)}
        >
          Submit
        </button>
      </div>
    );
  }
}

export default Home;
