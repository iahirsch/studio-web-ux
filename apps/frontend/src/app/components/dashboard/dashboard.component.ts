import { Component, inject } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { env } from '../../../env/env';
import { TravelSearchComponent } from "../travel-search/travel-search.component";
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-dashboard',
  imports: [AsyncPipe, CommonModule, TravelSearchComponent],
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
}
