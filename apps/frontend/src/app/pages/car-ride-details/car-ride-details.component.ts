import { Component, inject } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { CardCarComponent } from '../../components/card-car/card-car.component';
import { RiderItemComponent } from '../../components/rider-item/rider-item.component';
import { MapLocation, MapPinLocationComponent } from '../../components/map-pin-location/map-pin-location.component';
import { CardMembersComponent } from '../../components/card-members/card-members.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';

@Component({
  selector: 'app-car-ride-details',
  imports: [CommonModule, CardCarComponent, RiderItemComponent, MapPinLocationComponent, CardMembersComponent, BtnPrimaryComponent],
  templateUrl: './car-ride-details.component.html',
  styleUrl: './car-ride-details.component.css'
})
export class CarRideDetailsComponent {
  private location = inject(Location);

  meetingPoint: MapLocation = {
    longitude: 8.277735,
    latitude: 47.072062,
    label: ''
  };

  meetingTime: Date | undefined = undefined;

  goBack(): void {
    this.location.back();
  }

}
