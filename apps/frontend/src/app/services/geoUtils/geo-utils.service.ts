import { Injectable } from '@angular/core';

export interface BBox {
  minLon: number;
  minLat: number;
  maxLon: number;
  maxLat: number;
}

@Injectable({
  providedIn: 'root'
})
export class GeoUtilsService {
  /**
   * Converts a single coordinate string to a bounding box
   * @param coordinates Coordinate string in format "lon,lat"
   * @param bufferInMeters Buffer around the point (default 500 meters)
   * @returns BBox object
   */
  convertCoordinateToBBox(coordinates: string, bufferInMeters = 500): BBox {
    // Parse the coordinates
    const [lon, lat] = coordinates.split(',').map(parseFloat);

    if (isNaN(lon) || isNaN(lat)) {
      throw new Error('Invalid coordinate format. Expected "lon,lat"');
    }

    // Approximate conversion of meters to degrees (rough approximation)
    const metersPerDegreeAtEquator = 111320;
    const bufferDegrees = bufferInMeters / metersPerDegreeAtEquator;

    return {
      minLon: lon - bufferDegrees,
      minLat: lat - bufferDegrees,
      maxLon: lon + bufferDegrees,
      maxLat: lat + bufferDegrees
    };
  }

  /**
   * Converts a bounding box to a string format suitable for OJP API
   * @param bbox BBox object
   * @returns Formatted bbox string
   */
  formatBBoxForOJP(bbox: BBox): string {
    return `${bbox.minLon},${bbox.minLat},${bbox.maxLon},${bbox.maxLat}`;
  }
}
