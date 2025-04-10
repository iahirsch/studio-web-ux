import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillsComponent } from '../pills/pills.component';
import { InputTextComponent } from '../input-text/input-text.component';

@Component({
  selector: 'app-car-info',
  imports: [CommonModule, PillsComponent, InputTextComponent],
  templateUrl: './car-info.component.html',
  styleUrl: './car-info.component.css'
})
export class CarInfoComponent {
}
