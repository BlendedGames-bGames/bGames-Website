import firebase from '@/firebase';
import router from '../../router/index';

const state = {
  userProfile: {},
  loggedIn: false,
  userCreatedAlready:false
};

const getters = {
  userProfile: ({userProfile}) => userProfile,
  loggedIn: ({loggedIn}) => loggedIn,
  userCreatedAlready: ({userCreatedAlready}) => userCreatedAlready

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
  },
  USER_CREATED_ALREADY_TOGGLE(state) {
    state.userCreatedAlready = !state.userCreatedAlready;
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
        await firebase.auth().signInWithEmailAndPassword(profile.email,profile.password)
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
        await firebase.auth().createUserWithEmailAndPassword(profile.email,profile.password)
        router.replace({name:'dashboard'})
    } catch (error) {
        console.log(error)
        commit('USER_CREATED_ALREADY_TOGGLE')

    }
  },
  userCreatedAlreadyToggle({ commit, state }, payload) {
    commit('USER_CREATED_ALREADY_TOGGLE')

   }

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};