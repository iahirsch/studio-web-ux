import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { env } from '../../../env/env';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeoUtilsService } from '../../services/geoUtils/geo-utils.service';
import { CardTrainComponent } from '../card-train/card-train.component';
import { HsluLocationDataService, Location } from '../../services/hslu-location/hslu-location.service';
import { CardTrainDetailsComponent } from '../card-train-details/card-train-details.component';
import { ActivatedRoute } from '@angular/router';

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
  selector: 'app-location-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CardTrainComponent,
    CardTrainDetailsComponent
  ],
  templateUrl: './location-selector.component.html',
  styleUrl: './location-selector.component.css'
})
export class LocationSelectorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ojpSdkService = inject(OjpSdkService);
  private geoUtilsService = inject(GeoUtilsService);
  private httpClient = inject(HttpClient);
  private locationService = inject(HsluLocationDataService);
  private route = inject(ActivatedRoute);

  locations: Location[] = this.locationService.getHsluLocations();
  selectedFromLocation: Location | null = null;
  selectedToLocation: Location | null = null;
  currentLocationLabel = 'Bitte wählen Sie einen Startort';
  destinationLocationLabel = 'Bitte wählen Sie einen Zielort';
  nearbyHsluLocation: Location | null = null;

  selectedConnection: TrainConnections | null = null;

  trainConnections: TrainConnections[] = [];
  carRoute: null | CarRoute = null;

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

  ngOnInit(): void {
    // Prüfe, ob Koordinaten aus einer anderen Komponente übergeben wurden
    this.route.queryParams.subscribe(params => {
      if (params['coordinates']) {
        this.onLocationButtonClick(params['coordinates']);
      }
    });
  }

  onLocationButtonClick(coordinates: string): void {
    if (!coordinates) return;

    const [latitude, longitude] = coordinates.split(',').map(parseFloat);

    // Prüfe, ob ein HSLU-Standort in der Nähe ist
    this.nearbyHsluLocation = this.checkNearbyHsluLocation(latitude, longitude);

    if (this.nearbyHsluLocation) {
      // Wenn ein HSLU-Standort in der Nähe ist, wähle diesen als Startort
      this.selectFromLocation(this.nearbyHsluLocation);
    } else {
      // Ansonsten setze die Koordinaten direkt als Startpunkt
      const locationStr = `${latitude.toFixed(6)},${longitude.toFixed(6)}`;
      this.travelForm.patchValue({ from: locationStr });
      this.currentLocationLabel = 'Benutzerdefinierter Standort';
    }
  }


  private checkNearbyHsluLocation(latitude: number, longitude: number): Location | null {
    const MAX_DISTANCE_KM = 1; // 1 Kilometer Umkreis

    // Gehe alle HSLU-Standorte durch
    for (const location of this.locations) {
      const [locLat, locLng] = location.coordinates.split(',').map(parseFloat);

      // Berechne Entfernung (Haversine-Formel)
      const distance = this.calculateDistance(latitude, longitude, locLat, locLng);

      if (distance <= MAX_DISTANCE_KM) {
        return location;
      }
    }

    return null;
  }

  // Haversine-Formel zur Berechnung der Entfernung zwischen zwei Koordinaten
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371; // Erdradius in km
    const dLat = this.deg2rad(lat2 - lat1);
    const dLon = this.deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Entfernung in km
    return distance;
  }


  // Hilfsfunktion für die Berechnung des Abstands (falls noch nicht vorhanden)
  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

