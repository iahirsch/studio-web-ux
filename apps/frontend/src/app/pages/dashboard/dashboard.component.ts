import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, NgFor, ViewportScroller } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs';
import { env } from '../../../env/env';
import { OAuthService } from 'angular-oauth2-oidc';
import { BtnLocationComponent } from '../../components/btn-location/btn-location.component';
import { HsluLocationDataService, Location } from '../../services/hslu-location/hslu-location.service';
import { CardGreetingComponent } from '../../components/card-greeting/card-greeting.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { Router, RouterLink } from '@angular/router';
import { CardCarComponent } from '../../components/card-car/card-car.component';
import { CarConnectionService } from '../../services/car-connection/car-connection.service';

@Component({
  selector: 'app-dashboard',
  imports: [
    CommonModule,
    BtnLocationComponent,
    NgFor,
    CardGreetingComponent,
    BtnPrimaryComponent,
    RouterLink,
    CardCarComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  locations: Location[] = [];
  userCarConnections: any[] = [];

  private oauthService = inject(OAuthService);
  private httpClient = inject(HttpClient);
  private carConnectionService = inject(CarConnectionService);
  private viewportScroller = inject(ViewportScroller);

  userInfo = this.oauthService.getIdentityClaims();
  userName = this.userInfo['name'];

  constructor(
    private locationService: HsluLocationDataService,
    private router: Router
  ) {
    this.locations = this.locationService.getHsluLocations();
  }

  ngOnInit(): void {
    this.loadUserCarConnections();
    this.viewportScroller.scrollToPosition([0, 0]);
  }

  onLocationButtonClick(coordinates: string) {
    // Hier die Logik für das Handling der Koordinaten
    console.log('Koordinaten wurden geklickt:', coordinates);
    this.router.navigate(['/search-ride'], {
      queryParams: { coordinates: coordinates }
    });
    // Weitere Aktionen wie Navigation zur Karte oder Speichern des ausgewählten Ortes
  }

  private loadUserCarConnections() {
    this.carConnectionService.getUserCarConnections().subscribe({
      next: (connections) => {
        this.userCarConnections = connections;
      },
      error: (error) => {
        console.error('Error fetching user car connections:', error);
      }
    });
  }

  api$ = this.httpClient
    .get<{ message: string }>(env.api)
    .pipe(map((res) => res.message));

}
