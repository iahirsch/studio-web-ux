// apps/frontend/src/app/services/ojp/ojp-sdk.service.ts
import { Injectable } from '@angular/core';
import { Trip, TripContinousLeg, TripTimedLeg } from 'ojp-sdk';
import { OjpApiService } from './ojp-api.service';

interface TripConnection {
  departure: string;
  arrival: string;
  duration: string;
  transfers: number;
  platforms: string[];
}

interface CarRoute {
  distance: string;
  duration: string;
  steps: string[];
}

interface TripSearchResult {
  requestXML: string;
  trips: Trip[];
  error?: unknown;
}

@Injectable({
  providedIn: 'root'
})
export class OjpSdkService {
  constructor(private ojpApiService: OjpApiService) {
  }

  async searchTrip(from: string, to: string, dateTime: Date, mode: 'train' | 'car'): Promise<TripSearchResult> {
    try {
      // First search for locations
      const fromLocations = await this.ojpApiService.searchLocation(from);
      const toLocations = await this.ojpApiService.searchLocation(to);

      if (fromLocations.length === 0 || toLocations.length === 0) {
        throw new Error(`Could not find locations for '${from}' or '${to}'`);
      }

      const fromLocation = fromLocations[0];
      const toLocation = toLocations[0];

      // Make the trip request
      const result = await this.ojpApiService.makeTripsRequest(
        fromLocation,
        toLocation,
        dateTime,
        mode
      );

      return {
        ...result,
        requestXML: result.requestXML || ''
      };
    } catch (error) {
      console.error('Error in trip search:', error);
      throw error;
    }
  }

  formatTripForDisplay(trip: Trip): TripConnection {
    const departureTime = trip.computeDepartureTime();
    const arrivalTime = trip.computeArrivalTime();

    // Get platforms for each leg
    const platforms = trip.legs
      .filter(leg => leg.legType === 'TimedLeg')
      .map(leg => {
        const timedLeg = leg as TripTimedLeg;
        return timedLeg.fromStopPoint.plannedPlatform || 'Unknown';
      });

    return {
      departure: departureTime ? this.formatDateTime(departureTime) : 'Unknown',
      arrival: arrivalTime ? this.formatDateTime(arrivalTime) : 'Unknown',
      duration: trip.stats.duration.formatDuration(),
      transfers: trip.stats.transferNo,
      platforms: platforms
    };
  }

  formatCarRouteForDisplay(trip: Trip): CarRoute {
    // Extract route steps from path guidance if available
    const steps: string[] = [];
    for (const leg of trip.legs) {
      if (leg.legType === 'ContinousLeg') {
        const continuousLeg = leg as TripContinousLeg;
        if (continuousLeg.pathGuidance) {
          continuousLeg.pathGuidance.sections.forEach(section => {
            if (section.guidanceAdvice) {
              steps.push(section.guidanceAdvice);
            }
          });
        }
      }
    }

    return {
      distance: trip.stats.distanceMeters > 1000
        ? `${(trip.stats.distanceMeters / 1000).toFixed(1)} km`
        : `${trip.stats.distanceMeters} m`,
      duration: trip.stats.duration.formatDuration(),
      steps: steps
    };
  }

  private formatDateTime(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleString('en-de', options);
  }
}
