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

  getFormattedDepartureTime(): string {
    if (!this.leg() || !this.leg()?.fromStopPoint?.departureData?.timetableTime) {
      return '';
    }
    const timetableTime = this.leg()?.fromStopPoint?.departureData?.timetableTime;
    return timetableTime ? this.formatTime(timetableTime) : '';
  }

  getFormattedArrivalTime(): string {
    if (!this.leg() || !this.leg()?.toStopPoint?.arrivalData?.timetableTime) {
      return '';
    }
    const timetableTime = this.leg()?.toStopPoint?.arrivalData?.timetableTime;
    return timetableTime ? this.formatTime(timetableTime) : '';
  }


  getTrainType(): string {
    if (!this.leg()) return '';
    return this.leg()?.service?.serviceLineNumber || '';
  }

  getDuration(): string {
    if (!this.leg()) return '';
    return this.leg()?.fromStopPoint?.location?.locationName || '';
  }

  getDirection(): string {
    if (!this.leg()) return '';
    const fullName = this.leg()?.toStopPoint?.location?.locationName || '';
    return fullName.split(',')[0]; // Nur den Text vor dem Komma zurückgeben
  }

  getDeparturePlatform(): string {
    if (!this.leg()) return '';
    return this.leg()?.fromStopPoint?.plannedPlatform || '';
  }

  getArrivalPlatform(): string {
    if (!this.leg()) return '';
    return this.leg()?.toStopPoint?.plannedPlatform || '';
  }

  getVehicleType(): 'bus' | 'rail' {
    if (!this.leg() || !this.leg()?.service) return 'rail'; // Default bei fehlenden Details
    const service = this.leg()?.service;
    // Prüfe auf Bus-Indikatoren
    if (service?.ptMode && service.ptMode.ptMode === 'bus') return 'bus';

    // Prüfe weitere Indikatoren (serviceLineNumber etc.)
    if (service?.serviceLineNumber && service.serviceLineNumber.startsWith('B')) return 'bus';

    // Standard: Zug zurückgeben
    return 'rail';
  }

  getVehicleIconPath(): string {
    return this.getVehicleType() === 'bus'
      ? '/assets/icons/sbb_bus.svg'
      : '/assets/icons/sbb_train.svg';
  }
}
