import { Component, Input, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-car',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card-car.component.html',
  styleUrl: './card-car.component.css'
})
export class CardCarComponent {
  @Input() carConnection: any;
  @Input() carInfo: any;
  bgColor = input('bg-primary-200');
  txtColor = input('text-primary-950');
  lineColor = input('bg-primary-950');

  get toCity(): string {
    if (!this.carConnection?.to) return 'Unknown';
    return this.carConnection.to.name ||
      this.carConnection.to.city ||
      'Unknown destination';
  }

  get fromCity(): string {
    if (!this.carConnection?.from) return 'Unknown';
    return this.carConnection.from.name ||
      this.carConnection.from.city ||
      'Unknown origin';
  }

  get passengerCount(): number {
    return this.carConnection?.passengers?.length || 0;
  }

  get availableSeats(): number {
    return this.carInfo?.availableSeats || 1;
  }

  get departureTime(): string {
    if (!this.carConnection?.departure) return 'TBD';
    // Format time to only show HH:MM
    return this.carConnection.departure.substring(0, 5);
  }

  get arrivalTime(): string {
    if (!this.carConnection?.arrival) return 'TBD';
    // Format time to only show HH:MM
    return this.carConnection.arrival.substring(0, 5);
  }

  get durationTime(): string {
    return this.carConnection?.duration || 'TBD';
  }
}
