import http from 'k6/http';
import { check, sleep, group} from 'k6';

const baseURL = 'http://144.126.216.255:'
const standardPort = '3009'

let standardURL = baseURL+ standardPort;
export let options = {
  stages: [
    { duration: '1m', target: 100 }, // below normal load
    { duration: '2m', target: 100 },
    { duration: '1m', target: 200 }, // normal load
    { duration: '2m', target: 200 },
    { duration: '1m', target: 300 }, // around the breaking point
    { duration: '2m', target: 300 },

    { duration: '11m', target: 0 } // scale down. Recovery stage.
  ]
};
const SLEEP_DURATION = 0.1;



function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))+1;
}
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min); //The maximum is inclusive and the minimum is inclusive
}
export default function () {

  group('standard_journey', (_) => {
    let random_id_sensor_endpoint = getRandomIntInclusive(17,21)
    var watch_parameters = []
    var data_changes = []
    if(random_id_sensor_endpoint !== 21){
        watch_parameters.push([true])
        data_changes.push(getRandomInt(9))
    }
    else{
        watch_parameters.push(['badges','votes'], ['badges','checkItemsChecked'])
        data_changes.push(getRandomInt(9))
        data_changes.push(getRandomInt(9))
    }
    let data = JSON.stringify({
      "id_player": 53,
      "id_sensor_endpoint":random_id_sensor_endpoint,
      "data_changes":data_changes,
      "watch_parameters":watch_parameters
    });
    var params = {
      headers: {
        'Content-Type': 'application/json'
      },
    };
    

    let result = http.post(
        standardURL + '/standard_attributes_apis', data,params
    );
    check(result, {
        'is status 200': (r) => r.status === 200
    });
    

  });
}
