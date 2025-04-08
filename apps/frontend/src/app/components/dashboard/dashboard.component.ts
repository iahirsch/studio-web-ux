import { Component, inject, signal } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { env } from '../../../env/env';
import { TravelSearchComponent } from '../travel-search/travel-search.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { CardGreetingComponent } from '../card-greeting/card-greeting.component';
import { LocationButtonComponent } from '../location-button/location-button.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    AsyncPipe,
    CommonModule,
    CardGreetingComponent,
    TravelSearchComponent,
    LocationButtonComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  constructor() {
    console.log(this.userInfo);
  }

  private oauthService = inject(OAuthService);
  private httpClient = inject(HttpClient);
  userInfo = this.oauthService.getIdentityClaims();

  logout = () => this.oauthService.logOut();

  userName = signal(this.userInfo['name']);

  api$ = this.httpClient
    .get<{ message: string }>(env.api)
    .pipe(map((res) => res.message));

  testFunction() {
    console.log('test');
  }
}
