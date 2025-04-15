import { Component, inject, OnInit, output, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { env } from '../../../env/env';
import { map } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { GeoUtilsService } from '../../services/geoUtils/geo-utils.service';
import {
  HsluLocationDataService,
  Location,
} from '../../services/hslu-location/hslu-location.service';
import { ActivatedRoute } from '@angular/router';
import { PillItem, PillsComponent } from '../pills/pills.component';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { GeolocationService } from '../../services/geolocation/geolocation.service';
import * as console from 'node:console';

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
    PillsComponent,
    NgOptimizedImage,
    CdkAccordion,
    CdkAccordionItem,
  ],
  /*providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: LocationSelectorComponent,
    },
  ],*/
  templateUrl: './location-selector.component.html',
  styleUrl: './location-selector.component.css',
})
export class LocationSelectorComponent implements OnInit {
  private fb = inject(FormBuilder);
  private ojpSdkService = inject(OjpSdkService);
  private geoUtilsService = inject(GeoUtilsService);
  private httpClient = inject(HttpClient);
  private hsluLocationDataService = inject(HsluLocationDataService);
  private currentPosition: { latitude: number; longitude: number } | null =
    null;
  locations: Location[] = this.hsluLocationDataService.getHsluLocations();
  selectedFromLocation: Location | null = null;
  selectedToLocation: Location | null = null;
  currentLocationTitle = 'Aktueller Standort';
  currentLocationCity = 'Auswählen';
  destinationLocationTitle = 'Zielort';
  destinationLocationCity = 'Auswählen';
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

  fromLocationPills: PillItem[] = [];
  toLocationPills: PillItem[] = [];

  fromLocationSelected = output<any>();

  @ViewChild('fromAccordion') fromAccordion!: CdkAccordionItem;
  @ViewChild('toAccordion') toAccordion!: CdkAccordionItem;

