// apps/frontend/src/app/components/travel-search/travel-search.component.ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { GeoUtilsService } from '../../services/geoUtils/geo-utils.service';

interface TravelResults {
  requestXML: string;
  trainConnections: unknown[];
  carRoute: unknown;
}

@Component({
  selector: 'app-travel-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './travel-search.component.html',
  styleUrl: './travel-search.component.css'
})
export class TravelSearchComponent {

  private fb = inject(FormBuilder);
  private ojpSdkService = inject(OjpSdkService);
  private geoUtilsService = inject(GeoUtilsService);

  onLocationButtonClick(coordinates: string): void {
    try {
      // Convert coordinates to bounding box
      const bbox = this.geoUtilsService.convertCoordinateToBBox(coordinates);

      // Format the bbox for form input
      const formattedBBox = this.geoUtilsService.formatBBoxForOJP(bbox);

      this.travelForm.patchValue({ to: formattedBBox });
      console.log('Coordinates converted to bbox:', formattedBBox);
    } catch (error) {
      console.error('Error converting coordinates:', error);
    }
  }

  travelForm: FormGroup;
  travelResults: TravelResults | null = null;
  loading = false;
  error: string | null = null;

  constructor() {
    this.travelForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      mode: ['train', Validators.required], // Default to train
      date: [this.formatDate(new Date()), Validators.required],
      time: [this.formatTime(new Date()), Validators.required]
    });
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

    this.ojpSdkService.searchTrip(
      formData.from,
      formData.to,
      departureDate,
      formData.mode
    ).then((result) => {
      // Format the results for display
      const trainConnections: unknown[] = [];
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
