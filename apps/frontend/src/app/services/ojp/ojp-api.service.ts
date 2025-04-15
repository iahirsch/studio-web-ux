import { Injectable } from '@angular/core';
import { Location, LocationInformationRequest, Trip, TripLocationPoint, TripRequest } from 'ojp-sdk';

import { env } from '../../../env/env';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OjpApiService {
  constructor(private http: HttpClient) {
  }

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
      if (mode === 'train') {
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


  async getTripById(id: string): Promise<Trip | null> {
    try {
      const endpoint = `${env.api}/trips/${id}`;
      const response = await firstValueFrom(this.http.get<{ data: any }>(endpoint));

      if (response && response.data) {
        // Überprüfen und transformieren der Daten, falls nötig
        // Beispiel:
        const tripData = this.mapResponseToTripData(response.data);
        return tripData as Trip;


      }
      return null;
    } catch (error) {
      console.error('Fehler beim Abrufen des Trips:', error);
      throw new Error(`Trip mit ID ${id} konnte nicht abgerufen werden`);
    }
  }

// Hilfsmethode zum Mapping der Response-Daten in das für Trip erwartete Format
  private mapResponseToTripData(data: any): any {
    // Hier die Daten entsprechend transformieren
    // Beispiel:
    return {
      id: data.id,
      startTime: data.startTime,
      endTime: data.endTime,
      duration: data.duration,
      transfers: data.transfers
      // weitere relevante Eigenschaften
    };
  }
}

