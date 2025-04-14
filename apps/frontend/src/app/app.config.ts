import { ApplicationConfig, LOCALE_ID, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { HashLocationStrategy, LocationStrategy, registerLocaleData } from '@angular/common';
import { AuthConfig, provideOAuthClient } from 'angular-oauth2-oidc';
import { env } from '../env/env';
import { authConfig } from './guards/auth/auth.config';
import localeDe from '@angular/common/locales/de';

registerLocaleData(localeDe);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    { provide: LOCALE_ID, useValue: 'de-DE' },

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
