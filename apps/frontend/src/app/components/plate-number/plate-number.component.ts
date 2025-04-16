import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextComponent } from '../input-text/input-text.component';

@Component({
  selector: 'app-plate-number',
  imports: [CommonModule, InputTextComponent],
  templateUrl: './plate-number.component.html',
  styleUrl: './plate-number.component.css'
})
export class PlateNumberComponent {}
