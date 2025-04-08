import { Injectable } from '@angular/core';
import { Location, LocationInformationRequest, TripLocationPoint, TripRequest } from 'ojp-sdk';
import { env } from '../../../env/env';

@Injectable({
  providedIn: 'root'
})
export class OjpApiService {

  async searchLocation(locationName: string): Promise<Location[]> {
    try {
      const locationRequest = LocationInformationRequest.initWithLocationName(
        env.ojp,
        'de',
        locationName,
        ['stop', 'address', 'poi'],
        5
      );

      return await locationRequest.fetchLocations();
    } catch (error) {
      console.error('Error in location search:', error);
      throw new Error('Location search failed');
    }
  }

  async makeTripsRequest(
    fromLocation: Location,
    toLocation: Location,
    departureDate: Date,
    mode: 'train' | 'car'
  ) {
    try {
      // Create trip request based on mode
      let tripRequest;
      if (mode === 'car') {
        const fromTripLocation = new TripLocationPoint(fromLocation);
        const toTripLocation = new TripLocationPoint(toLocation);

        tripRequest = TripRequest.initWithTripLocationsAndDate(
          env.ojp,
          'de',
          fromTripLocation,
          toTripLocation,
          departureDate,
          'Dep',
          true,  // includeLegProjection
          'monomodal',  // modeType
          'self-drive-car'  // transportMode
        );
      } else {
        tripRequest = TripRequest.initWithLocationsAndDate(
          env.ojp,
          'de',
          fromLocation,
          toLocation,
          departureDate,
          'Dep'
        );
      }

      if (!tripRequest) {
        throw new Error('Failed to create trip request');
      }

      // Set number of results to 5
      tripRequest.numberOfResults = 5;

      // Execute the request
      await tripRequest.fetchResponse();

      return {
        requestXML: tripRequest.requestInfo.requestXML,
        trips: tripRequest.response?.trips || [],
        error: tripRequest.requestInfo.error
      };
    } catch (error) {
      console.error('Error in trip search:', error);
      throw error;
    }
  }
}
