import React, { useState, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import firebase from 'firebase/app';
import { useCollection } from 'react-firebase-hooks/firestore';
import 'firebase/firestore';
import getToken from './lib/tokens';
import Home from './components/containers/Home';
import GroceryContainer from './components/containers/GroceryContainer';
import AddItem from './components/AddItem';
import { fb } from './lib/firebase';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (localStorage.getItem('token')) {
        return setLoggedIn(true);
      }
    }
    return () => {
      isMounted = false;
    };
  }, []);

  const handleClick = () => {
    const token = getToken();
    localStorage.setItem('token', token);
    setLoggedIn(true);

    if (localStorage.getItem('token')) {
      const ref = fb
        .firestore()
        .collection('groceries')
        .doc(localStorage.getItem('token'))
        .set({
          userToken: localStorage.getItem('token'),
        });
    } else {
    }
  };

  return (
    <div className="App">
      <Switch>
        <Route exact path="/">
          {loggedIn ? (
            <Redirect to="/list" />
          ) : (
            <Home setLoggedIn={setLoggedIn} handleClick={handleClick} />
          )}
        </Route>

        <Route exact path="/list">
          {loggedIn ? (
            <GroceryContainer setLoggedIn={setLoggedIn} />
          ) : (
            <Redirect to="/" />
          )}
        </Route>

        <Route exact path="/add-an-item">
          {loggedIn ? (
            <AddItem setLoggedIn={setLoggedIn} />
          ) : (
            <Redirect to="/" />
          )}
        </Route>
      </Switch>
    </div>
  );
}

export default App;
