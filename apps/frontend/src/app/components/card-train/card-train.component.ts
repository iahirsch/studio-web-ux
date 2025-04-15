// card-train.component.ts - TrainConnectionService importieren und injizieren
import { Component, inject, input } from '@angular/core';
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


  onCardClick(): void {

    if (!this.effectivelyClickable) {
      console.log('Card is not clickable');
      return;
    }

    // Nur wenn wir NICHT auf der Details-Seite sind:
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

    if (this.tripDetails()?.id) {
      this.router.navigate(['/train-ride-details', this.tripDetails()?.id]);
    } else {
      this.router.navigate(['/train-ride-details']);

    }
  }
}
