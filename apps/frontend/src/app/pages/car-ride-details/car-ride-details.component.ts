import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardCarComponent } from '../../components/card-car/card-car.component';
import { RiderItemComponent } from '../../components/rider-item/rider-item.component';
import { MapPinLocationComponent } from '../../components/map-pin-location/map-pin-location.component';
import { CardMembersComponent } from '../../components/card-members/card-members.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';

@Component({
  selector: 'app-car-ride-details',
  imports: [CommonModule, CardCarComponent, RiderItemComponent, MapPinLocationComponent, CardMembersComponent, BtnPrimaryComponent],
  templateUrl: './car-ride-details.component.html',
  styleUrl: './car-ride-details.component.css'
})
export class CarRideDetailsComponent {
}
