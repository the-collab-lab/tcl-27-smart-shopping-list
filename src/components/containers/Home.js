import React, { Component } from 'react';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: '',
    };
  }

  handleChange = (e) => {
    this.setState({
      token: e.target.value,
    });
  };

  handleClick = (e) => {
    e.preventDefault();
    console.log(this.state.token);
  };

  render() {
    return (
      <div>
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
