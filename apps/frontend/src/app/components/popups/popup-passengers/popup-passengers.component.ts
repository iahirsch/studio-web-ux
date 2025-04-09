import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MemberItemComponent } from '../../member-item/member-item.component';

@Component({
  selector: 'app-popup-passengers',
  imports: [CommonModule, MemberItemComponent],
  templateUrl: './popup-passengers.component.html',
  styleUrl: './popup-passengers.component.css'
})
export class PopupPassengersComponent {
}
