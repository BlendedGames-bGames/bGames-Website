import store from './store';
import router from './router';
import firebase from 'firebase/app'

// https://firebase.google.com/docs/auth/web/manage-users
firebase.auth().onAuthStateChanged(function(user) {
  const isAuthenticated = firebase.auth().currentUser
  console.log(isAuthenticated)
  console.log(user)

  if (user) {
    console.log('entre con el user: ', user)
    window.localStorage.setItem('user',user)
    store.commit(`user/USER_DETAILS`, user);
    
  } else {
    store.commit(`user/LOGOUT`);
  }
});