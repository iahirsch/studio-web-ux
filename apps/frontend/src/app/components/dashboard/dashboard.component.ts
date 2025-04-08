import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { env } from '../../../env/env';
import { OAuthService } from 'angular-oauth2-oidc';
import { CardGreetingComponent } from '../card-greeting/card-greeting.component';
import { LocationButtonComponent } from '../location-button/location-button.component';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CardGreetingComponent, LocationButtonComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  private oauthService = inject(OAuthService);
  private httpClient = inject(HttpClient);

  logout = () => this.oauthService.logOut();

  api$ = this.httpClient
    .get<{ message: string }>(env.api)
    .pipe(map((res) => res.message));

  testFunction() {
    console.log('testFunction');
  }
}
