import React, { useEffect, useState } from 'react';
import './App.css';
import firebase from 'firebase/app';
import { fb } from './lib/firebase';
import { useCollection } from 'react-firebase-hooks/firestore';
import 'firebase/firestore';
// running into error with importing GroceryComponent
// import { GroceryComponent } from './components/GroceryComponent';

function App() {
  const [grocery, setGrocery] = useState([]);
  const [loading, setLoading] = useState(false);

  const ref = fb.firestore().collection('groceries');

  useEffect(() => {
    getGroceries();
  }, []);

  const getGroceries = () => {
    ref.onSnapshot((querySnapshot) => {
      const groceries = [];
      querySnapshot.forEach((item) => {
        groceries.push(item.data());
      });
      setGrocery(groceries);
    });
  };

  const postItem = (item) => {
    ref
      .doc(item.id)
      .set(item)
      .catch((err) => {
        console.error(err);
      });
  };

  console.log(grocery);
  return (
    <div className="App">
      TEST GROCERIES
      {/* <form>
        <input onChange={handleChange} ></input>
      </form> */}
      <br />
      <button onClick={() => postItem({ item: 'bananas', quantity: 10 })}>
        submit an item...
      </button>
      <ul>
        {grocery.map((g) => (
          <li key={g.id}>
            Item: {g.item}
            <br />
            Quantity: {g.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
