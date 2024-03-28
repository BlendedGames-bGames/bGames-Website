import { onAuthStateChanged, getAuth } from 'firebase/auth';
import store from './store';
import router from './router';


// Obtener el objeto Auth
const auth = getAuth();

// Escuchar cambios en el estado de autenticación
onAuthStateChanged(auth, (user) => {
  const isAuthenticated = !!user;
  console.log(isAuthenticated);
  console.log(user);

  if (user) {
    console.log('Entré con el usuario:', user);
    window.localStorage.setItem('user', JSON.stringify(user));
    store.commit(`user/USER_DETAILS`, user);
  } else {
    store.commit(`user/LOGOUT`);
  }
});
