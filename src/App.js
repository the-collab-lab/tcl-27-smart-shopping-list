import React from 'react';
import './App.css';
import firebase from 'firebase/app';
import { useCollection } from 'react-firebase-hooks/firestore';
import 'firebase/firestore';
import GroceryContainer from './components/containers/GroceryContainer';

function App() {
  return (
    <div className="App">
      <GroceryContainer />
    </div>
  );
}

export default App;