// Methode zum Auswählen des Startorts
  selectFromLocation(location: Location): void {
    this.selectedFromLocation = location;
    this.currentLocationLabel = `${location.title}, ${location.city}`;
    this.travelForm.patchValue({ from: location.coordinates });
  }

  // Methode zum Auswählen des Zielorts
  selectToLocation(location: Location): void {
    this.selectedToLocation = location;
    this.destinationLocationLabel = `${location.title}, ${location.city}`;
    this.travelForm.patchValue({ to: location.coordinates });
  }


  // Koordinaten-Konvertierung und Formatierung
  private normalizeCoordinates(coordinates: string): string {
    const [first, second] = coordinates
      .split(',')
      .map((coord) => parseFloat(coord.trim()));

    // Überprüfe, ob erste Koordinate eher wie eine Longitude aussieht
    if (first > 90 || first < -90) {
      return `${second},${first}`;
    }

    return coordinates;
  }


  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coordinates = `${position.coords.latitude},${position.coords.longitude}`;

          // Überprüfe, ob der aktuelle Standort in der Nähe eines HSLU-Standorts liegt
          this.nearbyHsluLocation = this.checkNearbyHsluLocation(
            position.coords.latitude,
            position.coords.longitude
          );

          if (this.nearbyHsluLocation) {
            // Wenn in der Nähe eines HSLU-Standorts, nutze diesen als Startort
            this.selectFromLocation(this.nearbyHsluLocation);
          } else {
            // Sonst verwende die genauen Koordinaten
            this.travelForm.patchValue({ from: coordinates });
            this.selectedFromLocation = null;
            this.currentLocationLabel = 'Ihr Standort';
          }

          // Aktualisiere Kartenmarkierungen
          this.updateMapLocations(
            position.coords.longitude,
            position.coords.latitude,
            'Aktueller Standort'
          );
        },
        (error) => {
          console.error('Geolocation error:', error);
          this.error = 'Standort konnte nicht abgerufen werden';
        }
      );
    } else {
      console.error('Geolocation is not supported');
      this.error = 'Standortermittlung wird nicht unterstützt';
    }
  }

  // Überarbeitete Methode für Standort-Button-Klick (von Dashboard)
  handleLocationSelection(coordinates: string): void {
    try {
      // Normalisiere Koordinaten
      const normalizedCoords = this.normalizeCoordinates(coordinates);
      const [latitude, longitude] = normalizedCoords.split(',').map(parseFloat);

      // Finde den HSLU-Standort, der diesen Koordinaten entspricht
      const matchingLocation = this.locations.find(
        loc => loc.coordinates === normalizedCoords
      );

      if (matchingLocation) {
        // Setze diesen als Zielort
        this.selectToLocation(matchingLocation);
      } else {
        // Falls kein direkter Match, setze einfach die Koordinaten
        this.travelForm.patchValue({ to: normalizedCoords });
        this.selectedToLocation = null;
        this.destinationLocationLabel = 'Ausgewählter Ort';
      }

      // Aktualisiere Kartenmarkierungen
      this.updateMapLocations(longitude, latitude, 'Zielort');
    } catch (error) {
      console.error('Error converting coordinates:', error);
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
    const [fromLatitude, fromLongitude] = this.normalizeCoordinates(
      formData.from
    )
      .split(',')
      .map(parseFloat);
    const [toLatitude, toLongitude] = this.normalizeCoordinates(formData.to)
      .split(',')
      .map(parseFloat);

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

    this.ojpSdkService
      .searchTrip(
        `${fromLongitude},${fromLatitude}`, // OJP erwartet Longitude,Latitude
        `${toLongitude},${toLatitude}`,
        departureDate,
        formData.mode
      )
      .then((result) => {
        const trainConnections: TrainConnections[] = [];
        let carRoute: CarRoute | null = null;
        const tripGeometry: GeoJSON.Feature[] = [];

        if (result.trips && result.trips.length > 0) {
          // Verarbeite alle Trips
          result.trips.forEach((trip) => {
            if (formData.mode === 'train') {
              // Extrahiere Zugstrecke
              trip.legs.forEach((leg) => {
                if (leg.legTrack && leg.legTrack.trackSections) {
                  leg.legTrack.trackSections.forEach((section) => {
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
              trainConnections.push(
                this.ojpSdkService.formatTripForDisplay(trip)
              );
            }

            if (formData.mode === 'car') {
              // Extrahiere Autostrecke
              trip.legs.forEach((leg) => {
                if (leg.legTrack && leg.legTrack.trackSections) {
                  leg.legTrack.trackSections.forEach((section) => {
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

        this.trainConnections = trainConnections;
        this.carRoute = carRoute;
        console.log('Trip Results:', this.travelResults);

        // Setze Geometrie für Kartendarstellung
        this.mapGeometry = tripGeometry;

        this.loading = false;
      })
      .catch((err: Error) => {
        this.error = `Failed to retrieve travel data: ${err.message}`;
        console.error('Error fetching travel data:', err);
        this.loading = false;
      });
  }

// Formatierungshilfe für Datum
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  // Formatierungshilfe für Zeit
  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }


  saveJourney() {
    console.log('TrainConnection 1: ', this.trainConnections[0]);

    this.httpClient
      .post(`${env.api}/saveJourney`, this.trainConnections[0])
      .subscribe({
        next: (response) =>
          console.log('Journey saved successfully:', response),
        error: (err) => console.error('Error saving journey:', err)
      });
  }

  journey$ = this.httpClient
    .get<{ message: string }>(`${env.api}/getJourney`)
    .pipe(map((res) => res.message));
}
