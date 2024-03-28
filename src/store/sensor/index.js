import Vue from 'vue';
import Axios from 'axios';
import { sensorPort } from '../urls'

let baseURL = "http://localhost:"

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
    let validSensors = []
    sensorTemplates.forEach(sensor => {
      if(sensor.base_url !== null){
        validSensors.push(sensor)
      }
    });

    for (let index = 0; index < validSensors.length; index++) {
      for (let index2 = 0; index2 < state.sensorsAndEndpoints.length; index2++) {
        if(validSensors[index].id_online_sensor === (state.sensorsAndEndpoints)[index2].id_online_sensor){
          validSensors[index]['associated'] = true
          break
        }
      }
      if(!validSensors[index].hasOwnProperty('associated') ){
        validSensors[index]['associated'] = false
      }
      state.sensorTemplates.push(validSensors[index])
    }
   },
  SET_SENSORS(state, sensors) {
   sensors.forEach(sensor => {
        state.sensorsAndEndpoints.push(sensor)
        if(sensor.base_url !== null){
          state.id_sensors.push(sensor.id_online_sensor)
          state.name_sensors.push(sensor.name)        
        }
        
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
  async addingNewSensorsAndTemplatesAndEndpoints({ dispatch,commit, state }, payload) {
    console.log('EZ')

    try {      
        let MEDIUM_GET_URL = state.sensorURL+'/sensor/'+payload.id
        let reply = await Axios.get(MEDIUM_GET_URL);
        console.log(reply.data)
        
        commit('SET_SENSORS', [reply.data])
        await dispatch('setEndpointsSingle', {id:payload.id} )

        MEDIUM_GET_URL = state.sensorURL+'/sensors_all'
        reply = await Axios.get(MEDIUM_GET_URL);
        console.log(reply.data)

        commit('SET_SENSOR_TEMPLATES', reply.data)


    } catch (error) {
        console.log(error)
    }

  },
  async setEndpointsSingle({ dispatch, commit, state }, profile) {
    await dispatch('setSingleEndpoints', {id:profile.id})       
    
  },

  async setSensorsAndTemplatesAndEndpoints({ dispatch,commit, state }) {
    console.log('EZ')

    try {      
        
        await dispatch('setSensorsAndEndpoints')
        console.log(state.sensorsAndEndpoints)
        state.sensorURL = "http://localhost:3007"
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

        let id_sensor_index;
        state.id_sensors.forEach((id,index) => {
          if(id === id_online_sensor){
            id_sensor_index = index
            
          }
        });

        state.id_sensors.splice(id_sensor_index,1)        
        state.name_sensors.splice(id_sensor_index,1)
        
        console.log(state.sensorsAndEndpoints)
        console.log(state.id_sensors)
        console.log(state.name_sensors)


        MEDIUM_GET_URL = state.sensorURL+'/sensors_all'
        reply = await Axios.get(MEDIUM_GET_URL);
        console.log(reply.data)

        commit('SET_SENSOR_TEMPLATES', reply.data)
        
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
          await dispatch('addingNewSensorsAndTemplatesAndEndpoints',{id:metadata.id_online_sensor})
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
  
  async createPlayerDefaultSensors({ dispatch, commit, state,rootState }, profile) {
    console.log('Se supone que deberia haber un id aca: ')
    let id_player =rootState.user.id_player
    let MEDIUM_POST_URL = state.sensorURL+'/sensor_relation/'+id_player+'/'
    let ENDPOINTS_GET_URL = state.sensorURL+'/online_sensor/'
    //:id_online_sensor/all_sensor_endpoints
    let endpoint_data;
    let UNIQUE_POST_URL = state.sensorURL+'/sensor_endpoint_batch/'+id_player
    let id_default_sensors = []
    let ids_sensor_endpoint = []
    let specific_parameter_parameters_array = []
    let reply
    console.log('sensor')
    console.log(state.sensorTemplates)
    let allSensorTemplatesAux
    try {
      const MEDIUM_GET_URL = state.sensorURL+'/sensors_all'
      reply = await Axios.get(MEDIUM_GET_URL);
      console.log(reply.data)
      allSensorTemplatesAux = reply.data
    } catch (error) {
      
    }

    try {
      ///sensor_relation/:id_player/:id_online_sensor
      console.log('voy a colocar los sensor templates')

      console.log(allSensorTemplatesAux)

      for (const sensor of allSensorTemplatesAux) {              
        
        if(sensor.base_url === null){
          console.log(sensor)

          MEDIUM_POST_URL+=sensor.id_online_sensor.toString()
          id_default_sensors.push(sensor.id_online_sensor.toString())
          await Axios.post(MEDIUM_POST_URL,{tokens:null});          
          MEDIUM_POST_URL = state.sensorURL+'/sensor_relation/'+id_player+'/'  
        }
      }
      try {
        ///sensor_relation/:id_player/:id_online_sensor
          console.log('estos son los id sensors')
          console.log(id_default_sensors)
          for (const id of id_default_sensors) {              
            ENDPOINTS_GET_URL+=id+'/all_sensor_endpoints'
            endpoint_data = await Axios.get(ENDPOINTS_GET_URL);   
            for (const sensor_endpoint of endpoint_data.data) {
              ids_sensor_endpoint.push(sensor_endpoint.id_sensor_endpoint)
              specific_parameter_parameters_array.push(null)

            }
          
            reply = await Axios.post(UNIQUE_POST_URL,{ids_sensor_endpoint:ids_sensor_endpoint,specific_parameter_parameters_array:specific_parameter_parameters_array });   
            console.log(reply)
            ids_sensor_endpoint.splice(0)
            specific_parameter_parameters_array.splice(0)
            ENDPOINTS_GET_URL = state.sensorURL+'/online_sensor/'

          }
          commit('RESET_VARIABLES')
      }catch(e){
        console.log(e)
      }

    }catch(e){
      console.log(e)
    }

    for (const sensor of state.sensorsAndEndpoints) {      
      await dispatch('setSingleEndpoints', {id:sensor.id_online_sensor})      
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
        state.sensorURL = "http://localhost:3007"
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