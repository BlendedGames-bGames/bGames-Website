import http from 'k6/http';
import { check, sleep, group} from 'k6';

const baseURL = 'http://144.126.216.255:'
const standardPort = '3008'

let standardURL = baseURL+ standardPort;

const SLEEP_DURATION = 1;

export let options = {
  stages: [
     { duration: '5m', target: 100 }, // below normal load
    { duration: '10m', target: 100 },
    { duration: '5m', target: 0 }
  ],
};


function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max))+1;
}

export default function () {

  group('consume_journey', (_) => {

    let postData = {
      "id_player": 53,
      "id_videogame":1,
      "id_modifiable_mechanic":1,
      "data":getRandomInt(1)
    } 
    
    let stringData = JSON.stringify(postData)
    console.log(stringData)
    console.log(typeof stringData)

    let finalData = { }
    finalData[stringData] = ''

    console.log('stringData')
    console.log('estos son los keys')
    console.log(Object.keys(finalData))
    console.log(typeof finalData)
    sleep(SLEEP_DURATION);

    let finallyData = JSON.stringify(finalData)
    let result = http.post(
        standardURL + '/spend_attributes_apis', finalData
    );
    check(result, {
        'is status 200': (r) => r.status === 200,
        'is status 400': (r) => r.status === 400
    });
    

  });
}
