import Vue from 'vue';
import Axios from 'axios';
import { baseURL, sensorPort } from '../urls'
const state = {
  sensorsAndEndpoints: [],
  sensorTemplates: [],
  id_sensors: [],
  name_sensors:[],
  sensorURL: baseURL+ sensorPort
};

const getters = {
  sensorsAndEndpoints: ({sensorsAndEndpoints}) => sensorsAndEndpoints,
  sensorTemplates: ({sensorTemplates}) => sensorTemplates,
  id_sensors: ({id_sensors}) => id_sensors,
  name_sensors: ({name_sensors}) => name_sensors,
};

const mutations = {
  RESET_VARIABLES(state){
    state.sensorTemplates.splice(0)
    state.sensorsAndEndpoints.splice(0)
    state.id_sensors.splice(0)
    state.name_sensors.splice(0)
  },
  SET_SPECIFIC_PARAMETERS_SINGLE(state,payload){
    state.sensorsAndEndpoints.forEach((sensor) => {    
      if(sensor.id_online_sensor === payload.id_online_sensor){
        for (const endpoint of sensor.endpoints) {
          if(endpoint.id_sensor_endpoint  == payload.id_sensor_endpoint){
              endpoint.specific_parameters = payload.specific_parameters
          } 
          
        }
      }
    });

  },
  SET_SENSOR_TEMPLATES(state, sensorTemplates) {
    console.log()
    sensorTemplates.forEach(sensorTemplate => {
        state.sensorTemplates.push(sensorTemplate)
    });
   },
  SET_SENSORS(state, sensors) {
   sensors.forEach(sensor => {
       state.sensorsAndEndpoints.push(sensor)
       state.id_sensors.push(sensor.id_online_sensor)
       state.name_sensors.push(sensor.name)
   });
  },
  SET_ENDPOINTS(state, payload) {
    let index_dimn
    state.sensorsAndEndpoints.forEach((sensor,index) => {
    
        if(sensor.id_online_sensor === payload.id){
            index_dimn = index
        }
    });
    Vue.set(state.sensorsAndEndpoints[index_dimn], 'endpoints',payload.endpoints)
  }
};

const actions = {
  async setSensorsAndTemplatesAndEndpoints({ dispatch,commit, state }) {

    try {
        const MEDIUM_GET_URL = state.sensorURL+'/sensors_all'
        const reply = await Axios.get(MEDIUM_GET_URL);
        
        commit('SET_SENSOR_TEMPLATES', reply.data)
        dispatch('setSensorsAndEndpoints')

    } catch (error) {
        console.log(error)
    }

  },

  async setSensorsAndEndpoints({ dispatch, commit, state, rootState }) {

    try {
        const MEDIUM_GET_URL = state.sensorURL+'/sensor_player/'+rootState.user.id_player.toString()
        const reply = await Axios.get(MEDIUM_GET_URL);        

        commit('SET_SENSORS', reply.data)

        dispatch('setEndpoints')

    } catch (error) {
        console.log(error)
    }

  },
  

  async setEndpoints({ dispatch, commit, state }, profile) {
    for (const sensor of state.sensorsAndEndpoints) {      
      await dispatch('setSingleEndpoints', {id:sensor.id_online_sensor})      
    }
    
  },
  async setSingleEndpoints({ commit, state, rootState }, payload) {
    try {
      ///sensor_endpoints_activated/:id_player/:id_online_sensor
        const MEDIUM_GET_URL = state.sensorURL+'/sensor_endpoints/'+rootState.user.id_player.toString()+'/'+payload.id.toString()
        const reply = await Axios.get(MEDIUM_GET_URL);

        commit('SET_ENDPOINTS', {endpoints: reply.data, id:payload.id})

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