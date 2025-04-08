import { Injectable } from '@angular/core';
import { Location, LocationInformationRequest, TripLocationPoint, TripRequest } from 'ojp-sdk';
import { env } from '../../../env/env';

@Injectable({
  providedIn: 'root'
})
export class OjpApiService {

  async searchLocation(locationName: string): Promise<Location[]> {
    try {
      // Überprüfe, ob es sich um Koordinaten handelt
      const coordinateRegex = /^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/;
      if (coordinateRegex.test(locationName)) {
        // Koordinaten direkt in Location umwandeln
        const [latitude, longitude] = locationName.split(',').map(coord => parseFloat(coord.trim()));

        // Erstelle eine Location direkt aus Koordinaten
        const geoLocation = Location.initWithLngLat(longitude, latitude);

        return [geoLocation];
      }

      // Bestehende Standortsuche für Ortsnamen
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
      console.log('Trip Request Locations:', {
        from: {
          longitude: fromLocation.geoPosition?.longitude,
          latitude: fromLocation.geoPosition?.latitude
        },
        to: {
          longitude: toLocation.geoPosition?.longitude,
          latitude: toLocation.geoPosition?.latitude
        }
      });

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
          true,       // includeLegProjection
          'monomodal', // modeType
          'self-drive-car', // transportMode
          [], // viaTripLocations
          5,  // numberOfResults
          null, // numberOfResultsBefore
          null  // numberOfResultsAfter
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

        // Für Zug-Routen zusätzliche Konfigurationen direkt setzen
        if (tripRequest) {
          tripRequest.numberOfResults = 5;
          tripRequest.includeLegProjection = true;
        }
      }

      if (!tripRequest) {
        throw new Error('Failed to create trip request');
      }

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