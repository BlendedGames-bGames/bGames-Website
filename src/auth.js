import store from './store';
import router from './router';
import firebase from 'firebase/app'

// https://firebase.google.com/docs/auth/web/manage-users
firebase.auth().onAuthStateChanged(function(user) {
  const isAuthenticated = firebase.auth().currentUser
  console.log(isAuthenticated)
  console.log(user)
  console.log(typeof(window.localStorage.getItem('previousAuthentication')))

  if (user) {
    
    console.log('entre con el user: ', user)
    store.commit(`user/USER_DETAILS`, user);
    if(window.localStorage.getItem('previousAuthentication') === 'null'){
      console.log("sdasaddsaads")
      console.log(window.localStorage.getItem('previousRoute'))
      if(window.localStorage.getItem('previousRoute') !== '/login'){
        router.push({ path: window.localStorage.getItem('previousRoute') })

      }
      else{
        router.push({ path: '/dashboard'})

      }
    }
    
  } else {
    store.commit(`user/LOGOUT`);
  }
});