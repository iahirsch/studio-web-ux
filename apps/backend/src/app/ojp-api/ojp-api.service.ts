// apps/backend/src/app/ojp-api/ojp-api.service.ts
import { Injectable } from '@nestjs/common';
import { TravelRequestDto } from './dto/travel-request.dto';
import axios from 'axios';

@Injectable()
export class OjpApiService {
    private readonly baseUrl: string;

    constructor() {
        // For local development, use localhost
        // For production, use the same host (since both services run on the same Heroku app)
        this.baseUrl = process.env.NODE_ENV === 'production'
            ? '/ojp-service'
            : 'http://localhost:3000/ojp-service';
    }

    async getJourney(from: string, to: string) {
        try {
            const response = await axios.post(`${this.baseUrl}/trip-search`, {
                from,
                to,
                date: new Date().toISOString().split('T')[0],
                time: new Date().toTimeString().substring(0, 5),
                mode: 'train'
            });

            return {
                requestXML: response.data.requestXML,
                result: response.data
            };
        } catch (error) {
            console.error('Error in journey request:', error);
            throw new Error('OJP API request failed');
        }
    }

    async searchTrip(travelRequest: TravelRequestDto) {
        try {
            const response = await axios.post(`${this.baseUrl}/trip-search`, {
                from: travelRequest.from,
                to: travelRequest.to,
                date: travelRequest.date,
                time: travelRequest.time,
                mode: travelRequest.mode
            });

            const result = response.data;

            // Format the results for the frontend
            let trainConnections = [];
            let carRoute = null;

            if (result.trips && result.trips.length > 0) {
                if (travelRequest.mode === 'train' || travelRequest.mode === 'car') {
                    trainConnections = result.trips.map(trip => this.formatTripForDisplay(trip));
                }

                if (travelRequest.mode === 'car' && result.trips.length > 0) {
                    carRoute = this.formatCarRouteForDisplay(result.trips[0]);
                }
            }

            return {
                requestXML: result.requestXML,
                trainConnections,
                carRoute
            };
        } catch (error) {
            console.error('Error in trip search:', error);
            throw new Error(`Failed to search for trip options: ${error.message}`);
        }
    }

    // Keep the existing format methods from previous implementations
    private formatTripForDisplay(trip: any) { /* ... */ }
    private formatCarRouteForDisplay(trip: any) { /* ... */ }
    private formatDateTime(date: Date): string { /* ... */ }
}