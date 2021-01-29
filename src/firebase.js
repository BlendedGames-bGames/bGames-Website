import firebase from '@firebase/app';
import '@firebase/auth';
import '@firebase/firestore';

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyAm38vm2k27gMXPSLjH_PNQ-8QoHsxjWng",
    authDomain: "blended-games-cc73b.firebaseapp.com",
    projectId: "blended-games-cc73b",
    storageBucket: "blended-games-cc73b.appspot.com",
    messagingSenderId: "681561900800",
    appId: "1:681561900800:web:caf3e8fe64b7759fd6d5e5",
    measurementId: "G-JPLNHQZ6M2"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
  
export default firebase;

//https://firebase.google.com/docs/firestore/security/get-started#auth-required