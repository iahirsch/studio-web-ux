import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardCarComponent } from '../../card-car/card-car.component';
import { MemberItemComponent } from '../../member-item/member-item.component';
import { BtnPrimaryComponent } from '../../btn-primary/btn-primary.component';

@Component({
  selector: 'app-popup-feedback-car-ride',
  imports: [CommonModule, CardCarComponent, MemberItemComponent, BtnPrimaryComponent],
  templateUrl: './popup-feedback-car-ride.component.html',
  styleUrl: './popup-feedback-car-ride.component.css'
})
export class PopupFeedbackCarRideComponent {
}
