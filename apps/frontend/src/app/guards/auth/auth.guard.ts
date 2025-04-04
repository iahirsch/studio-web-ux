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
  //const router = inject(Router);

  if (oauthService.hasValidAccessToken() && oauthService.hasValidIdToken()) {

    const idToken = oauthService.getIdToken();
    httpClient.post(`${env.api}/auth/save-user`, { idToken }).subscribe({
      next: (res: any) => console.log('User saved: ', res),
      error: (err: any) => console.error('Error saving user: ', err)
    });
    return true;
  }

  return oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {

    if (oauthService.hasValidAccessToken() && oauthService.hasValidIdToken()) {
      const idToken = oauthService.getIdToken();
      httpClient.post(`${env.api}/auth/save-user`, { idToken }).subscribe({
        next: (res: any) => console.log('User saved: ', res),
        error: (err: any) => console.log('Error saving user: ', err)
      });
      return true;
    }

    oauthService.initLoginFlow(state.url);
    //router.navigate(['/login']);
    return false;
  });
};