  constructor(
    private route: ActivatedRoute,
    private geoService: GeolocationService
  ) {
    this.travelForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      mode: ['train', Validators.required],
      date: [this.formatDate(new Date()), Validators.required],
      time: [this.formatTime(new Date()), Validators.required],
    });
  }

  ngOnInit(): void {
    // Alle HSLU-Standorte als Pills laden
    const locations = this.hsluLocationDataService.getHsluLocations();

    // Pills für beide Selektoren vorbereiten
    this.fromLocationPills = locations.map((loc) => ({
      id: loc.id,
      label: `${loc.title}`,
      isSelected: false,
    }));

    this.toLocationPills = locations.map((loc) => ({
      id: loc.id,
      label: `${loc.title}`,
      isSelected: false,
    }));

    // URL-Parameter für ausgewählte Koordinaten prüfen
    this.route.queryParams.subscribe((params) => {
      if (params['coordinates']) {
        // Standort anhand der Koordinaten finden und als Zielort setzen
        const coordinates = params['coordinates'];
        const location = locations.find(
          (loc) => loc.coordinates === coordinates
        );

        if (location) {
          this.setDestinationLocation(location);
        }
      }
    });

    // Aktuellen Standort per Geolocation ermitteln (wenn verfügbar)
    this.detectCurrentLocation();
  }

  // Ermittelt den aktuellen Standort und findet den nächsten HSLU-Standort
  private detectCurrentLocation() {
    this.geoService.getCurrentPosition().subscribe({
      next: (position) => {
        console.log('Aktuelle Position ermittelt:', position.coords);

        // Aktuelle Position speichern (falls später benötigt)
        this.currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        };

        // Nächstgelegenen HSLU-Standort finden
        const nearestLocation =
          this.hsluLocationDataService.findNearestLocation(
            position.coords.latitude,
            position.coords.longitude
          );

        if (nearestLocation) {
          console.log('Nächstgelegener Standort gefunden:', nearestLocation);
          this.setCurrentLocation(nearestLocation);

          // Optional: Nach kurzem Timeout nochmal überprüfen, ob alles korrekt übernommen wurde
          setTimeout(() => {
            console.log('Status nach Timeout:', {
              selectedFromLocation: this.selectedFromLocation,
              fromLocationPills: this.fromLocationPills.filter(
                (p) => p.isSelected
              ),
            });
            this.setCurrentLocation(nearestLocation);
          }, 500);
        }
      },
      error: (err) => {
        console.error('Geolocation error:', err);
      },
    });
  }

  setCurrentLocation(location: Location): void {
    console.log('setCurrentLocation aufgerufen mit:', location);

    // Internen Zustand aktualisieren
    this.selectedFromLocation = location;
    this.currentLocationTitle = location.title;
    this.currentLocationCity = location.city || '';

    // Entsprechende Pill als ausgewählt markieren
    this.fromLocationPills.forEach((pill) => {
      pill.isSelected = pill.id === location.id;
    });
    this.updateMapWithSelectedLocation(location);
    console.log(
      '[DEBUG] Event sollte in setCurrentLocation emittiert worden sein'
    );
  }

  // Setzt den Zielort
  private setDestinationLocation(location: Location) {
    this.selectedToLocation = location;
    this.destinationLocationTitle = location.title;
    this.destinationLocationCity = location.city;

    this.travelForm.get('to')?.setValue(location.id);

    // Entsprechende Pill als ausgewählt markieren
    this.toLocationPills.forEach((pill) => {
      pill.isSelected = pill.id === location.id;
    });
  }

  // Event-Handler für die Auswahl des Start-Standorts
  onFromPillSelected(pill: PillItem) {
    const selectedLocation = this.locations.find((loc) => loc.id === pill.id);

    if (selectedLocation) {
      this.setCurrentLocation(selectedLocation);
      // Akkordeon schließen
      if (this.fromAccordion) {
        this.fromAccordion.close();
      }
      this.updateMapWithSelectedLocation(selectedLocation);
    }
  }

  // Event-Handler für die Auswahl des Ziel-Standorts
  onToPillSelected(pill: PillItem) {
    const selectedLocation = this.locations.find((loc) => loc.id === pill.id);

    if (selectedLocation) {
      this.setDestinationLocation(selectedLocation);
      // Akkordeon schließen
      if (this.toAccordion) {
        this.toAccordion.close();
      }
    }
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

  // Fügen Sie diese Methode hinzu
  private updateMapWithSelectedLocation(location: Location): void {
    // Konvertiere die coordinates in ein geoPosition-Objekt
    let geoPosition;

    if (location.coordinates) {
      // Split die Koordinaten, die als String vorliegen ('lat,lng')
      const coords = location.coordinates.split(',');
      if (coords.length === 2) {
        geoPosition = {
          latitude: parseFloat(coords[0]),
          longitude: parseFloat(coords[1]),
        };
      }
    }

    // Emittiere ein Objekt mit der geoPosition
    const locationToEmit = {
      ...location,
      geoPosition: geoPosition,
    };

    console.log('Emitting location to update map:', locationToEmit);
    this.fromLocationSelected.emit(locationToEmit);
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
        label: 'Start',
      },
      {
        longitude: toLongitude,
        latitude: toLatitude,
        label: 'Destination',
      },
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
          tripGeometry,
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
        error: (err) => console.error('Error saving journey:', err),
      });
  }

  journey$ = this.httpClient
    .get<{ message: string }>(`${env.api}/getJourney`)
    .pipe(map((res) => res.message));

  // ControlValueAccessor
  /*  value: object = {
      from: this.currentLocationCity,
      to: this.destinationLocationCity,
    };
    onChange: OnChangeFn<object> = () => {};
    onTouch: OnTouchFn = () => {};

    writeValue(obj: object): void {
      if (obj === null) return;
      this.value = obj;
    }

    registerOnChange(fn: OnChangeFn<object>): void {
      this.onChange = fn;
    }

    registerOnTouched(fn: OnTouchFn): void {
      this.onTouch = fn;
    }

    @HostListener('focusout')
    onFocusOut() {
      this.onTouch();
    }*/
}

/*type OnChangeFn<T> = (value: T) => void;
type OnTouchFn = () => void;*/
