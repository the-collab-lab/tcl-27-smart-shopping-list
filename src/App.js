import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import firebase from 'firebase/app';
import { useCollection } from 'react-firebase-hooks/firestore';
import 'firebase/firestore';
import getToken from './lib/tokens';

import GroceryContainer from './components/containers/GroceryContainer';
import List from './components/containers/List';
import AddItem from './components/AddItem';
import BottomNav from './components/BottomNav';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      return setLoggedIn(true);
    }
  });

  const handleClick = () => {
    const token = getToken();
    localStorage.setItem('token', token);
    setLoggedIn(true);
  };

  return (
    <div className="App">
      <GroceryContainer />
      <BottomNav />
      <Switch>
        <Route exact path="/">
          {loggedIn ? <Redirect to="/list" /> : null}
        </Route>

        <Route path="/list" component={List}></Route>
        <Route path="/add-an-item" component={AddItem}></Route>
      </Switch>

      <button onClick={handleClick}>Create List...</button>
    </div>
  );
}

export default App;
