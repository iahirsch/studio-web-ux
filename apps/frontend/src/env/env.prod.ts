import { ApiConfig } from 'ojp-sdk';

export const env = {
  production: true,
  api: 'https://studio-web-ux-0e3341d14bde.herokuapp.com/api',
  ojp: {
    url: 'https://api.opentransportdata.swiss/ojp2020',
    authToken: 'eyJvcmciOiI2NDA2NTFhNTIyZmEwNTAwMDEyOWJiZTEiLCJpZCI6IjlhZjk1MzUwNDhhZTQyMTE5NjYyZGMxYTY2ODUyMDcyIiwiaCI6Im11cm11cjEyOCJ9',
  } as ApiConfig,
};
