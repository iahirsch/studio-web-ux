// card-train-details.component.ts
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TripTimedLeg } from 'ojp-sdk';

@Component({
  selector: 'app-card-train-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-train-details.component.html',
  styleUrl: './card-train-details.component.css'
})
export class CardTrainDetailsComponent {
  // Input für ein TripTimedLeg (ein Zugabschnitt)
  leg = input<TripTimedLeg | undefined>(undefined);

  // Hilfsmethoden zum Formatieren
  formatTime(dateString: string | Date): string {
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  getTrainType(): string {
    if (!this.leg()) return '';
    // Je nach Verfügbarkeit in der API
    return this.leg()?.service?.serviceLineNumber || '';
  }

  getDirection(): string {
    if (!this.leg()) return '';
    // Je nach Verfügbarkeit in der API
    return this.leg()?.toStopPoint?.location?.locationName || '';
  }

  getDeparturePlatform(): string {
    if (!this.leg()) return '';
    return this.leg()?.fromStopPoint?.plannedPlatform || '';
  }

  getArrivalPlatform(): string {
    if (!this.leg()) return '';
    return this.leg()?.toStopPoint?.plannedPlatform || '';
  }
}
