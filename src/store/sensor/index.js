import Vue from 'vue';
import Axios from 'axios';
import { baseURL, sensorPort } from '../urls'
const state = {
  sensorsAndEndpoints: [],
  sensorTemplates: [],
  id_sensors: [],
  name_sensors:[],
  settingUpNewPlayer:false,
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
    console.log('aqui')
    console.log( state.sensorsAndEndpoints)
    console.log( state.payload)

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
  SET_ENDPOINT_ACTIVATION(state,payload){
    console.log('aqui')
    console.log( state.sensorsAndEndpoints)
    console.log( state.payload)
  
      state.sensorsAndEndpoints.forEach((sensor) => {    
        if(sensor.id_online_sensor === payload.id_online_sensor){
          for (const endpoint of sensor.endpoints) {
            if(endpoint.id_sensor_endpoint  == payload.id_sensor_endpoint){
                endpoint.activated = payload.activated
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
  async setNewPlayerSensorsAndEndpoints({ dispatch, commit, state, rootState }, payload) {
    let userData = payload.userData
    let metadata = payload.metadata
    console.log(userData)   
    console.log(metadata)   

    try {
      ///sensor_relation/:id_player/:id_online_sensor
        let MEDIUM_POST_URL = state.sensorURL+'/sensor_relation/'+metadata.id_player+'/'+metadata.id_online_sensor
        let reply = await Axios.post(MEDIUM_POST_URL,{tokens:userData});    
        console.log(reply)   
        try {
          ////1) Obtener TODOS los endpoints de un sensor en especial
          let MEDIUM_GET_URL = state.sensorURL+'/sensor_sensor_endpoint/'+metadata.id_online_sensor
          reply = await Axios.get(MEDIUM_GET_URL);  
          console.log(reply.data)
          let ids_sensor_endpoint = []
          let specific_parameter_parameters_json;
          let specific_parameter_parameters_array = []
          for (const endpoint of reply.data) {
            ids_sensor_endpoint.push(endpoint.id_sensor_endpoint)
            //input
            //specific_parameter_parameters_json = Array [{instruction:"", search_data:{"url": "/boards/{id}/lists", "url_params": {"id": "{id}"}, "search_param": "name", "retrieve_param": "id", "specific_param": "cardId"}, retrieve_message:""},{...}]
            specific_parameter_parameters_json = JSON.parse(endpoint.specific_parameters).parameters
            console.log(specific_parameter_parameters_json)
            //output
            // Array = {actual_data:[{data:""},{data:""}], "id":"", "id2":""}
            let single_data = {"actual_data":[]}
            for (const parameter of specific_parameter_parameters_json) {
              single_data.actual_data.push({"data":""})
              if(specific_parameter_parameters_json.search_data.hasOwnProperty('specific_param')){
                single_data[specific_parameter_parameters_json.search_data.specific_param] = ""

              }
            }
            specific_parameter_parameters_array.push(single_data)
          }
          /*
          specific_parameter = {
              "actual_data":[
                {
                  "data":""
                },
                {
                  "data":""
                }
              ],
              "id":"",
              "id2":"" 
              ...
          }          
          */
          console.log(ids_sensor_endpoint)
          console.log(specific_parameter_parameters_array)

          ////1)Crea asociacion de un jugador a un sensor_endpoint en especifico
          ///sensor_endpoint/:id_player/:id_sensor_endpoint
          MEDIUM_POST_URL = state.sensorURL+'/sensor_endpoint_batch/'+metadata.id_player
          reply = await Axios.post(MEDIUM_POST_URL,{ids_sensor_endpoint:ids_sensor_endpoint,specific_parameter_parameters_array:specific_parameter_parameters_array });   
          console.log(reply)
          await dispatch('setSensorsAndEndpoints')      

          


        } catch (error) {
          console.log(error)

        } 
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