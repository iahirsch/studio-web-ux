import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { env } from '../../../env/env';
import { TravelSearchComponent } from '../travel-search/travel-search.component';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, TravelSearchComponent],
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
