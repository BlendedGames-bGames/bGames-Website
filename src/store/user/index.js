import firebase from '@/firebase';
import Axios from 'axios';
import router from '../../router/index';

const state = {
  userProfile: {},
  loggedIn: false,
  userCreatedAlready:false,
  userURL: 'http://144.126.216.255',
  userPort: '3010'
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
      const user = await firebase.auth().signInWithPopup(provider);
      console.log(user)
      
      if(user.additionalUserInfo.isNewUser){
        let profile = {
          "name": user.additionalUserInfo.profile.name,
          "email": user.additionalUserInfo.profile.email,
          "external_type": user.additionalUserInfo.providerId,
          "external_id":user.user.uid
        }
        try {
          const MEDIUM_POST_URL = state.userURL+':'+state.userPort+'/player'
          await Axios.post(MEDIUM_POST_URL, profile);
          router.replace({name:'dashboard'})      


        } catch (error) {
          console.log(error)
        }

        
      }
      else{
        router.replace({name:'dashboard'})      

      }

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
        const user = await firebase.auth().createUserWithEmailAndPassword(profile.email,profile.password)
        console.log(user)
        router.replace({name:'dashboard'})

         if(user.additionalUserInfo.isNewUser){
          //Name of the user (before the @)
          const searchTerm = '@'
          const searchIndex = user.user.email.lastIndexOf(searchTerm)
          const name = user.user.email.slice(0,searchIndex)
          let profile = {
            "name": name,
            "email": user.user.email,
            "password": user.additionalUserInfo.providerId,
            "external_type": 'firebase.com',
            "external_id":user.user.uid
          }
          try {
            const MEDIUM_POST_URL = state.userURL+':'+state.userPort+'/player'
            await Axios.post(MEDIUM_POST_URL, profile);
            router.replace({name:'dashboard'})      
  
  
          } catch (error) {
            console.log(error)
          }
  
          
        }
        else{
           router.replace({name:'dashboard'})
        }
        
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