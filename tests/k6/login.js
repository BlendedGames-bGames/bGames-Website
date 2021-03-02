import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '5m', target: 100 }, // simulate ramp-up of traffic from 1 to 100 users over 5 minutes.
    { duration: '10m', target: 100 }, // stay at 100 users for 10 minutes
    { duration: '5m', target: 0 }, // ramp-down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% of requests must complete below 1.5s
    'logged in successfully': ['p(99)<1500'], // 99% of requests must complete below 1.5s
  },
};
const SLEEP_DURATION = 0.1;

export default function () {
  let body = JSON.stringify({
    username: 'user_' + __ITER,
    password: 'PASSWORD',
  });
  let params = {
    headers: {
      'Content-Type': 'application/json',
    },
    tags: {
      name: 'login', // first request
    },
  };

  group('simple user journey', (_) => {
    // Login request
    let login_response = http.post(
      'http://api.yourplatform.com/v2/login',
      body,
      params,
    );
    check(login_response, {
      'is status 200': (r) => r.status === 200,
      'is api key present': (r) => r.json().hasOwnProperty('api_key'),
    });
    params.headers['api-key'] = login_response.json()['api_key'];
    sleep(SLEEP_DURATION);

    // Get user profile request
    params.tags.name = 'get-user-profile';
    let user_profile_response = http.get(
      'http://api.yourplatform.com/v2/users/user_' + __ITER + '/profile',
      params,
    );
    sleep(SLEEP_DURATION);

    // Update user profile request
    body = JSON.string({
      first_name: 'user_' + __ITER,
    });
    params.tags.name = 'update-user-profile';
    let update_profile_response = http.post(
      'http://api.yourplatform.com/v2/users/user_' + __ITER + '/profile',
      body,
      params,
    );
    sleep(SLEEP_DURATION);

    // Logout request
    params.tags.name = 'logout';
    let logout_response = http.get(
      'http://api.yourplatform.com/v2/logout',
      params,
    );
    sleep(SLEEP_DURATION);
  });
}
