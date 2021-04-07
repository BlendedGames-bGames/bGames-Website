import firebase from '@/firebase';
import Axios from 'axios';
import router from '../../router/index';
import Vue from 'vue';
import io from 'socket.io-client';
import { baseURL, userPort, getPort, postPort, sensorCommunicationPort} from '../urls'
const state = {
  userProfile: {},
  loggedIn: false,
  userCreatedAlready:false,
  incorrectPassword:false,

  userURL: baseURL+ userPort,
  getURL: baseURL+ getPort,
  sensorCommunicationURL: baseURL + sensorCommunicationPort,
  id_player:0,
  userLevels: [],
  userDimensionLevels: [],
  dataReady:false,
  loadingLoginData: false,

  adminPermission: false,
  notAnAdmin:false,
  typeLogin: false,
  menu:  [
    'Dashboard',
    [
      {
        to: '/statistics',
        icon: 'desktop-mac',
        label: 'Estadisticas generales'
      },
        {
        to: '/time_statistics',
        icon: 'desktop-mac',
        label: 'Estadisticas en el tiempo'
      }
    ],
    'Contribuciones',
    [         
      {
        to: '/dimensions_sensors',
        icon: 'desktop-mac',
        label: 'Dimensiones'
      },
        {
        to: '/sensors_dimensions',
        icon: 'desktop-mac',
        label: 'Sensores y Puntos de datos'
      }
    ],
    'Administracion',
    [
      {
        to: '/data_points',
        label: 'Puntos de datos',
        icon: 'table',
      },
      {
        to: '/sensor_asociation',
        label: 'Asociacion a sensores',
        icon: 'square-edit-outline'
      }
    ]
  ]

};

const getters = {

  userProfile: ({userProfile}) => userProfile,
  dataReady: ({dataReady}) => dataReady,
  menu: ({menu}) => menu,
  typeLogin: ({typeLogin}) => typeLogin,

  loggedIn: ({loggedIn}) => loggedIn,
  userCreatedAlready: ({userCreatedAlready}) => userCreatedAlready,
  incorrectPassword: ({incorrectPassword}) => incorrectPassword,

  id_player: ({id_player}) => id_player,
  userLevels: ({userLevels}) => userLevels,
  userDimensionLevels: ({userDimensionLevels}) => userDimensionLevels,
  loadingLoginData: ({loadingLoginData}) => loadingLoginData,


  adminPermission: ({adminPermission}) => adminPermission,
  notAnAdmin: ({notAnAdmin}) => notAnAdmin

};

