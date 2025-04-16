// card-train.component.ts - TrainConnectionService importieren und injizieren
import { Component, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip, TripTimedLeg } from 'ojp-sdk';
import { Router } from '@angular/router';
import { TrainConnectionService } from '../../services/train-connection/train-conntection.service';

@Component({
  selector: 'app-card-train',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-train.component.html',
  styleUrl: './card-train.component.css'

})
export class CardTrainComponent {
  public router = inject(Router);
  private trainConnectionService = inject(TrainConnectionService);

  departure = input<string>('');
  arrival = input<string>('');
  duration = input<string>('');
  transfers = input<number>(0);
  platforms = input<string[]>([]);
  serviceName = input<string>('');
  destinationName = input<string>('');
  tripDetails = input<Trip | undefined>(undefined);
  isClickable = input<boolean>(true);

  get isOnDetailsPage(): boolean {
    return this.router.url.includes('train-ride-details');
  }

  get effectivelyClickable(): boolean {
    return this.isClickable() && !this.isOnDetailsPage;
  }
  getServiceLineNumber(): string {
    if (!this.tripDetails() || !this.tripDetails()?.legs) return '';

    const timedLegs = this.tripDetails()?.legs.filter(leg =>
      leg.legType === 'TimedLeg'
    ) as TripTimedLeg[];

    if (timedLegs.length > 0 && timedLegs[0].service) {
      return timedLegs[0].service.serviceLineNumber || '';
    }

    return this.serviceName() || ''; // Fallback auf serviceName falls keine serviceLineNumber gefunden
  }

  getDestinationLocationName(): string {
    if (!this.tripDetails() || !this.tripDetails()?.legs) {
      return (this.destinationName() || '').split(',')[0]; // Nur Text vor dem Komma
    }

    const timedLegs = this.tripDetails()?.legs.filter(leg =>
      leg.legType === 'TimedLeg'
    ) as TripTimedLeg[];

    if (timedLegs.length > 0) {
      // Nimm den Zielort des letzten Legs (Endstation)
      const lastLeg = timedLegs[timedLegs.length - 1];
      const fullName = lastLeg.toStopPoint?.location?.locationName || this.destinationName() || '';
      return fullName.split(',')[0]; // Nur den Text vor dem Komma zurückgeben
    }

    return (this.destinationName() || '').split(',')[0]; // Fallback - auch nur vor dem Komma
  }

  getDepartureLocationName(): string {
    if (!this.tripDetails() || !this.tripDetails()?.legs) {
      // Fallback: Wenn keine Trip-Details vorhanden sind, versuche aus dem Abfahrtsort zu extrahieren
      return 'Abfahrtsort'; // Hier könntest du einen anderen Fallback verwenden, falls verfügbar
    }

    const timedLegs = this.tripDetails()?.legs.filter(leg =>
      leg.legType === 'TimedLeg'
    ) as TripTimedLeg[];

    if (timedLegs.length > 0) {
      // Nimm den Abfahrtsort des ersten Legs (Startstation)
      const firstLeg = timedLegs[0];
      const fullName = firstLeg.fromStopPoint?.location?.locationName || 'Abfahrtsort';
      return fullName.split(',')[0]; // Nur den Text vor dem Komma zurückgeben
    }

    return 'Abfahrtsort'; // Fallback
  }

  getVehicleType(): 'bus' | 'rail' {
    if (!this.tripDetails() || !this.tripDetails()?.legs) return 'rail'; // Default bei fehlenden Details

    const timedLegs = this.tripDetails()?.legs.filter(leg => leg.legType === 'TimedLeg') as TripTimedLeg[];

    if (timedLegs.length > 0 && timedLegs[0].service) {
      const service = timedLegs[0].service;

      if (service.ptMode && service.ptMode.ptMode === 'bus') return 'bus';
    }

    // Standardmäßig Zug zurückgeben
    return 'rail';
  }

  getVehicleIconPath(): string {
    return this.getVehicleType() === 'bus'
      ? '/assets/icons/bus_icon.svg'
      : '/assets/icons/train_light_purple.svg';
  }
  onCardClick(): void {

    if (!this.effectivelyClickable) {
      console.log('Card is not clickable');
      return;
    }

    // Legs aus tripDetails extrahieren
    const legs = this.tripDetails()?.legs?.filter(leg =>
      leg.legType === 'TimedLeg'
    ) as TripTimedLeg[] || [];

    // Nur wenn wir NICHT auf der Details-Seite sind:
    this.trainConnectionService.setSelectedConnection({
      departure: this.departure(),
      arrival: this.arrival(),
      duration: this.duration(),
      transfers: this.transfers(),
      platforms: this.platforms(),
      serviceName: this.serviceName(),
      destinationName: this.destinationName(),
      tripDetails: this.tripDetails(),
      legs: legs
    });

    if (this.tripDetails()?.id) {
      this.router.navigate(['/train-ride-details', this.tripDetails()?.id]);
    } else {
      this.router.navigate(['/train-ride-details']);

    }
  }
}
