// NOTE: import only the Firebase modules that you need in your app... except
// for the second line, which makes both the linter and react-firebase happy
import firebase from 'firebase/app';
import 'firebase/firestore';

// Initalize Firebase.
var firebaseConfig = {
  apiKey: "AIzaSyB9-K-FKVH2s-dGBLKpXKX-kfE4hENprak",
  authDomain: "tcl-27-shopping-list.firebaseapp.com",
  projectId: "tcl-27-shopping-list",
  storageBucket: "tcl-27-shopping-list.appspot.com",
  messagingSenderId: "467906502054",
  appId: "1:467906502054:web:dd45ccdf5ec94fd2f54367"
};

let fb = firebase.initializeApp(firebaseConfig);

export { fb };
