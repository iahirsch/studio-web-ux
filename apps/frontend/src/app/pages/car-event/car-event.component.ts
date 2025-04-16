import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CardCarComponent } from '../../components/card-car/card-car.component';
import { RiderItemComponent } from '../../components/rider-item/rider-item.component';
import { CarDetailsComponent } from '../../components/car-details/car-details.component';
import { CardMembersComponent } from '../../components/card-members/card-members.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { MapLocation, MapPinLocationComponent } from '../../components/map-pin-location/map-pin-location.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { BtnSecondaryComponent } from '../../components/btn-secondary/btn-secondary.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CarConnectionService } from '../../services/car-connection/car-connection.service';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-car-event',
  imports: [CommonModule, CardCarComponent, RiderItemComponent, CarDetailsComponent, CardMembersComponent, ChatComponent, MapPinLocationComponent, BtnPrimaryComponent, BtnSecondaryComponent, RouterLink],
  templateUrl: './car-event.component.html',
  styleUrl: './car-event.component.css'
})
export class CarEventComponent implements OnInit {
  carConnectionId: string | null = null;
  carConnection: any = null;
  carInfo: any = null;
  isLoading = true;
  error: string | null = null;
  showDeleteConfirmDialog = false;

  private location = inject(Location);
  private oauthService = inject(OAuthService);

  meetingPoint: MapLocation = {
    longitude: 8.277735,
    latitude: 47.072062,
    label: ''
  };

  meetingTime: Date | undefined = undefined;

  constructor(
    private route: ActivatedRoute,
    private carConnectionService: CarConnectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Get the id from the route parameter
    this.route.paramMap.subscribe(params => {
      this.carConnectionId = params.get('id');
      if (this.carConnectionId) {
        this.loadCarConnectionData(this.carConnectionId);
      }
    });
  }

  loadCarConnectionData(id: string): void {
    this.isLoading = true;

    this.carConnectionService.getCarConnection(id).subscribe({
      next: (data) => {
        this.carConnection = data;
        this.carInfo = data.carInfo;

        // Update meeting point if available
        if (data.meetingPoint) {
          this.meetingPoint = {
            longitude: data.meetingPoint.longitude,
            latitude: data.meetingPoint.latitude,
            label: data.meetingPoint.label || ''
          };
        }

        // Add proper date validation
        if (data.departure && !isNaN(new Date(data.departure).getTime())) {
          this.meetingTime = new Date(data.departure);
        } else {
          this.meetingTime = undefined;
        }

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load car connection data', err);
        this.error = 'Failed to load car connection data';
        this.isLoading = false;
      }
    });
  }

  onSecondaryButtonClick(): void {
    const userInfo = this.oauthService.getIdentityClaims();

    if (this.carConnection?.user?.id === userInfo['sub']) {
      // User is the owner - show the custom confirmation dialog
      this.showDeleteConfirmDialog = true;
    } else {
      console.log('Passenger');
      // TODO: remove user from passengers in database
    }
  }

  confirmDelete(): void {
    this.carConnectionService.deleteCarConnection(this.carConnectionId as string)
      .subscribe({
        next: () => {
          console.log('Fahrgemeinschaft erfolgreich gelöscht');
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          console.error('Fehler beim Löschen der Fahrgemeinschaft', err);
        }
      });
    this.showDeleteConfirmDialog = false;
  }

  cancelDelete(): void {
    this.showDeleteConfirmDialog = false;
  }

  get secondaryButtonText(): string {
    const userInfo = this.oauthService.getIdentityClaims();
    if (this.carConnection?.user?.id === userInfo['sub']) {
      return 'Fahrgemeinschaft löschen';
    } else {
      return 'Von Fahrgemeinschaft austragen';
    }
  }

  goBack(): void {
    this.location.back();
  }
}
