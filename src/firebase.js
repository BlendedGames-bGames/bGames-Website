import firebase from 'firebase/compat/app';  // 'compat' es necesario para versiones que admiten compatibilidad con versiones anteriores
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyALPCI-JMF4r_03rCfCI27NX6OQoKdoLYg",
  authDomain: "bgames-b350b.firebaseapp.com",
  databaseURL: "https://bgames-b350b-default-rtdb.firebaseio.com",
  projectId: "bgames-b350b",
  storageBucket: "bgames-b350b.appspot.com",
  messagingSenderId: "177045556100",
  appId: "1:177045556100:web:11cb02ffacf7af743febd1",
  measurementId: "G-F0JLD1DH63"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

firebase.auth();

export default firebase;
