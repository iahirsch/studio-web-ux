import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberItemComponent } from '../../member-item/member-item.component';
import { InputTextareaComponent } from '../../input-textarea/input-textarea.component';
import { BtnPrimaryComponent } from '../../btn-primary/btn-primary.component';
import { BtnSecondaryComponent } from '../../btn-secondary/btn-secondary.component';

@Component({
  selector: 'app-popup-ride-request',
  imports: [CommonModule, MemberItemComponent, InputTextareaComponent, BtnPrimaryComponent, BtnSecondaryComponent],
  templateUrl: './popup-ride-request.component.html',
  styleUrl: './popup-ride-request.component.css'
})
export class PopupRideRequestComponent {
}
