// card-train.component.ts - TrainConnectionService importieren und injizieren
import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Trip } from 'ojp-sdk';
import { Router } from '@angular/router';
import { TrainConnectionService } from '../../services/train-connection/train-conntection.service';

@Component({
  selector: 'app-card-train',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-train.component.html',
  styleUrls: ['./card-train.component.css']
})
export class CardTrainComponent {
  private router = inject(Router);
  private trainConnectionService = inject(TrainConnectionService);

  departure = input<string>('');
  arrival = input<string>('');
  duration = input<string>('');
  transfers = input<number>(0);
  platforms = input<string[]>([]);
  serviceName = input<string>('');
  destinationName = input<string>('');
  tripDetails = input<Trip | undefined>(undefined);

  // Flag für erweiterte Details
  expanded = signal(false);

  // Berechnete Werte
  transferText = computed(() => {
    if (this.transfers() === 0) {
      return 'Direktverbindung';
    } else if (this.transfers() === 1) {
      return '1 Umstieg';
    } else {
      return `${this.transfers()} Umstiege`;
    }
  });

  departurePlatform = computed(() => {
    const platformsValue = this.platforms();
    return platformsValue && platformsValue.length > 0 ? platformsValue[0] : '';
  });

  arrivalPlatform = computed(() => {
    const platformsValue = this.platforms();
    return platformsValue && platformsValue.length > 0 ? platformsValue[platformsValue.length - 1] : '';
  });

  // Methoden
  toggleExpanded(): void {
    this.expanded.update(value => !value);
  }

  navigateToDetails(): void {
    if (this.tripDetails()) {
      // Speichern der Verbindungsdaten im Service
      this.trainConnectionService.setSelectedConnection({
        departure: this.departure(),
        arrival: this.arrival(),
        duration: this.duration(),
        transfers: this.transfers(),
        platforms: this.platforms(),
        serviceName: this.serviceName(),
        destinationName: this.destinationName(),
        tripDetails: this.tripDetails()
      });

      this.router.navigate(['/train-ride-details', this.tripDetails()?.id]);
    }
  }
}
