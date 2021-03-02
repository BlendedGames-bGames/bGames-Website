import http from 'k6/http';
import { check, sleep, group} from 'k6';

const baseURL = 'http://144.126.216.255:'
const sensorPort = '3007'
const getPort = '3001' 
const userPort = '3010'

let userURL = baseURL+ userPort;
let getURL = baseURL+ getPort;
let sensorURL = baseURL+ sensorPort;

const SLEEP_DURATION = 0.1;

export let options = {
  stages: [
    { duration: '1m', target: 10 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '2m', target: 10 }, // stay at 100 users for 10 minutes
    { duration: '1m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<2000'], // 99% of requests must complete below 1.5s
    'logged in successfully': ['p(99)<2000'], // 99% of requests must complete below 1.5s
  },
};

 function setDimensionsAndSubattributes() {
    let dimensions = http.get(
        getURL + '/attributes_all' ,
    );
    check(dimensions, {
        'is status 200': (r) => r.status === 200
    });
    console.log(dimensions.body)
    console.log('36')
    console.log(typeof(JSON.parse(dimensions.body)))
    setSubattributes(JSON.parse(dimensions.body))

};

 function setSubattributes(dimensions) {
    for (const dimension of dimensions) {
        let id = dimension.id_attributes   
         setSingleSubattribute(id);
    }
};
 function setSingleSubattribute(payload) {
    let subatts = http.get(
        getURL + '/subattributes_of_attribute/'+payload.toString() ,
    );
    check(subatts, {
        'is status 200': (r) => r.status === 200
    });
}

 function setVideogamesAndModifiableMechanics() {
    let videogames = http.get(
        sensorURL + '/videogames'
    );
    check(videogames, {
        'is status 200': (r) => r.status === 200
    });
    setModifiableMechanics(JSON.parse(videogames.body))
};
 function setModifiableMechanics(videogames) {
    for (const videogame of videogames) { 
        let id = videogame.id_videogame   
         setSingleModifiableMechanic(id)
    }
  };
 function setSingleModifiableMechanic(payload) {
    let mechanics = http.get(
        getURL + '/mechanics_of_videogame/'+payload.toString() ,
    );
    check(mechanics, {
        'is status 200': (r) => r.status === 200
    });
};
 function setSensorsAndTemplatesAndEndpoints(id_player) {

    console.log('82')
    console.log(id_player)
    console.log(typeof(id_player))
    setSensorsAndEndpoints(id_player);
    let sensors = http.get(
        sensorURL + '/sensors_all'
    );
    check(sensors, {
        'is status 200': (r) => r.status === 200
    });


};
 function setSensorsAndEndpoints(id_player) {
    let sensor_player = http.get(
        sensorURL + '/sensor_player/'+id_player.toString() ,
    );
    check(sensor_player, {
        'is status 200': (r) => r.status === 200
    });   
    console.log('102 y 103')
    console.log(sensor_player.body)
    console.log(JSON.parse(sensor_player.body))
    console.log(typeof(JSON.parse(sensor_player.body)))
    setEndpoints(JSON.parse(sensor_player.body), id_player);
};
  

 function setEndpoints(sensorsAndEndpoints,id_player) {
    for (const sensor of sensorsAndEndpoints) {      
        let id_online_sensor = sensor.id_online_sensor   
         setSingleEndpoints(id_online_sensor,id_player); 
    }
    
};
 function setSingleEndpoints(id_online_sensor, id_player) {
      ///sensor_endpoints_activated/:id_player/:id_online_sensor
    let sensor_endpoints = http.get(
        sensorURL + '/sensor_endpoints/'+id_player.toString()+'/'+id_online_sensor.toString()
    );
    check(sensor_endpoints, {
        'is status 200': (r) => r.status === 200
    });   
};



 function settingSensorsAndEndpoints( email){
    let player = http.get(
        userURL + '/player_by_email/'+email ,
    );
    check(player, {
        'is status 200': (r) => r.status === 200
    });
    let json = JSON.parse(player.body)
    let json2 = JSON.parse(json)
    let id_player = json2.id_players
    console.log(id_player)

    setSensorsAndTemplatesAndEndpoints(id_player)
    return id_player
};
 function settingDimensionsLevelsAndSubattributes(id_player){
    let dimensions = http.get(
        getURL + '/player_all_attributes/'+id_player ,
    );
    check(dimensions, {
        'is status 200': (r) => r.status === 200
    });
     settingSubattributesLevels(JSON.parse(dimensions.body),id_player);
};

 function settingSubattributesLevels(dimensionLevels,id_player){
    for (const level of dimensionLevels) {  
        let id_attributes = level.id_attributes;
         settingSingleSubattributeLevel(id_attributes,id_player);
    }
};
 function settingSingleSubattributeLevel(id_attributes,id_player){
    let dimensionsSubattsLvls = http.get(
        getURL +'/id_player/'+id_player.toString()+/attributes/+id_attributes.toString()+'/subattributes_levels/'
    );
    check(dimensionsSubattsLvls, {
        'is status 200': (r) => r.status === 200
    });
};


export default function () {
  let profile = {
      "email":"common.user@email.com",
      "password":"password"
  }
 

  group('login_journey', (_) => {
    // Login request

    setDimensionsAndSubattributes();
    sleep(SLEEP_DURATION);
    
    setVideogamesAndModifiableMechanics();
    sleep(SLEEP_DURATION);

    let id_player = settingSensorsAndEndpoints(profile.email);
    sleep(SLEEP_DURATION);

    settingDimensionsLevelsAndSubattributes(id_player);
    sleep(SLEEP_DURATION);
    

  });
}
