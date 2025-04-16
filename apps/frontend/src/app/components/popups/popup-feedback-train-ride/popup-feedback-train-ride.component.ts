import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberItemComponent } from '../../member-item/member-item.component';
import { BtnPrimaryComponent } from '../../btn-primary/btn-primary.component';
import { CardCarComponent } from '../../card-car/card-car.component';

@Component({
  selector: 'app-popup-feedback-train-ride',
  imports: [
    CommonModule,
    MemberItemComponent,
    BtnPrimaryComponent,
    CardCarComponent,
  ],
  templateUrl: './popup-feedback-train-ride.component.html',
  styleUrl: './popup-feedback-train-ride.component.css',
})
export class PopupFeedbackTrainRideComponent {}
