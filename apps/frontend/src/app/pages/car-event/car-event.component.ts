import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardCarComponent } from '../../components/card-car/card-car.component';
import { RiderItemComponent } from '../../components/rider-item/rider-item.component';
import { CarDetailsComponent } from '../../components/car-details/car-details.component';
import { CardMembersComponent } from '../../components/card-members/card-members.component';
import { ChatComponent } from '../../components/chat/chat.component';
import { MapPinLocationComponent } from '../../components/map-pin-location/map-pin-location.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { BtnSecondaryComponent } from '../../components/btn-secondary/btn-secondary.component';

@Component({
  selector: 'app-car-event',
  imports: [CommonModule, CardCarComponent, RiderItemComponent, CarDetailsComponent, CardMembersComponent, ChatComponent, MapPinLocationComponent, BtnPrimaryComponent, BtnSecondaryComponent],
  templateUrl: './car-event.component.html',
  styleUrl: './car-event.component.css'
})
export class CarEventComponent {
}
