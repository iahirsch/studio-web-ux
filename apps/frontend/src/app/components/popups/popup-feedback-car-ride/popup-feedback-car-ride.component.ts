import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardCarComponent } from '../../card-car/card-car.component';
import { MemberItemComponent } from '../../member-item/member-item.component';
import { BtnPrimaryComponent } from '../../btn-primary/btn-primary.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-popup-feedback-car-ride',
  imports: [CommonModule, CardCarComponent, MemberItemComponent, BtnPrimaryComponent, RouterLink],
  templateUrl: './popup-feedback-car-ride.component.html',
  styleUrl: './popup-feedback-car-ride.component.css'
})
export class PopupFeedbackCarRideComponent {
  @Input() carInfo: any;
  @Input() carConnection: any;
  @Output() popupClosed = new EventEmitter<void>();

  closePopup() {
    this.popupClosed.emit();
  }
}
