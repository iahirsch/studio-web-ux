import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, Location, ViewportScroller } from '@angular/common';
import { LocationSelectorComponent } from '../../components/location-selector/location-selector.component';
import { DateTimePickerComponent } from '../../components/date-time-picker/date-time-picker.component';
import { CardTrainComponent } from '../../components/card-train/card-train.component';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { Trip } from 'ojp-sdk';
import { RouterModule } from '@angular/router';
import { CarConnectionService } from '../../services/car-connection/car-connection.service';
import { CardCarComponent } from '../../components/card-car/card-car.component';

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
    CardTrainComponent,
    RouterModule,
    CardCarComponent
  ],
  templateUrl: './search-ride.component.html',
  styleUrl: './search-ride.component.css'
})
export class SearchRideComponent implements OnInit {
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
  carConnections = signal<any[]>([]);

  // Injektion des Services
  private ojpSdkService = inject(OjpSdkService);
  private viewportScroller = inject(ViewportScroller);
  private carConnectionService = inject(CarConnectionService);

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);
  }

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
    // Validate locations
    if (!this.fromLocation() || !this.toLocation()) {
      return;
    }

    this.loading.set(true);
    this.error.set(null);
    this.trainConnections.set([]);
    this.carConnections.set([]);

    // Get car connections
    this.carConnectionService.getUserCarConnections().subscribe({
      next: (carConnections) => {
        const filteredConnections = carConnections.filter(connection => {
          const matchesFrom = connection.from?.coordinates?.includes(this.fromLocation());
          const matchesTo = connection.to?.coordinates?.includes(this.toLocation());
          return matchesFrom && matchesTo;
        });

        this.carConnections.set(filteredConnections);

        // Now get train connections (within the same function)
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

                return {
                  departure: tripInfo.departure,
                  arrival: tripInfo.arrival,
                  duration: tripInfo.duration,
                  transfers: tripInfo.transfers,
                  platforms: tripInfo.platforms,
                  serviceName: tripInfo.serviceName || 'Zug',
                  destinationName: tripInfo.destinationName || 'Unbekannt',
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
          })
          .catch((error: any) => {
            console.error('Error searching connections:', error);
            this.error.set('Fehler bei der Suche nach Verbindungen');
            this.loading.set(false);
          });
      },
      error: (error) => {
        console.error('Error fetching car connections:', error);
        // Even if car connections fail, try to get train connections
        const fromCoords = this.ensureCoordinateFormat(this.fromLocation()!);
        const toCoords = this.ensureCoordinateFormat(this.toLocation()!);

        // Same train search code as above
        this.ojpSdkService.searchTrip(fromCoords, toCoords, this.selectedDateTime(), 'train')
          .then(result => {
            // Process train connections
            if (result.trips && result.trips.length > 0) {
              const limitedTrips = result.trips.slice(0, 5);
              const connections = limitedTrips.map(trip => {
                const tripInfo = this.ojpSdkService.formatTripForDisplay(trip);
                return {
                  departure: tripInfo.departure,
                  arrival: tripInfo.arrival,
                  duration: tripInfo.duration,
                  transfers: tripInfo.transfers,
                  platforms: tripInfo.platforms,
                  serviceName: tripInfo.serviceName || 'Zug',
                  destinationName: tripInfo.destinationName || 'Unbekannt',
                  legs: trip.legs,
                  tripDetails: trip
                };
              });
              this.trainConnections.set(connections);
            } else {
              this.error.set('Keine Verbindungen gefunden');
            }
          })
          .catch(error => {
            console.error('Error searching train connections:', error);
            this.error.set('Fehler bei der Suche nach Verbindungen');
          })
          .finally(() => {
            this.loading.set(false);
          });
      }
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
