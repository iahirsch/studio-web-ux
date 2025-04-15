import { Component, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { env } from '../../../env/env';
import { OAuthService } from 'angular-oauth2-oidc';
import { BtnLocationComponent } from '../../components/btn-location/btn-location.component';
import {
  HsluLocationDataService,
  Location,
} from '../../services/hslu-location/hslu-location.service';
import { CardGreetingComponent } from '../../components/card-greeting/card-greeting.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { Router, RouterLink } from '@angular/router';
import { PopupFeedbackTrainRideComponent } from '../../components/popups/popup-feedback-train-ride/popup-feedback-train-ride.component';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    BtnLocationComponent,
    NgFor,
    CardGreetingComponent,
    BtnPrimaryComponent,
    RouterLink,
    PopupFeedbackTrainRideComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css',
})
export class DashboardComponent {
  locations: Location[] = [];

  constructor(
    private locationService: HsluLocationDataService,
    private router: Router
  ) {
    this.locations = this.locationService.getHsluLocations();
  }

  onLocationButtonClick(coordinates: string) {
    // Hier die Logik für das Handling der Koordinaten
    console.log('Koordinaten wurden geklickt:', coordinates);
    this.router.navigate(['/search-ride'], {
      queryParams: { coordinates: coordinates },
    });
    // Weitere Aktionen wie Navigation zur Karte oder Speichern des ausgewählten Ortes
  }

  private oauthService = inject(OAuthService);
  private httpClient = inject(HttpClient);
  userInfo = this.oauthService.getIdentityClaims();

  userName = this.userInfo['name'];

  api$ = this.httpClient
    .get<{ message: string }>(env.api)
    .pipe(map((res) => res.message));
}
