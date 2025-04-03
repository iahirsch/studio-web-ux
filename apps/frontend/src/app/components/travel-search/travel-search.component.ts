import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { LocationButtonComponent } from '../location-button/location-button.component';
import { GeoUtilsService } from '../../services/geoUtils/geo-utils.service';
import { MapboxComponent } from '../mapbox/mapbox.component';

interface TravelResults {
  requestXML: string;
  trainConnections: any[];
  carRoute: any;
}

@Component({
  selector: 'app-travel-search',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LocationButtonComponent,
    MapboxComponent
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

  constructor() {
    this.travelForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      mode: ['train', Validators.required],
      date: [this.formatDate(new Date()), Validators.required],
      time: [this.formatTime(new Date()), Validators.required]
    });
  }

  onLocationButtonClick(coordinates: string): void {
    try {
      const [longitude, latitude] = coordinates.split(',').map(parseFloat);

      this.travelForm.patchValue({
        to: coordinates
      });

      // Update map locations
      this.updateMapLocations(longitude, latitude);
    } catch (error) {
      console.error('Error converting coordinates:', error);
    }
  }

  getCurrentLocation(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const coordinates = `${position.coords.longitude},${position.coords.latitude}`;

          this.travelForm.patchValue({
            from: coordinates
          });

          // Update map locations
          this.updateMapLocations(
            position.coords.longitude,
            position.coords.latitude
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

  private updateMapLocations(longitude: number, latitude: number) {
    this.mapLocations = [
      {
        longitude,
        latitude,
        label: 'Selected Location'
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

    const formData = this.travelForm.value;
    const dateTimeStr = `${formData.date}T${formData.time}:00`;
    const departureDate = new Date(dateTimeStr);

    // Validate coordinate format
    const validateCoordinates = (coord: string) => {
      const [lon, lat] = coord.split(',').map(parseFloat);
      return !isNaN(lon) && !isNaN(lat);
    };

    if (!validateCoordinates(formData.from) || !validateCoordinates(formData.to)) {
      this.error = 'Invalid coordinate format. Use "longitude,latitude"';
      this.loading = false;
      return;
    }

    this.ojpSdkService.searchTrip(
      formData.from,
      formData.to,
      departureDate,
      formData.mode
    ).then((result) => {
      const trainConnections: any[] = [];
      let carRoute = null;

      if (result.trips && result.trips.length > 0) {
        if (formData.mode === 'train' || formData.mode === 'car') {
          result.trips.forEach(trip => {
            trainConnections.push(this.ojpSdkService.formatTripForDisplay(trip));
          });
        }

        if (formData.mode === 'car' && result.trips.length > 0) {
          carRoute = this.ojpSdkService.formatCarRouteForDisplay(result.trips[0]);
        }
      }

      this.travelResults = {
        requestXML: result.requestXML,
        trainConnections,
        carRoute
      };

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