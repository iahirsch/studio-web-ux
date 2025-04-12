import { Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InputTextareaComponent } from '../input-textarea/input-textarea.component';

@Component({
  selector: 'app-available-seats',
  imports: [CommonModule, InputTextareaComponent, NgOptimizedImage],
  templateUrl: './available-seats.component.html',
  styleUrl: './available-seats.component.css',
})
export class AvailableSeatsComponent {
  increment() {
    if (this.passengers() <= 8) {
      this.passengers.update((value) => value + 1);
    }
  }

  decrement() {
    if (this.passengers() >= 2) {
      this.passengers.update((value) => value - 1);
    }
  }

  passengers = signal(1);
}
