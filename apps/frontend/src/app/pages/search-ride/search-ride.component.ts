import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationSelectorComponent } from '../../components/location-selector/location-selector.component';
import { DateTimePickerComponent } from '../../components/date-time-picker/date-time-picker.component';
import { CardCarComponent } from '../../components/card-car/card-car.component';
import { CardTrainComponent } from '../../components/card-train/card-train.component';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { Trip } from 'ojp-sdk';
import { RouterModule } from '@angular/router';

interface TrainConnection {
  trainNumber: string;
  trainEndLocation: string;
  departure: string;
  arrival: string;
  duration: string;
  transfers: number;
  platforms: string[];
  legs?: any[];
  tripDetails?: Trip;
}

@Component({
  selector: 'app-search-ride',
  standalone: true,
  imports: [
    CommonModule,
    LocationSelectorComponent,
    DateTimePickerComponent,
    CardCarComponent,
    CardTrainComponent,
    RouterModule
  ],
  templateUrl: './search-ride.component.html',
  styleUrl: './search-ride.component.css'
})
export class SearchRideComponent implements OnInit {
  fromLocation: string = '';
  toLocation: string = '';
  selectedDateTime: Date = new Date();
  trainConnections: TrainConnection[] = [];
  loading: boolean = false;
  error: string | null = null;
  selectedConnection: TrainConnection | null = null;

  constructor(
    private ojpSdkService: OjpSdkService
  ) {
  }

  ngOnInit(): void {
    // Initialisierung - z.B. Standardwerte setzen
  }

  onFromLocationSelected(location: any): void {
    this.fromLocation = `${location.latitude},${location.longitude}`;
    this.searchConnections();
  }

  onToLocationSelected(location: any): void {
    this.toLocation = `${location.latitude},${location.longitude}`;
    this.searchConnections();
  }

  onDateTimeSelected(dateTime: Date): void {
    this.selectedDateTime = dateTime;
    this.searchConnections();
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  private searchConnections(): void {
    // Nur suchen, wenn beide Standorte ausgewählt wurden
    if (!this.fromLocation || !this.toLocation) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.trainConnections = []; // Leere aktuelle Verbindungen

    this.ojpSdkService.searchTrip(
      this.fromLocation,
      this.toLocation,
      this.selectedDateTime,
      'train'
    ).then(result => {
      if (result.trips && result.trips.length > 0) {
        this.trainConnections = result.trips.map(trip => {
          const tripInfo = this.ojpSdkService.formatTripForDisplay(trip);

          // Zugdetails aus dem ersten TimedLeg extrahieren
          const firstTimedLeg = trip.legs.find(leg => leg.legType === 'TimedLeg');
          let trainNumber = 'Zug';
          let trainEndLocation = 'Unbekannt';

          if (firstTimedLeg && 'service' in firstTimedLeg) {
            trainNumber = firstTimedLeg.service?.name || 'Zug';
            trainEndLocation = firstTimedLeg.toStopPoint?.name || 'Unbekannt';
          }

          return {
            trainNumber: trainNumber,
            trainEndLocation: trainEndLocation,
            departure: tripInfo.departure,
            arrival: tripInfo.arrival,
            duration: tripInfo.duration,
            transfers: tripInfo.transfers,
            platforms: tripInfo.platforms,
            tripDetails: trip
          };
        });
      } else {
        this.error = 'Keine Verbindungen gefunden';
      }
      this.loading = false;
      console.log('Gefundene Zugverbindungen:', this.trainConnections);
    }).catch(error => {
      this.error = `Fehler bei der Suche: ${error.message || 'Unbekannter Fehler'}`;
      this.loading = false;
      console.error('Fehler bei der Verbindungssuche:', error);
    });
  }
}
