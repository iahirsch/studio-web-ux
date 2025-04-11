import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { authConfig } from './auth.config';
import { HttpClient } from '@angular/common/http';
import { env } from '../../../env/env';

export const authGuard: CanActivateFn = (_route, state) => {
  const oauthService = inject(OAuthService);
  oauthService.configure(authConfig);
  const httpClient = inject(HttpClient);

  return oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
    if (oauthService.hasValidAccessToken() && oauthService.hasValidIdToken()) {
      callbackSaveUser();
      return true;
    }

    oauthService.initLoginFlow(state.url);
    return false;
  });

  function callbackSaveUser() {
    const idToken = oauthService.getIdToken();
    httpClient.post(`${env.api}/auth/saveUser`, { idToken }).subscribe({
      next: (res) => console.log('User saved: ', res),
      error: (err) => console.error('Error saving user: ', err),
    });
  }
};