const mutations = {
  TOGGLE_ADMIN_PERMISSION(state){
    state.adminPermission = !state.adminPermission

  },
  TOGGLE_MENU_PLAYER(state){
    state.menu = [
          'Dashboard',
        [
          {
            to: '/statistics',
            icon: 'desktop-mac',
            label: 'Estadisticas generales'
          },
            {
            to: '/time_statistics',
            icon: 'desktop-mac',
            label: 'Estadisticas en el tiempo'
          }
        ],
        'Contribuciones',
        [         
          {
            to: '/dimensions_sensors',
            icon: 'desktop-mac',
            label: 'Dimensiones'
          },
            {
            to: '/sensors_dimensions',
            icon: 'desktop-mac',
            label: 'Sensores y Puntos de datos'
          }
        ],
        'Administracion',
        [
          {
            to: '/data_points',
            label: 'Puntos de datos',
            icon: 'table',
          },
          {
            to: '/sensor_asociation',
            label: 'Asociacion a sensores',
            icon: 'square-edit-outline'
          }
        ]
    ]
    state.typeLogin = false 
 

  },
  TOGGLE_MENU_ADMIN(state){
    state.menu = [
      'Administracion de sensores',
     [
       {
         to: '/sensor_crud',
         icon: 'desktop-mac',
         label: 'CRUD sensores web'
       },
       {
         to: '/endpoint_crud',
         icon: 'desktop-mac',
         label: 'CRUD endpoints'
       },
       {
         to: '/conversion_crud',
         icon: 'desktop-mac',
         label: 'CRUD conversiones'
       },
     ],
     'Administracion de dimensiones y atributos',
     [         
       {
         to: '/dimension_crud',
         icon: 'desktop-mac',
         label: 'CRUD dimensiones'
       },
        {
         to: '/attribute_CRUD',
         icon: 'desktop-mac',
         label: 'CRUD atributos'
       }
     ]
   ]
   state.typeLogin = true 


  },
  
  TOGGLE_NOT_AN_ADMIN(state){
    state.notAnAdmin = !state.notAnAdmin

  },
  TOGGLE_DATA_READY(state){
    state.dataReady = !state.dataReady

  },
  TOGGLE_LOGGED_IN(state){
    state.loggedIn = !state.loggedIn

  },
  TOGGLE_LOADING_LOGIN_DATA(state){
    state.loadingLoginData = !state.loadingLoginData

  },
  RESET_VARIABLES(state){
  
    state.userCreatedAlready = false 
    state.incorrectPassword = false
    state.id_player = 0
    state.userLevels.splice(0)
    state.userDimensionLevels.splice(0)
    state.userProfile = {}
    state.dataReady = false
    state.loggedIn = false
    state.dimensionSocket = null
    state.authenticationSocket = null
    state.loadingLoginData = false
    
    state.adminPermission = false,
    state.notAnAdmin = false,
    state.typeLogin = false,
    state.menu = [
      'Dashboard',
      [
        {
          to: '/statistics',
          icon: 'desktop-mac',
          label: 'Estadisticas generales'
        },
          {
          to: '/time_statistics',
          icon: 'desktop-mac',
          label: 'Estadisticas en el tiempo'
        }
      ],
      'Contribuciones',
      [         
        {
          to: '/dimensions_sensors',
          icon: 'desktop-mac',
          label: 'Dimensiones'
        },
          {
          to: '/sensors_dimensions',
          icon: 'desktop-mac',
          label: 'Sensores y Puntos de datos'
        }
      ],
      'Administracion',
      [
        {
          to: '/data_points',
          label: 'Puntos de datos',
          icon: 'table',
        },
        {
          to: '/sensor_asociation',
          label: 'Asociacion a sensores',
          icon: 'square-edit-outline'
        }
      ]
    ]

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
      email: userProfile.email,
      providerId:userProfile.providerData[0].providerId,
      uid:userProfile.providerData[0].uid
    };
    console.log('estoy aqui!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!')
    console.log(state.userProfile)
  },
 
  LOGOUT(state) {
    state.loggedIn = false;
    state.userProfile = {};
  },
  USER_CREATED_ALREADY_TOGGLE(state) {
    state.userCreatedAlready = !state.userCreatedAlready;
  },
  USER_INCORRECT_PASSWORD(state) {
    state.incorrectPassword = !state.incorrectPassword;
  },
  SET_RT_USER_LEVELS(state,payload){
    payload.id_attributes.forEach( (id_attribute,index) => {
      state.userLevels.forEach((level,index2) => {
        if(level.id_attributes === id_attribute){
          state.userLevels[index2].data = payload.data[index]
          state.userDimensionLevels[index2] = payload.data[index]
        }
      });
    })
  },
  SET_RT_USER_SUBATT_LEVELS(state,payload){
    console.log(payload)
    console.log(payload.id_subattributes)
    console.log(payload.data)
    console.log(state.userLevels)
    payload.id_subattributes.forEach( (id_subattribute,index) => {
      state.userLevels.forEach((level,index2) => {
        level.subattribute_levels.forEach((dimension_subattributes,index3) => {
          if(dimension_subattributes.id_subattributes === id_subattribute){
            state.userLevels[index2].subattribute_levels[index3].total += payload.data[index]
          }
        });
      });
    })
    console.log(payload.id_subattributes)
    console.log(payload.data)
    console.log(state.userLevels)
  },
  SET_USER_LEVELS(state,levels) {
    console.log(levels)
    let auxLevels;
    if(levels.length === 0){
      auxLevels = levels
    }
    else{
      auxLevels = levels 
    }
    console.log()
    auxLevels.forEach(level => {
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
  async setRealTimeDimensionLevels({ dispatch, commit, state, rootState  }, payload){
    commit('SET_RT_USER_LEVELS',payload)
   
  },
  async setRealTimeSubattributeLevels({ dispatch, commit, state, rootState  }, payload){
    console.log(payload)
    commit('SET_RT_USER_SUBATT_LEVELS',payload)
   
  },
  async settingData({ dispatch, commit, state, rootState  }, profile){

    await dispatch('settingSensorsAndEndpoints',profile.email)
    if(state.adminPermission && state.typeLogin){      
      await dispatch('attribute/setDimensionsAndSubattributes',null,{root:true})
      await dispatch('videogame/setVideogamesAndModifiableMechanics',null,{root:true})

      await dispatch('settingDimensionsLevelsAndSubattributes')

      await dispatch('socket/setupSockets',null,{root:true})
      
      commit('TOGGLE_DATA_READY')

      commit('TOGGLE_LOADING_LOGIN_DATA')
      //commit('TOGGLE_LOGGED_IN')

      router.replace({name:'sensor_crud'})      

    }

    else if(!state.adminPermission && state.typeLogin){

      commit('TOGGLE_LOADING_LOGIN_DATA')
      commit('TOGGLE_NOT_AN_ADMIN')
    }
    else{
      await dispatch('attribute/setDimensionsAndSubattributes',null,{root:true})
      await dispatch('videogame/setVideogamesAndModifiableMechanics',null,{root:true})

      await dispatch('settingDimensionsLevelsAndSubattributes')

      await dispatch('socket/setupSockets',null,{root:true})
      
      commit('TOGGLE_DATA_READY')

      commit('TOGGLE_LOADING_LOGIN_DATA')
      //commit('TOGGLE_LOGGED_IN')

      router.replace({name:'statistics'})  

    }


  },
  
  async settingSensorsAndEndpoints({ dispatch, commit, state, rootState  }, email){
    const MEDIUM_GET_URL = state.userURL+'/player_by_email/'+email
    const userData = await Axios.get(MEDIUM_GET_URL);
    console.log(userData.data)
    if(JSON.parse(userData.data).type === 1){
      
      commit('TOGGLE_ADMIN_PERMISSION')
    }
    //Si tiene permisos de administrador
    await dispatch('setIdPlayer', JSON.parse(userData.data).id_players)
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
  async setupDimensionSocket({ commit }) {
    commit('SETUP_DIMENSION_SOCKET')
    console.log('sali')

  },
  async setupAuthenticationSocket({ commit }) {
    commit('SETUP_AUTHENTICATION_SOCKET')

  },
  async setIdPlayer({ commit }, id) {
    commit('SET_ID_PLAYER',id)
  },
  
  async loginProvider({ dispatch, state,commit,rootState }, profile) {
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
      commit('TOGGLE_LOADING_LOGIN_DATA')
      
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
          const PLAYER_GET_URL = state.userURL+'/player_by_email/'+profile.email
          const player = await Axios.get(PLAYER_GET_URL)
          console.log('El nuevo jugador es: ')
          console.log(JSON.parse(player.data))
          const id_player = JSON.parse(player.data).id_players
          console.log(id_player)

          commit('SET_ID_PLAYER', id_player)
          await dispatch('attribute/createPlayerLevelRelations',null,{root:true})

        } catch (error) {
          console.log(error)
        }
      }
      
      dispatch('settingData',{email:user.additionalUserInfo.profile.email})
    
    } catch(error) {
      console.log(error);
    }
  },
  async loginEmailAndPassword({ commit, dispatch, state, rootState }, profile) {

    try {
        console.log(profile)
        const user = await firebase.auth().signInWithEmailAndPassword(profile.email,profile.password)
        commit('TOGGLE_LOADING_LOGIN_DATA')
        dispatch('settingData',{email:profile.email})

    } catch (error) {
        console.log(error)
        commit('USER_INCORRECT_PASSWORD')
    }
  },

  async logout({ dispatch, state,rootState }, profile) {
    try {
      await firebase.auth().signOut();
      await dispatch('resetAllVariables',null,{root:true})
      console.log('paso por aqui')
      window.localStorage.setItem('user',null)

      router.replace({name:'login'})

    } catch(error) {
      console.log(error);
    }
  },
  async register({ commit, state, dispatch }, profile_info) {
    try {
      commit('TOGGLE_LOADING_LOGIN_DATA')

        const user = await firebase.auth().createUserWithEmailAndPassword(profile_info.email,profile_info.password)
        console.log("pase por aquii antes de cargar spinner")
        console.log("Estado del spinner")
        console.log(state.loadingLoginData)

        console.log("Estado del spinner despues del commit")
        console.log(state.loadingLoginData)

         if(user.additionalUserInfo.isNewUser){
          //Name of the user (before the @)

          console.log(user.user)

          const searchTerm = '@'
          const searchIndex = user.user.email.lastIndexOf(searchTerm)
          const name = user.user.email.slice(0,searchIndex)
          console.log(user.user.email)

          let profile = {
            "name": name,
            "email": user.user.email,
            "password": profile_info.password,
            "external_type": 'firebase.com',
            "external_id":user.user.uid
          }
          console.log(profile)

          try {
            const MEDIUM_POST_URL = state.userURL+'/player'
            const user = await Axios.post(MEDIUM_POST_URL, profile);
            console.log("Estado del spinner despues de crear las relaciones del usuario nuevo a las dimensiones")
            console.log(state.loadingLoginData)
            commit('TOGGLE_LOADING_LOGIN_DATA')
            console.log("Estado del spinner ULTIMO")
            console.log(state.loadingLoginData)
            const PLAYER_GET_URL = state.userURL+'/player_by_email/'+profile.email
            const player = await Axios.get(PLAYER_GET_URL)
            console.log('El nuevo jugador es: ')
            console.log(JSON.parse(player.data))
            const id_player = JSON.parse(player.data).id_players
            console.log(id_player)
  
            commit('SET_ID_PLAYER', id_player)
            await dispatch('attribute/createPlayerLevelRelations',null,{root:true})
            
          } catch (error) {
            console.log(error)
          }
        }
        else{
          dispatch('userCreatedAlreadyToggle')
          commit('TOGGLE_LOADING_LOGIN_DATA')

        }

        
    } catch (error) {
        console.log(error)
        dispatch('userCreatedAlreadyToggle')
        commit('TOGGLE_LOADING_LOGIN_DATA')

    }
  },
  userCreatedAlreadyToggle({ commit, state }, payload) {
    commit('USER_CREATED_ALREADY_TOGGLE')

  },
  incorrectPasswordToggle({ commit, state }, payload) {
       commit('USER_INCORRECT_PASSWORD')

  }

};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};