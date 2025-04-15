import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberItemComponent } from '../../member-item/member-item.component';
import { CardCarComponent } from '../../card-car/card-car.component';
import { BtnPrimaryComponent } from '../../btn-primary/btn-primary.component';
import { BtnSecondaryComponent } from '../../btn-secondary/btn-secondary.component';
import { InputTextareaComponent } from '../../input-textarea/input-textarea.component';

@Component({
  selector: 'app-popup-ride-request-confirmation',
  imports: [
    CommonModule,
    MemberItemComponent,
    CardCarComponent,
    BtnPrimaryComponent,
    BtnSecondaryComponent,
    InputTextareaComponent,
  ],
  templateUrl: './popup-ride-request-confirmation.component.html',
  styleUrl: './popup-ride-request-confirmation.component.css',
})
export class PopupRideRequestConfirmationComponent {}
