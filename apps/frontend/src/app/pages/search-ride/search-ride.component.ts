import { Component, inject, signal } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LocationSelectorComponent } from '../../components/location-selector/location-selector.component';
import { DateTimePickerComponent } from '../../components/date-time-picker/date-time-picker.component';
import { CardCarComponent } from '../../components/card-car/card-car.component';
import { CardTrainComponent } from '../../components/card-train/card-train.component';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { Trip } from 'ojp-sdk';
import { RouterModule } from '@angular/router';

// Definition der TrainConnection-Schnittstelle für typsichere Verbindungen
interface TrainConnection {
  departure: string;
  arrival: string;
  duration: string;
  transfers: number;
  platforms: string[];
  serviceName: string;
  destinationName: string;
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
export class SearchRideComponent {
  private location = inject(Location);
  // Signals für reaktive Programmierung
  fromLocation = signal<string | null>(null);
  toLocation = signal<string | null>(null);
  selectedDateTime = signal<Date>(new Date());
  loading = signal(false);
  error = signal<string | null>(null);
  trainConnections = signal<TrainConnection[]>([]); // Hier das fehlende Signal

  // Flags als Signals für den Bereitschaftsstatus
  fromLocationSelected = signal(false);
  toLocationSelected = signal(false);
  dateTimeSelected = signal(false);

  // Injektion des Services
  private ojpSdkService = inject(OjpSdkService);

  onFromLocationSelected(location: any): void {
    console.log('Von Location empfangen:', location);
    if (location.coordinates) {
      this.fromLocation.set(location.coordinates);
      this.fromLocationSelected.set(true);
      this.checkAndSearchConnections();
    } else {
      console.error('Keine Koordinaten im Location-Objekt gefunden:', location);
    }

  }

  onToLocationSelected(location: any): void {
    console.log('Zu Location empfangen:', location);
    if (location.coordinates) {
      this.toLocation.set(location.coordinates);
      this.toLocationSelected.set(true);
      this.checkAndSearchConnections();
    } else {
      console.error('Keine Koordinaten im Location-Objekt gefunden:', location);
    }

  }

  onDateTimeSelected(dateTime: Date): void {
    console.log('Datum/Zeit ausgewählt:', dateTime);
    this.selectedDateTime.set(dateTime);
    this.dateTimeSelected.set(true);
    this.checkAndSearchConnections();
  }

  // Diese Methode überprüft, ob alle erforderlichen Daten vorhanden sind
  private checkAndSearchConnections(): void {
    if (this.fromLocationSelected() && this.toLocationSelected()) {
      console.log('Alle Daten vorhanden, starte Suche...');
      this.searchConnections();
    }
  }

  private formatTime(date: Date): string {
    return date.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
  }

  private searchConnections(): void {
    // Nur suchen, wenn beide Standorte ausgewählt wurden
    if (!this.fromLocation() || !this.toLocation()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.trainConnections.set([]); // Leere aktuelle Verbindungen
    const fromCoords = this.ensureCoordinateFormat(this.fromLocation()!);
    const toCoords = this.ensureCoordinateFormat(this.toLocation()!);


    this.ojpSdkService.searchTrip(
      fromCoords,
      toCoords,
      this.selectedDateTime(),
      'train'
    )
      .then(result => {
        console.log('OJP-Antwort erhalten:', result);

        if (result.trips && result.trips.length > 0) {
          const limitedTrips = result.trips.slice(0, 5);
          const connections = limitedTrips.map(trip => {
            const tripInfo = this.ojpSdkService.formatTripForDisplay(trip);

            // Die zurückgegebenen serviceName und destinationName verwenden
            return {
              departure: tripInfo.departure,
              arrival: tripInfo.arrival,
              duration: tripInfo.duration,
              transfers: tripInfo.transfers,
              platforms: tripInfo.platforms,
              serviceName: tripInfo.serviceName || 'Zug',         // Statt trainNumber
              destinationName: tripInfo.destinationName || 'Unbekannt', // Statt trainEndLocation
              legs: trip.legs,
              tripDetails: trip
            };
          });

          this.trainConnections.set(connections);
          console.log('Verbindungen gefunden:', connections.length);
        } else {
          this.error.set('Keine Verbindungen gefunden');
          console.log('Keine Verbindungen in der Antwort gefunden');
        }
        this.loading.set(false);
      }).catch(error => {
        console.error('Error searching connections:', error);
        this.error.set('Fehler bei der Suche nach Verbindungen');
        this.loading.set(false);
      });
  }

  // Hilfsmethode für das Koordinatenformat
  private ensureCoordinateFormat(coordinates: string): string {
    // Prüfe, ob die Koordinaten im Format "lat,lon" vorliegen
    if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(coordinates)) {
      return coordinates; // Format ist bereits korrekt
    }

    // Falls die Koordinaten im Format "lon,lat" vorliegen (GeoJSON)
    if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(coordinates)) {
      const [lon, lat] = coordinates.split(',').map(c => parseFloat(c.trim()));
      if (!isNaN(lon) && !isNaN(lat)) {
        return `${lat},${lon}`; // Konvertiere zu "lat,lon"
      }
    }

    // Falls das Format nicht erkannt wird, gib das Original zurück
    console.warn('Unbekanntes Koordinatenformat:', coordinates);
    return coordinates;
  }

  goBack(): void {
    this.location.back();
  }

}
