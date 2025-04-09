import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextareaComponent } from '../input-textarea/input-textarea.component';

@Component({
  selector: 'app-available-seats',
  imports: [CommonModule, InputTextareaComponent],
  templateUrl: './available-seats.component.html',
  styleUrl: './available-seats.component.css'
})
export class AvailableSeatsComponent {
}
