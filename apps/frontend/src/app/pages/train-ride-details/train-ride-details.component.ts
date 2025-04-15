// train-ride-details.component.ts - Methoden aktivieren und korrigieren
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardTrainComponent } from '../../components/card-train/card-train.component';
import { CardMembersComponent } from '../../components/card-members/card-members.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { ActivatedRoute } from '@angular/router';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { Trip } from 'ojp-sdk';
import { TrainConnection, TrainConnectionService } from '../../services/train-connection/train-conntection.service';

@Component({
  selector: 'app-train-ride-details',
  imports: [CommonModule, CardTrainComponent, CardMembersComponent, BtnPrimaryComponent],
  templateUrl: './train-ride-details.component.html',
  styleUrl: './train-ride-details.component.css'
})
export class TrainRideDetailsComponent {
  private route = inject(ActivatedRoute);
  private ojpSdkService = inject(OjpSdkService);
  private trainConnectionService = inject(TrainConnectionService);

  trainConnections = signal<TrainConnection[]>([]);
  tripId = signal<string | null>(null);
  trip = signal<Trip | null>(null);

  constructor() {
    // Zuerst prüfen, ob eine Verbindung im Service ist
    const savedConnection = this.trainConnectionService.getSelectedConnection();
    if (savedConnection) {
      this.trainConnections.set([savedConnection]);
    } else {
      // Sonst Parameter aus der URL auslesen
      this.route.paramMap.subscribe(params => {
        const id = params.get('id');
        this.tripId.set(id);

        if (id) {
          // Trip-Details laden
          this.loadTripDetails(id);
        }
      });
    }
  }

  private loadTripDetails(id: string): void {
    this.ojpSdkService.getTripById(id)
      .then(trip => {
        if (trip) {
          this.trip.set(trip);

          // Verbindungsinformationen aus dem Trip extrahieren
          /* const connection: TrainConnection = {
             departure: this.formatTime(new Date(trip.startTime)),
             arrival: this.formatTime(new Date(trip.endTime)),
             duration: this.formatDuration(trip.duration),
             transfers: trip.transfers || 0,
             platforms: trip.platforms || [],
             serviceName: trip.service || '',
             destinationName: trip.destination || '',
             tripDetails: trip
           };

           this.trainConnections.set([connection]);*/
        }
      })
      .catch(error => {
        console.error('Fehler beim Laden der Trip-Details:', error);
      });
  }

  // Hilfsmethoden zum Formatieren von Zeit und Dauer
  private formatTime(date: Date): string {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  private formatDuration(durationInSeconds: number): string {
    const hours = Math.floor(durationInSeconds / 3600);
    const minutes = Math.floor((durationInSeconds % 3600) / 60);

    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    } else {
      return `${minutes}min`;
    }
  }
}
