import Vue from 'vue';
import Axios from 'axios';
import { baseURL, sensorPort, postPort } from '../urls'
const state = {
  videogamesAndModifiableMechanics: [],
  videogames: [],
  modifiable_mechanics: [],

  sensorURL: baseURL+ sensorPort

};

const getters = {
    videogamesAndModifiableMechanics: ({videogamesAndModifiableMechanics}) => videogamesAndModifiableMechanics,
    videogames: ({videogames}) => videogames,
    modifiable_mechanics: ({modifiable_mechanics}) => modifiable_mechanics
};

const mutations = {
  RESET_VARIABLES(state){
    state.videogamesAndModifiableMechanics.splice(0)
    state.videogames.splice(0)
    state.modifiable_mechanics.splice(0)
  },
  SET_VIDEOGAMES(state, videogames) {
   videogames.forEach(videogame => {
       state.videogamesAndModifiableMechanics.push(videogame)
       state.videogames.push(videogame)
   });
  },
  SET_MODIFIABLE_MECHANICS(state, payload) {
    let index_dimn
    state.videogamesAndModifiableMechanics.forEach((videogame,index) => {
    
        if(videogame.id_videogame === payload.id){
            index_dimn = index
        }
    });
    Vue.set(state.videogamesAndModifiableMechanics[index_dimn], 'modifiable_mechanics',payload.mechanics)
  }
};

const actions = {
 
  async setVideogamesAndModifiableMechanics({ dispatch,commit, state }, profile) {

    try {
        const MEDIUM_GET_URL = state.sensorURL+'/videogames'
        const reply = await Axios.get(MEDIUM_GET_URL);
        commit('SET_VIDEOGAMES', reply.data)
        dispatch('setModifiableMechanics')

    } catch (error) {
        console.log(error)
    }

  },
  async setModifiableMechanics({ dispatch, commit, state }, profile) {
    for (const videogame of state.videogamesAndModifiableMechanics) {      
      await dispatch('setSingleModifiableMechanic',{id:videogame.id_videogame} )   
    }
  },
  async setSingleModifiableMechanic({ commit, state }, payload) {
    try {
        const MEDIUM_GET_URL = state.sensorURL+'/mechanics_of_videogame/'+payload.id.toString()
        const reply = await Axios.get(MEDIUM_GET_URL);
        console.log(payload.id)

        commit('SET_MODIFIABLE_MECHANICS', {mechanics: reply.data, id:payload.id})

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