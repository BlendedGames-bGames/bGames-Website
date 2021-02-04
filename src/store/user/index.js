import firebase from '@/firebase';
import Axios from 'axios';
import router from '../../router/index';
import Vue from 'vue';
import { baseURL, userPort,getPort } from '../urls'
const state = {
  userProfile: {},
  loggedIn: false,
  userCreatedAlready:false,
  userURL: baseURL+ userPort,
  getURL: baseURL+ getPort,
  id_player:0,
  userLevels: [],
  userDimensionLevels: [],
  dataReady:false
};

const getters = {

  userProfile: ({userProfile}) => userProfile,
  dataReady: ({dataReady}) => dataReady,

  loggedIn: ({loggedIn}) => loggedIn,
  userCreatedAlready: ({userCreatedAlready}) => userCreatedAlready,
  id_player: ({id_player}) => id_player,
  userLevels: ({userLevels}) => userLevels,
  userDimensionLevels: ({userDimensionLevels}) => userDimensionLevels


};

const mutations = {
  TOGGLE_DATA_READY(state){
    state.dataReady = !state.dataReady

  },
  RESET_VARIABLES(state){
    state.id_player = 0
    state.userLevels.splice(0)
    state.userDimensionLevels.splice(0)
    state.userProfile = {}
    state.dataReady = false
    state.loggedIn = false
  },
  SET_ID_PLAYER(state,payload) {
    console.log(payload)
    state.id_player = payload
  },
  USER_DETAILS(state, userProfile) {
    state.loggedIn = true;  
    const searchTerm = '@'
    let name;
    if(userProfile.displayName == undefined){      
      let searchIndex = userProfile.email.lastIndexOf(searchTerm)
      name = userProfile.email.slice(0,searchIndex)
    }
    else{
      name = userProfile.displayName
    }  
    state.userProfile = {
      name: name,
      email: userProfile.email
    };
  },
  LOGOUT(state) {
    state.loggedIn = false;
    state.userProfile = {};
  },
  USER_CREATED_ALREADY_TOGGLE(state) {
    state.userCreatedAlready = !state.userCreatedAlready;
  },
  SET_USER_LEVELS(state,levels) {
    levels.forEach(level => {
      state.userLevels.push(level)
      state.userDimensionLevels.push(level.data)
    });  
  },
  SET_SUBATTRIBUTES_LEVELS(state,payload) {
    let index_dimn
    state.userLevels.forEach((dimensionLevel,index) => {
    
        if(dimensionLevel.id_attributes === payload.id){
            index_dimn = index
        }
    });
    Vue.set(state.userLevels[index_dimn], 'subattribute_levels',payload.subattributes)
  }
};

const actions = {
  async resetVariables({ dispatch, commit, state, rootState  }, email){
    commit('RESET_VARIABLES')
   
  },
  async settingData({ dispatch, commit, state, rootState  }, email){
    await dispatch('attribute/setDimensionsAndSubattributes',null,{root:true})
      
    await dispatch('settingSensorsAndEndpoints',email)
    await dispatch('settingDimensionsLevelsAndSubattributes')
    commit('TOGGLE_DATA_READY')
    router.replace({name:'statistics'})      
  },
  
  async settingSensorsAndEndpoints({ dispatch, commit, state, rootState  }, email){
    const MEDIUM_GET_URL = state.userURL+'/player_by_email/'+email
    const userData = await Axios.get(MEDIUM_GET_URL);
    await dispatch('setIdPlayer', userData.data.id_players)
    //setSensorsAndTemplatesAndEndpoints
    await dispatch('sensor/setSensorsAndTemplatesAndEndpoints', null, { root: true })
    rootState.sensor.sensorsAndEndpoints.forEach(sensor => {
      console.log(sensor)
    });
  },
  async settingSubattributesLevels({ dispatch, commit, state }){
    for (const level of state.userLevels) {      
      await dispatch('settingSingleSubattributeLevel', {id:level.id_attributes} )      
    }
  }, 
  async settingSingleSubattributeLevel({ commit, state }, payload){

    try {
      const MEDIUM_GET_URL = state.getURL+'/id_player/'+state.id_player.toString()+/attributes/+payload.id.toString()+'/subattributes_levels/'
      const reply = await Axios.get(MEDIUM_GET_URL);
      console.log(payload.id)
      commit('SET_SUBATTRIBUTES_LEVELS', {subattributes: reply.data, id:payload.id})
    } catch (error) {
        console.log(error)
    }
  }, 
  async settingDimensionsLevelsAndSubattributes({ dispatch, commit, state }){
      const MEDIUM_GET_URL = state.getURL+'/player_all_attributes/'+state.id_player.toString()
      const userData = await Axios.get(MEDIUM_GET_URL);
      commit('SET_USER_LEVELS', userData.data)
      await dispatch('settingSubattributesLevels', null)
      state.userLevels.forEach(level => {
        console.log(level)
      });
  },  
  async setIdPlayer({ commit }, id) {
    commit('SET_ID_PLAYER',id)
  },
  async loginProvider({ dispatch, state,commit,rootState }, profile) {
    if (state.loggedIn) return;  
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
          const MEDIUM_POST_URL = state.userURL+'/player'
          await Axios.post(MEDIUM_POST_URL, profile);
          await dispatch('attribute/createPlayerLevelRelations',null,{root:true})

        } catch (error) {
          console.log(error)
        }
      }
      dispatch('settingData',user.additionalUserInfo.profile.email)
     
    } catch(error) {
      console.log(error);
    }
  },
  async loginEmailAndPassword({ commit, state, rootState }, profile) {

    if (state.loggedIn)
      return;

    try {
        console.log(profile)
        const user = await firebase.auth().signInWithEmailAndPassword(profile.email,profile.password)
        dispatch('settingData',user.additionalUserInfo.profile.email)

    } catch (error) {
            console.log(error)
    }
  },

  async logout({ dispatch, state,rootState }, profile) {
    try {
      await firebase.auth().signOut();
      await dispatch('resetAllVariables',null,{root:true})
      console.log('paso por aqui')
      router.replace({name:'login'})

    } catch(error) {
      console.log(error);
    }
  },
  async register({ commit, state }, profile) {
    try {
        const user = await firebase.auth().createUserWithEmailAndPassword(profile.email,profile.password)
        console.log(user)

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
            const MEDIUM_POST_URL = state.userURL+'/player'
            const user = await Axios.post(MEDIUM_POST_URL, profile);
            dispatch('settingData',user.user.email)
          } catch (error) {
            console.log(error)
          }
        }
        else{
           router.replace({name:'login'})
        }
        
    } catch (error) {
        console.log(error)
        dispatch('userCreatedAlreadyToggle')
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