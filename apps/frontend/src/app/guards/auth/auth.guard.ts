import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const authGuard: CanActivateFn = (_route, state) => {
  const oauthService = inject(OAuthService);
  //const router = inject(Router);

  if (oauthService.hasValidAccessToken()) {
    return true;
  }

  return oauthService.loadDiscoveryDocumentAndTryLogin().then(() => {
    if (oauthService.hasValidAccessToken()) {
      return true;
    }
    oauthService.initLoginFlow(state.url);
    //router.navigate(['/login']);
    return false;
  });
};
