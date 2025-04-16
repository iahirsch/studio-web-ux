import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberItemComponent } from '../../member-item/member-item.component';
import { BtnPrimaryComponent } from '../../btn-primary/btn-primary.component';
import { CardCarComponent } from '../../card-car/card-car.component';

@Component({
  selector: 'app-popup-passengers',
  imports: [
    CommonModule,
    MemberItemComponent,
    BtnPrimaryComponent,
    CardCarComponent,
  ],
  templateUrl: './popup-passengers.component.html',
  styleUrl: './popup-passengers.component.css',
})
export class PopupPassengersComponent {}
