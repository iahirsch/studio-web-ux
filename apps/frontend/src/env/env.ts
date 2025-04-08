import { ApiConfig } from 'ojp-sdk';

export const env = {
  production: false,
  api: 'http://localhost:3000/api',
  redirectUri: 'http://localhost:4200',
  auth0Domain: 'https://dev-mn5tlewhdz5uqpzv.eu.auth0.com/',
  auth0ClientId: 'USWXQqNJ8rHdNVGeBs3KdbQ6Yeu5hicj',
  ojp: {
    url: 'https://api.opentransportdata.swiss/ojp2020',
    authToken: 'eyJvcmciOiI2NDA2NTFhNTIyZmEwNTAwMDEyOWJiZTEiLCJpZCI6IjlhZjk1MzUwNDhhZTQyMTE5NjYyZGMxYTY2ODUyMDcyIiwiaCI6Im11cm11cjEyOCJ9',
  } as ApiConfig,
};

