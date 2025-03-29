// apps/backend/src/app/ojp-api/ojp-sdk.service.ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class OjpSdkService {
    private OJP: any = null;
    private initialized = false;
    private initializing = false;
    private initPromise: Promise<any> | null = null;

    constructor(private configService: ConfigService) { }

    async initialize(): Promise<any> {
        if (this.initialized) {
            return this.OJP;
        }

        if (this.initializing) {
            return this.initPromise;
        }

        this.initializing = true;
        this.initPromise = new Promise<any>(async (resolve) => {
            try {
                const module = await import('ojp-sdk');
                this.OJP = module;
                this.initialized = true;
                resolve(this.OJP);
            } catch (error) {
                console.error('Failed to initialize OJP SDK:', error);
                throw error;
            } finally {
                this.initializing = false;
            }
        });

        return this.initPromise;
    }

    async getOJP() {
        return this.initialize();
    }

    async createApiConfig() {
        const OJP_API_URL = this.configService.get('OJP_API_URL') || 'https://api.opentransportdata.swiss/ojp2020';
        const OJP_API_TOKEN = this.configService.get('OJP_API_TOKEN');

        return {
            url: OJP_API_URL,
            authToken: OJP_API_TOKEN
        };
    }

    async locationSearch(locationName: string) {
        try {
            const OJP = await this.getOJP();
            const API_CONFIG = await this.createApiConfig();

            const locationRequest = OJP.LocationInformationRequest.initWithLocationName(
                API_CONFIG,
                'en',
                locationName,
                ['stop', 'address', 'poi'],
                5 // Get top 5 results
            );

            return await locationRequest.fetchResponse();
        } catch (error) {
            console.error('Error in location search:', error);
            throw new Error('Location search failed');
        }
    }

    async searchTrip(from: string, to: string, dateTime: Date, mode: 'train' | 'car') {
        try {
            const OJP = await this.getOJP();
            const API_CONFIG = await this.createApiConfig();

            // First search for locations
            const fromLocationResponse = await this.locationSearch(from);
            const toLocationResponse = await this.locationSearch(to);

            if (fromLocationResponse.locations.length === 0 || toLocationResponse.locations.length === 0) {
                throw new Error(`Could not find locations for '${from}' or '${to}'`);
            }

            const fromLocation = fromLocationResponse.locations[0];
            const toLocation = toLocationResponse.locations[0];

            // Create trip request based on mode
            let tripRequest;
            if (mode === 'car') {
                const fromTripLocation = new OJP.TripLocationPoint(fromLocation);
                const toTripLocation = new OJP.TripLocationPoint(toLocation);

                tripRequest = OJP.TripRequest.initWithTripLocationsAndDate(
                    API_CONFIG,
                    'en',
                    fromTripLocation,
                    toTripLocation,
                    dateTime,
                    'Dep',
                    true,  // includeLegProjection
                    'monomodal',  // modeType
                    'self-drive-car'  // transportMode
                );
            } else {
                tripRequest = OJP.TripRequest.initWithLocationsAndDate(
                    API_CONFIG,
                    'en',
                    fromLocation,
                    toLocation,
                    dateTime,
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

            // Get XML request for display
            const requestXML = tripRequest.requestInfo.requestXML;

            // Process the response
            return {
                requestXML,
                trips: tripRequest.response?.trips || [],
                error: tripRequest.requestInfo.error
            };
        } catch (error) {
            console.error('Error in trip search:', error);
            throw new Error('Trip search failed');
        }
    }
}