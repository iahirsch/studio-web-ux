import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillsComponent } from '../pills/pills.component';

@Component({
  selector: 'app-car-details',
  imports: [CommonModule, PillsComponent],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.css'
})
export class CarDetailsComponent {
}
