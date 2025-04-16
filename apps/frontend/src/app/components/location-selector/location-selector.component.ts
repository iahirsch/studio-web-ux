import { Component, inject, OnInit, output, ViewChild } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { HsluLocationDataService, Location } from '../../services/hslu-location/hslu-location.service';
import { ActivatedRoute } from '@angular/router';
import { PillItem, PillsComponent } from '../pills/pills.component';
import { CdkAccordion, CdkAccordionItem } from '@angular/cdk/accordion';
import { GeolocationService } from '../../services/geolocation/geolocation.service';


@Component({
  selector: 'app-location-selector',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PillsComponent,
    NgOptimizedImage,
    CdkAccordion,
    CdkAccordionItem
  ],
  templateUrl: './location-selector.component.html',
  styleUrl: './location-selector.component.css'
})
export class LocationSelectorComponent implements OnInit {

  private hsluLocationDataService = inject(HsluLocationDataService);
  private currentPosition: { latitude: number, longitude: number } | null = null;
  locations: Location[] = this.hsluLocationDataService.getHsluLocations();
  selectedFromLocation: Location | null = null;
  selectedToLocation: Location | null = null;
  currentLocationTitle = 'Aktueller Standort';
  currentLocationCity = 'Auswählen';
  destinationLocationTitle = 'Zielort';
  destinationLocationCity = 'Auswählen';
  error: string | null = null;

  fromLocationPills: PillItem[] = [];
  toLocationPills: PillItem[] = [];

  locationForm: FormGroup;
  fromSuggestions: Location[] = [];
  toSuggestions: Location[] = [];
  isLoadingFrom = false;
  isLoadingTo = false;


  fromLocationSelected = output<Location>();
  toLocationSelected = output<Location>();

  @ViewChild('fromAccordion') fromAccordion!: CdkAccordionItem;
  @ViewChild('toAccordion') toAccordion!: CdkAccordionItem;


  constructor(private fb: FormBuilder,
              private route: ActivatedRoute,
              private geoService: GeolocationService
  ) {
    this.locationForm = this.fb.group({ from: ['', Validators.required], to: ['', Validators.required] });
  }


  ngOnInit(): void {
    // Alle HSLU-Standorte als Pills laden
    const locations = this.hsluLocationDataService.getHsluLocations();

    // Pills für beide Selektoren vorbereiten
    this.fromLocationPills = locations.map(loc => ({
      id: loc.id,
      label: `${loc.title}`,
      isSelected: false
    }));

    this.toLocationPills = locations.map(loc => ({
      id: loc.id,
      label: `${loc.title}`,
      isSelected: false
    }));

    // URL-Parameter für ausgewählte Koordinaten prüfen
    this.route.queryParams.subscribe(params => {
      if (params['coordinates']) {
        // Standort anhand der Koordinaten finden und als Zielort setzen
        const coordinates = params['coordinates'];
        const location = locations.find(loc => loc.coordinates === coordinates);

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
      next: position => {
        console.log('Aktuelle Position ermittelt:', position.coords);

        // Aktuelle Position speichern (falls später benötigt)
        this.currentPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        };

        // Nächstgelegenen HSLU-Standort finden
        const nearestLocation = this.hsluLocationDataService.findNearestLocation(
          position.coords.latitude,
          position.coords.longitude
        );

        if (nearestLocation) {
          // Optional: Nach kurzem Timeout nochmal überprüfen, ob alles korrekt übernommen wurde
          setTimeout(() => {
            console.log('Status nach Timeout:', {
              selectedFromLocation: this.selectedFromLocation,
              fromLocationPills: this.fromLocationPills.filter(p => p.isSelected)
            });
            this.setCurrentLocation(nearestLocation);
          }, 500);
        }
      },
      error: err => {
        console.error('Geolocation error:', err);
      }
    });
  }

  setCurrentLocation(location: Location): void {

    // Internen Zustand aktualisieren
    this.selectedFromLocation = location;
    this.currentLocationTitle = location.title;
    this.currentLocationCity = location.city || '';

    // Entsprechende Pill als ausgewählt markieren
    this.fromLocationPills.forEach(pill => {
      pill.isSelected = pill.id === location.id;
    });
    this.updateMapWithSelectedLocation(location);

    this.locationForm.get('from')?.setValue(location.coordinates);
    this.fromSuggestions = [];

    // Emittieren des ausgewählten Standorts an search-ride component
    this.fromLocationSelected.emit(this.selectedFromLocation);

  }
  // Setzt den Zielort
  private setDestinationLocation(location: Location) {
    this.selectedToLocation = location;
    this.destinationLocationTitle = location.title;
    this.destinationLocationCity = location.city;

    // Entsprechende Pill als ausgewählt markieren
    this.toLocationPills.forEach(pill => {
      pill.isSelected = pill.id === location.id;
    });

    this.locationForm.get('to')?.setValue(location.coordinates);
    this.toSuggestions = [];

    // Emittieren des ausgewählten Standorts an search-ride component
    this.toLocationSelected.emit(this.selectedToLocation);

  }

  // Event-Handler für die Auswahl des Start-Standorts
  onFromPillSelected(pill: PillItem) {
    const selectedLocation = this.locations.find(loc => loc.id === pill.id);

    if (selectedLocation) {
      this.setCurrentLocation(selectedLocation);
      // Akkordeon schließen
      if (this.fromAccordion) {
        this.fromAccordion.close();
      }
    }
  }

  // Event-Handler für die Auswahl des Ziel-Standorts
  onToPillSelected(pill: PillItem) {
    const selectedLocation = this.locations.find(loc => loc.id === pill.id);

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
          longitude: parseFloat(coords[1])
        };
      }

    }

    // Emittiere ein Objekt mit der geoPosition
    const locationToEmit = {
      ...location,
      geoPosition: geoPosition
    };

    console.log('Emitting location to update map:', locationToEmit);
    this.fromLocationSelected.emit(locationToEmit);
  }

  // Beim Absenden des Formulars die ausgewählten Standorte emittieren
  onSubmit(): void {
    if (this.locationForm.valid) {
      if (this.selectedFromLocation) {
        this.fromLocationSelected.emit(this.selectedFromLocation);
      }

      if (this.selectedToLocation) {
        this.toLocationSelected.emit(this.selectedToLocation);
      }
    }
  }

}
