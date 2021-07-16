import React from 'react';
import { Route, Switch } from 'react-router-dom';
import './App.css';
import firebase from 'firebase/app';
import { useCollection } from 'react-firebase-hooks/firestore';
import 'firebase/firestore';
import GroceryContainer from './components/containers/GroceryContainer';
import List from './components/containers/List';
import AddItem from './components/AddItem';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <div className="App">
      <GroceryContainer />
      <BottomNav />
      <Switch>
        <Route path="/list" component={List}></Route>
        <Route path="/add-an-item" component={AddItem}></Route>
      </Switch>
    </div>
  );
}

export default App;
