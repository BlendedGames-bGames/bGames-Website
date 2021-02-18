import Vue from 'vue';
import Axios from 'axios';
import { baseURL, sensorPort } from '../urls'
const state = {
  sensorsAndEndpoints: [],
  sensorTemplates: [],
  id_sensors: [],
  name_sensors:[],
  settingUpNewPlayer:false,
  settingUpDissociationPlayer:false,
  sensorURL: baseURL+ sensorPort
};

const getters = {
  sensorsAndEndpoints: ({sensorsAndEndpoints}) => sensorsAndEndpoints,
  sensorTemplates: ({sensorTemplates}) => sensorTemplates,
  id_sensors: ({id_sensors}) => id_sensors,
  name_sensors: ({name_sensors}) => name_sensors,
  settingUpNewPlayer: ({settingUpNewPlayer}) => settingUpNewPlayer,
  settingUpDissociationPlayer: ({settingUpDissociationPlayer}) => settingUpDissociationPlayer,

};

const mutations = {
  SET_NEW_PLAYER_TOGGLE(state){
    state.settingUpNewPlayer = !state.settingUpNewPlayer
  },
  SET_DISSOCIATION_PLAYER_TOGGLE(state){
    state.settingUpDissociationPlayer = !state.settingUpDissociationPlayer
  },
  RESET_VARIABLES(state){
    state.sensorTemplates.splice(0)
    state.sensorsAndEndpoints.splice(0)
    state.id_sensors.splice(0)
    state.name_sensors.splice(0)
    state.settingUpNewPlayer = false
    state.settingUpDissociationPlayer =false

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
    state.sensorTemplates.splice(0)
    console.log(sensorTemplates)
    console.log(state.sensorsAndEndpoints)

    for (let index = 0; index < sensorTemplates.length; index++) {
      for (let index2 = 0; index2 < state.sensorsAndEndpoints.length; index2++) {
        if(sensorTemplates[index].id_online_sensor === (state.sensorsAndEndpoints)[index2].id_online_sensor){
          sensorTemplates[index]['associated'] = true
          break
        }
      }
      if(!sensorTemplates[index].hasOwnProperty('associated') ){
        sensorTemplates[index]['associated'] = false
      }
      state.sensorTemplates.push(sensorTemplates[index])
    }
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
    console.log('EZ')

    try {      
        
        await dispatch('setSensorsAndEndpoints')
        console.log(state.sensorsAndEndpoints)
        const MEDIUM_GET_URL = state.sensorURL+'/sensors_all'
        const reply = await Axios.get(MEDIUM_GET_URL);
        console.log(reply.data)

        commit('SET_SENSOR_TEMPLATES', reply.data)


    } catch (error) {
        console.log(error)
    }

  },
  async setDissociationSensorsAndEndpoints({ dispatch, commit, state, rootState }, id_online_sensor){
    let MEDIUM_DELETE_URL = state.sensorURL+'/sensor_relation/'+rootState.user.id_player+'/'+id_online_sensor
    try{
      let reply = await Axios.delete(MEDIUM_DELETE_URL);    
      console.log(reply)   
      try{
        ////1) Obtener TODOS los endpoints de un sensor en especial
        let MEDIUM_GET_URL = state.sensorURL+'/sensor_sensor_endpoints/'+id_online_sensor
        reply = await Axios.get(MEDIUM_GET_URL);  
        console.log(reply.data)
        let ids_sensor_endpoint = []
        for (const endpoint of reply.data) {
          ids_sensor_endpoint.push(endpoint.id_sensor_endpoint)
        }
        for (const sensor_endpoint of ids_sensor_endpoint) {
          ///sensor_endpoint/:id_players/:id_sensor_endpoint
          try {
            MEDIUM_DELETE_URL = state.sensorURL+'/sensor_endpoint/'+rootState.user.id_player+'/'+sensor_endpoint
            reply = await Axios.delete(MEDIUM_DELETE_URL);   
            console.log(reply)
          } catch(error){
            console.log(error)
          }
        }
        let id_online_sensor_index
        state.sensorsAndEndpoints.forEach((sensor,index) => {
          if(sensor.id_online_sensor === id_online_sensor){
            id_online_sensor_index = index
            
          }
        });
        console.log(id_online_sensor_index)
        state.sensorsAndEndpoints.splice(id_online_sensor_index,1)
        state.id_sensors.splice(id_online_sensor_index,1)
        state.name_sensors.splice(id_online_sensor_index,1)
        console.log(state.sensorsAndEndpoints)
        console.log(state.id_sensors)
        console.log(state.name_sensors)

        await dispatch('setSensorsAndTemplatesAndEndpoints')
        commit('SET_DISSOCIATION_PLAYER_TOGGLE')      
        
        
      }catch(error){
        console.log(error)

      }

    }catch (error){
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
          let MEDIUM_GET_URL = state.sensorURL+'/sensor_sensor_endpoints/'+metadata.id_online_sensor
          reply = await Axios.get(MEDIUM_GET_URL);  
          console.log(reply.data)
          let ids_sensor_endpoint = []
          let specific_parameter_parameters_json;
          let specific_parameter_parameters_array = []
          for (const endpoint of reply.data) {
            ids_sensor_endpoint.push(endpoint.id_sensor_endpoint)
            //input
            //specific_parameter_parameters_json = Array [{instruction:"", search_data:{"url": "/boards/{id}/lists", "url_params": {"id": "{id}"}, "search_param": "name", "retrieve_param": "id", "specific_param": "cardId"}, retrieve_message:""},{...}]
            if(endpoint.specific_parameters !== null){
              specific_parameter_parameters_json = JSON.parse(endpoint.specific_parameters).parameters
              console.log(specific_parameter_parameters_json)
              //output
              // Array = {actual_data:[{data:""},{data:""}], "id":"", "id2":""}
              let single_data = {"actual_data":[]}
              for (const parameter of specific_parameter_parameters_json) {
                single_data.actual_data.push({"data":""})
                if(parameter.search_data.hasOwnProperty('specific_param')){
                  single_data[parameter.search_data.specific_param] = ""

                }
              }
              specific_parameter_parameters_array.push(single_data)

            }
            else{
              specific_parameter_parameters_array.push(null)
            }
            
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
          await dispatch('setSensorsAndTemplatesAndEndpoints')
          commit('SET_NEW_PLAYER_TOGGLE')      

          


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