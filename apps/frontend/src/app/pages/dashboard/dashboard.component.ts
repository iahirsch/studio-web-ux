import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { env } from '../../../env/env';
import { OAuthService } from 'angular-oauth2-oidc';
import { CardGreetingComponent } from '../../components/card-greeting/card-greeting.component';
import { BtnLocationComponent } from '../../components/btn-location/btn-location.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';


@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, CardGreetingComponent, BtnLocationComponent, BtnPrimaryComponent],
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


  userName = signal(this.userInfo['name']);

  api$ = this.httpClient
    .get<{ message: string }>(env.api)
    .pipe(map((res) => res.message));

  testFunction() {
    console.log('test');
  }
}
