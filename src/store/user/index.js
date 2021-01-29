import firebase from '@/firebase';
import router from '/mnt/wsl/microservices/bGames-Website/src/router';

const state = {
  userProfile: {},
  loggedIn: false
};

const getters = {
  userProfile: ({userProfile}) => userProfile,
  loggedIn: ({loggedIn}) => loggedIn
};

const mutations = {
  USER_DETAILS(state, userProfile) {
    state.loggedIn = true;    
    state.userProfile = {
      name: userProfile.displayName,
      picture: userProfile.photoURL
    };
  },
  LOGOUT(state) {
    state.loggedIn = false;
    state.userProfile = {};
  }
};

const actions = {
  async loginProvider({ commit, state }, profile) {

    if (state.loggedIn)
      return;

    let provider;
    switch (profile.provider) {
      case 'Google':
        provider = new firebase.auth.GoogleAuthProvider();

        break;
      case 'Facebook':
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      
      default:
        break;
    }    
    try {
      await firebase.auth().signInWithPopup(provider);
      router.replace({name:'dashboard'})      

    } catch(error) {
      console.log(error);
    }
  },
  async loginEmailAndPassword({ commit, state }, profile) {

    if (state.loggedIn)
      return;

    try {
        console.log(profile)
        const val = firebase.auth().signInWithEmailAndPassword(profile.email,profile.password)
        router.replace({name:'dashboard'})


    } catch (error) {
            console.log(error)
    }
  },

  async logout() {
    try {
      await firebase.auth().signOut();
      router.replace({name:'login'})

    } catch(error) {
      console.log(error);
    }
  },
  async register({ commit, state }, profile) {
    try {
        const user = firebase.auth().createUserWithEmailAndPassword(profile.email,profile.password)
        router.replace({name:'dashboard'})

        console.log(user)
    } catch (error) {
        console.log(error)
    }
  },

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};