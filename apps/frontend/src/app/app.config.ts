import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AuthConfig, provideOAuthClient } from 'angular-oauth2-oidc';
import { env } from '../env/env';
import { authConfig } from './services/auth/auth.config';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptorsFromDi()),
    provideOAuthClient({
      resourceServer: {
        sendAccessToken: true,
        allowedUrls: [env.api]
      }
    }),
    { provide: AuthConfig, useValue: authConfig },
    { provide: LocationStrategy, useClass: HashLocationStrategy }
  ]
};
