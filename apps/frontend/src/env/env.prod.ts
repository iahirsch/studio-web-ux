import { ApiConfig } from 'ojp-sdk';

export const env = {
  production: true,
  mapboxToken: 'pk.eyJ1IjoiYnVya2l3b3JsZCIsImEiOiJjbTkxMWJ2cmkwcTI5MmpzOG9yeXNkNWFpIn0.28-wWSlUSDrYY7omzhMVkQ',
  api: 'https://studio-web-ux-0e3341d14bde.herokuapp.com/api',
  redirectUri: 'https://iahirsch.github.io/studio-web-ux',
  auth0Domain: 'https://dev-mn5tlewhdz5uqpzv.eu.auth0.com/',
  auth0ClientId: 'USWXQqNJ8rHdNVGeBs3KdbQ6Yeu5hicj',
  ojp: {
    url: 'https://api.opentransportdata.swiss/ojp2020',
    authToken: 'eyJvcmciOiI2NDA2NTFhNTIyZmEwNTAwMDEyOWJiZTEiLCJpZCI6IjlhZjk1MzUwNDhhZTQyMTE5NjYyZGMxYTY2ODUyMDcyIiwiaCI6Im11cm11cjEyOCJ9'
  } as ApiConfig
};
