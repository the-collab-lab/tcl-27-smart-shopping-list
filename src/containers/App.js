import React, { Component } from 'react';
import { Route, Switch } from 'react-router-dom';
import '../App.css';
import List from './List';
import AddItem from '../components/AddItem';
import BottomNav from '../components/BottomNav';

class App extends Component {
  render() {
    return (
      <div className="App">
        <BottomNav />
        <Switch>
          <Route path="/list" component={List}></Route>
          <Route path="/add-an-item" component={AddItem}></Route>
        </Switch>
      </div>
    );
  }
}

export default App;
