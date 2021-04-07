import Vue from 'vue';
import Axios from 'axios';
import { baseURL, getPort, postPort } from '../urls'
const state = {
  dimensionsAndSubattributes: [],
  id_dimensions: [],
  name_dimensions: [],

  getURL: baseURL+ getPort,
  postURL: baseURL+ postPort

};

const getters = {
    dimensionsAndSubattributes: ({dimensionsAndSubattributes}) => dimensionsAndSubattributes,
    id_dimensions: ({id_dimensions}) => id_dimensions,
    name_dimensions: ({name_dimensions}) => name_dimensions


};

const mutations = {
  RESET_VARIABLES(state){
    state.dimensionsAndSubattributes.splice(0)
    state.id_dimensions.splice(0)
    state.name_dimensions.splice(0)

  },
  SET_DIMENSIONS(state, dimensions) {
   dimensions.forEach(dimension => {
       state.dimensionsAndSubattributes.push(dimension)
       state.id_dimensions.push(dimension.id_attributes)
       state.name_dimensions.push(dimension.name)
   });
  },
  SET_SUBATTRIBUTES(state, payload) {
    let index_dimn
    state.dimensionsAndSubattributes.forEach((dimension,index) => {
    
        if(dimension.id_attributes === payload.id){
            index_dimn = index
        }
    });
    Vue.set(state.dimensionsAndSubattributes[index_dimn], 'subattributes',payload.subattributes)
  }
};

const actions = {
  
  async createPlayerLevelRelations({ dispatch,commit, state, rootState }, profile) {

    try {
      console.log('Se supone que deberia haber un id aca: ')
      console.log(rootState.user.id_player)
      console.log('Se supone que deberia haber un array de ids de dimensiones: ')
      await dispatch('setDimensionsAndSubattributes');
      console.log(state.id_dimensions)
      let atts = {
        "id_attributes": state.id_dimensions
      }
      const MEDIUM_POST_URL = state.postURL+'/player_all_attributes/'+rootState.user.id_player.toString()
      console.log(MEDIUM_POST_URL)
      const reply = await Axios.post(MEDIUM_POST_URL,atts);
      console.log(reply)

    } catch (error) {
        console.log(error)
    }

  },
  async setDimensionsAndSubattributes({ dispatch,commit, state }, profile) {

    try {
        const MEDIUM_GET_URL = state.getURL+'/attributes_all'
        const reply = await Axios.get(MEDIUM_GET_URL);
        commit('SET_DIMENSIONS', reply.data)
        dispatch('setSubattributes')

    } catch (error) {
        console.log(error)
    }

  },
  async setSubattributes({ dispatch, commit, state }, profile) {
    for (const dimension of state.dimensionsAndSubattributes) {      
      await dispatch('setSingleSubattribute',{id:dimension.id_attributes} )   
    }
  },
  async setSingleSubattribute({ commit, state }, payload) {
    try {
        const MEDIUM_GET_URL = state.getURL+'/subattributes_of_attribute/'+payload.id.toString()
        const reply = await Axios.get(MEDIUM_GET_URL);
        console.log(payload.id)

        commit('SET_SUBATTRIBUTES', {subattributes: reply.data, id:payload.id})

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