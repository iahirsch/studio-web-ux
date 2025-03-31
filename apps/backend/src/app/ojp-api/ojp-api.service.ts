// apps/backend/src/app/ojp-api/ojp-api.service.ts
import { Injectable } from '@nestjs/common';
import { TravelRequestDto } from './dto/travel-request.dto';
import { OjpSdkService } from './ojp-sdk.service';

@Injectable()
export class OjpApiService {
    constructor(private ojpSdkService: OjpSdkService) { }

    async getJourney(from: string, to: string) {
        try {
            // Simple journey search using the SDK
            const date = new Date();
            const result = await this.ojpSdkService.searchTrip(from, to, date, 'train');

            return {
                requestXML: result.requestXML,
                result: result
            };
        } catch (error) {
            console.error('Error in journey request:', error);
            throw new Error('OJP API request failed');
        }
    }

    async searchTrip(travelRequest: TravelRequestDto) {
        try {
            // Format date and time
            const dateTimeStr = `${travelRequest.date}T${travelRequest.time}:00`;
            const departureDate = new Date(dateTimeStr);

            // Use the SDK service to perform the search
            const result = await this.ojpSdkService.searchTrip(
                travelRequest.from,
                travelRequest.to,
                departureDate,
                travelRequest.mode
            );

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
                carRoute,
                error: result.error
            };
        } catch (error) {
            console.error('Error in trip search:', error);
            throw new Error(`Failed to search for trip options: ${error.message}`);
        }
    }

    private formatTripForDisplay(trip: any) {
        const departureTime = trip.computeDepartureTime();
        const arrivalTime = trip.computeArrivalTime();

        // Get platforms for each leg
        const platforms = trip.legs
            .filter(leg => leg.legType === 'TimedLeg')
            .map(leg => leg.fromStopPoint.plannedPlatform || 'Unknown');

        return {
            departure: departureTime ? this.formatDateTime(departureTime) : 'Unknown',
            arrival: arrivalTime ? this.formatDateTime(arrivalTime) : 'Unknown',
            duration: trip.stats.duration.formatDuration(),
            transfers: trip.stats.transferNo,
            platforms: platforms
        };
    }

    private formatCarRouteForDisplay(trip: any) {
        // Extract route steps from path guidance if available
        const steps = [];
        for (const leg of trip.legs) {
            if (leg.legType === 'ContinousLeg') {
                if (leg.pathGuidance) {
                    leg.pathGuidance.sections.forEach(section => {
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
        return date.toLocaleString('en-US', options);
    }
}