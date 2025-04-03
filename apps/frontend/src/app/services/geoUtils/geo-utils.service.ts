import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class GeoUtilsService {
    /**
     * Konvertiert Koordinaten in OJP-kompatibles Format (Longitude, Latitude)
     * @param coordinates Koordinaten im Format "Latitude, Longitude"
     * @returns Koordinaten im Format "Longitude, Latitude"
     */
    convertToOJPFormat(coordinates: string): string {
        const [latitude, longitude] = coordinates.split(',').map(coord => coord.trim());
        return `${longitude},${latitude}`;
    }

    /**
     * Überprüft, ob Koordinaten gültig sind
     * @param coordinates Koordinaten als String
     * @returns Ob Koordinaten gültig sind
     */
    isValidCoordinates(coordinates: string): boolean {
        const parts = coordinates.split(',').map(coord => parseFloat(coord.trim()));
        return (
            parts.length === 2 &&
            !isNaN(parts[0]) &&
            !isNaN(parts[1]) &&
            parts[0] >= -90 &&
            parts[0] <= 90 &&
            parts[1] >= -180 &&
            parts[1] <= 180
        );
    }
}