import io from 'socket.io-client';
import { baseURL, postPort,sensorCommunicationPort } from '../urls'

const state = {    
  authenticationSocket: null,
  dimensionSocket: null
};

const getters = {
    dimensionSocket: ({dimensionSocket}) => dimensionSocket,
    authenticationSocket: ({authenticationSocket}) => authenticationSocket
};

const mutations = {

    RESET_VARIABLES(state){  
        state.dimensionSocket = null
        state.authenticationSocket = null
    },

    SETUP_DIMENSION_SOCKET(state,id_player) {        
        state.dimensionSocket = io(baseURL+postPort+'/dimensions')
        state.dimensionSocket.on('welcome', (msg) => {
          console.log(msg)
        });    
        state.dimensionSocket.emit('joinRoom',id_player.toString());	    
        state.dimensionSocket.on('success', (msg) => {
          console.log(msg)
        });     
    },
    SETUP_AUTHENTICATION_SOCKET(state,id_player) {
        state.authenticationSocket = io(baseURL+sensorCommunicationPort+'/authentication')
        state.authenticationSocket.on('welcome', (msg) => {
          console.log(msg)
        });
        state.authenticationSocket.emit('joinRoom',id_player.toString());			
        state.authenticationSocket.on('success', (msg) => {
          console.log(msg)
        });    
    },
};

const actions = {

    async setupSockets({ commit, dispatch }) {
        await dispatch('setupDimensionSocket')
        await dispatch('setupAuthenticationSocket')
    }, 
 
    async setupDimensionSocket({ commit, rootState}) {
      let id_player = rootState.user.id_player
      commit('SETUP_DIMENSION_SOCKET',id_player)

    },
    async setupAuthenticationSocket({ commit, rootState}) {
      let id_player = rootState.user.id_player
      commit('SETUP_AUTHENTICATION_SOCKET',id_player)

    },
  

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};