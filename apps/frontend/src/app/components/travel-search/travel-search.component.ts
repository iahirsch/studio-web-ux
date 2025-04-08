import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { LocationButtonComponent } from '../location-button/location-button.component';
import { GeoUtilsService } from '../../services/geoUtils/geo-utils.service';
import { MapComponent } from '../map/map.component';
import { TrainConnectionComponent } from '../train-connection/train-connection.component';


interface TravelResults {
  requestXML: string;
  trainConnections: TrainConnections[] | null;
  carRoute: CarRoute | null;
  tripGeometry?: GeoJSON.Feature[];
}

interface TrainConnections {
  arrival: string;
  departure: string;
  duration: string;
  platforms: string[];
  transfers: number;
}

interface CarRoute {
  distance: string;
  duration: string;
  steps: string[];
}
@Component({
  selector: 'app-travel-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LocationButtonComponent,
    MapComponent,
    TrainConnectionComponent
  ],
  templateUrl: './travel-search.component.html',
  styleUrl: './travel-search.component.css'
})
export class TravelSearchComponent {

  private fb = inject(FormBuilder);
  private ojpSdkService = inject(OjpSdkService);
  private geoUtilsService = inject(GeoUtilsService);

  travelForm: FormGroup;
  travelResults: TravelResults | null = null;
  loading = false;
  error: string | null = null;
  mapLocations: any[] = [];
  mapGeometry: GeoJSON.Feature[] = [];

  constructor() {
    this.travelForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      mode: ['train', Validators.required],
      date: [this.formatDate(new Date()), Validators.required],
      time: [this.formatTime(new Date()), Validators.required]
    });
  }

  // Koordinaten-Konvertierung und Formatierung
  private normalizeCoordinates(coordinates: string): string {
    const [first, second] = coordinates.split(',').map(coord => parseFloat(coord.trim()));

    // Überprüfe, ob erste Koordinate eher wie eine Longitude aussieht
    if (first > 90 || first < -90) {
      return `${second},${first}`;
    }

    return coordinates;
  }

  onLocationButtonClick(coordinates: string): void {
    try {
      // Normalisiere Koordinaten
      const normalizedCoords = this.normalizeCoordinates(coordinates);
      const [latitude, longitude] = normalizedCoords.split(',').map(parseFloat);

      // Aktualisiere das Formular
      this.travelForm.patchValue({
        to: normalizedCoords
      });

      // Aktualisiere Kartenmarkierungen
      this.updateMapLocations(longitude, latitude, 'Destination');
    } catch (error) {
      console.error('Error converting coordinates:', error);
    }
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coordinates = `${position.coords.latitude},${position.coords.longitude}`;

          this.travelForm.patchValue({
            from: coordinates
          });

          // Aktualisiere Kartenmarkierungen
          this.updateMapLocations(
            position.coords.longitude,
            position.coords.latitude,
            'Current Location'
          );
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.error = 'Could not retrieve current location';
        }
      );
    } else {
      console.error('Geolocation is not supported');
      this.error = 'Geolocation is not supported';
    }
  }

  private updateMapLocations(
    longitude: number,
    latitude: number,
    label = 'Location'
  ) {
    this.mapLocations = [
      {
        longitude,
        latitude,
        label
      }
    ];
  }

  onSubmit(): void {
    if (this.travelForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.travelResults = null;
    this.mapGeometry = [];

    const formData = this.travelForm.value;
    const dateTimeStr = `${formData.date}T${formData.time}:00`;
    const departureDate = new Date(dateTimeStr);

    // Extrahiere und normalisiere Koordinaten
    const [fromLatitude, fromLongitude] = this.normalizeCoordinates(formData.from).split(',').map(parseFloat);
    const [toLatitude, toLongitude] = this.normalizeCoordinates(formData.to).split(',').map(parseFloat);

    // Aktualisiere Kartenmarkierungen für Start und Ziel
    this.mapLocations = [
      {
        longitude: fromLongitude,
        latitude: fromLatitude,
        label: 'Start'
      },
      {
        longitude: toLongitude,
        latitude: toLatitude,
        label: 'Destination'
      }
    ];

    this.ojpSdkService.searchTrip(
      `${fromLongitude},${fromLatitude}`, // OJP erwartet Longitude,Latitude
      `${toLongitude},${toLatitude}`,
      departureDate,
      formData.mode
    ).then((result) => {
      const trainConnections: TrainConnections[] = [];
      let carRoute: CarRoute | null = null;
      const tripGeometry: GeoJSON.Feature[] = [];

      if (result.trips && result.trips.length > 0) {
        // Verarbeite alle Trips
        result.trips.forEach(trip => {
          if (formData.mode === 'train') {
            // Extrahiere Zugstrecke
            trip.legs.forEach(leg => {
              if (leg.legTrack && leg.legTrack.trackSections) {
                leg.legTrack.trackSections.forEach(section => {
                  if (section.linkProjection) {
                    const feature = section.linkProjection.asGeoJSONFeature();
                    if (feature) {
                      tripGeometry.push(feature);
                    }
                  }
                });
              }
            });

            // Formatiere die Verbindung und füge sie hinzu
            trainConnections.push(this.ojpSdkService.formatTripForDisplay(trip));
          }

          if (formData.mode === 'car') {
            // Extrahiere Autostrecke
            trip.legs.forEach(leg => {
              if (leg.legTrack && leg.legTrack.trackSections) {
                leg.legTrack.trackSections.forEach(section => {
                  if (section.linkProjection) {
                    const feature = section.linkProjection.asGeoJSONFeature();
                    if (feature) {
                      tripGeometry.push(feature);
                    }
                  }
                });
              }
            });

            // Formatiere die Autostrecke
            carRoute = this.ojpSdkService.formatCarRouteForDisplay(trip);
          }
        });
      }

      // Speichere die Ergebnisse
      this.travelResults = {
        requestXML: result.requestXML,
        trainConnections,
        carRoute,
        tripGeometry
      };

      console.log('Trip Results:', this.travelResults);

      // Setze Geometrie für Kartendarstellung
      this.mapGeometry = tripGeometry;

      this.loading = false;
    }).catch((err: Error) => {
      this.error = `Failed to retrieve travel data: ${err.message}`;
      console.error('Error fetching travel data:', err);
      this.loading = false;
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatTime(date: Date): string {
    return date.toTimeString().substring(0, 5);
  }
}