
import * as xml2js from 'xml2js';

export async function parseOjpResponse(xml: string) {
    try {
        const result = await xml2js.parseStringPromise(xml, { explicitArray: false });
        console.log('Parsen der Antwort:', result); // Logge das geparste Ergebnis

        const trips = result?.OJP?.OJPResponse?.ServiceDelivery?.OJPTripDelivery?.Trip;

        if (!trips) {
            throw new Error('Trips nicht gefunden');
        }

        const simplified = Array.isArray(trips) ? trips : [trips];

        return {
            connections: simplified.map((trip: any) => ({
                from: trip.Origin.PlaceRef.LocationName.Text,
                to: trip.Destination.PlaceRef.LocationName.Text,
                departureTime: trip.Origin.DepArrTime,
                arrivalTime: trip.Destination.DepArrTime,
                transportMode: trip.LegList?.Leg?.LegTrack?.Train?.TransportMode || 'n/a'
            }))
        };
    } catch (err) {
        console.error('Fehler beim Parsen:', err);
        return { connections: [] };
    }
}

