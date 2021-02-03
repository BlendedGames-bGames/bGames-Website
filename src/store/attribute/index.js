import Vue from 'vue';
import Axios from 'axios';
import { baseURL, getPort, postPort } from '../urls'
const state = {
  dimensionsAndSubattributes: [],
  id_dimensions: [],
  getURL: baseURL+ getPort,
  postURL: baseURL+ postPort

};

const getters = {
    dimensionsAndSubattributes: ({dimensionsAndSubattributes}) => dimensionsAndSubattributes,
    id_dimensions: ({id_dimensions}) => id_dimensions

};

const mutations = {
  SET_DIMENSIONS(state, dimensions) {
   dimensions.forEach(dimension => {
       state.dimensionsAndSubattributes.push(dimension)
       state.id_dimensions.push(dimension.id_attributes)
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
        const MEDIUM_POST_URL = state.postURL+'/player_all_attributes/'+rootState.user.id_player
        const reply = await Axios.post(MEDIUM_POST_URL, state.id_dimensions);
       

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
    state.dimensionsAndSubattributes.forEach(dimension => {
        dispatch('setSingleSubattribute',{id:dimension.id_attributes} )
    });
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