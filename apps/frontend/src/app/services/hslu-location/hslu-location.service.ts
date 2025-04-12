// location-data.service.ts
import { Injectable } from '@angular/core';

export interface Location {
  id: string;
  title: string;
  city: string;
  coordinates: string; // Format: "latitude,longitude"
}

@Injectable({
  providedIn: 'root'
})
export class HsluLocationDataService {
  private hsluLocations: Location[] = [
    {
      id: 'informatik',
      title: 'Informatik',
      city: 'Rotkreuz',
      coordinates: '47.14352282294816,8.432576926508915'
    },
    {
      id: 'design',
      title: 'Design, Film und Kunst',
      city: 'Emmenbrücke',
      coordinates: '47.07173422069437,8.277630465694969'
    },
    {
      id: 'soziale-arbeit',
      title: 'Soziale Arbeit',
      city: 'Luzern',
      coordinates: '47.04824253253547,8.314788883279503'
    },
    {
      id: 'wirtschaft',
      title: 'Wirtschaft',
      city: 'Luzern',
      coordinates: '47.049212803608405,8.309684542699761'
    },
    {
      id: 'musik',
      title: 'Musik',
      city: 'Kriens',
      coordinates: '47.032920164342464,8.297112187930741'
    },
    {
      id: 'technik',
      title: 'Technik und Architektur',
      city: 'Horw',
      coordinates: '47.01459985298802,8.305195454112935'
    }
  ];

  getHsluLocations(): Location[] {
    return this.hsluLocations;
  }

  getLocationById(id: string | number): Location | null {
    return this.getHsluLocations().find(location => location.id === id) || null;
  }

// Methode hinzufügen, um den nächstgelegenen HSLU-Standort zu finden
  findNearestLocation(lat: number, lng: number): Location | null {
    const locations = this.getHsluLocations();

    if (locations.length === 0) return null;

    // Haversine-Formel zur Berechnung der Entfernung zwischen zwei Koordinaten
    const getDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
      const R = 6371; // Radius der Erde in km
      const dLat = this.deg2rad(lat2 - lat1);
      const dLon = this.deg2rad(lon2 - lon1);
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const d = R * c; // Entfernung in km
      return d;
    };

    // Finde den nächstgelegenen Standort
    let nearestLocation = locations[0];
    let minDistance = Number.MAX_VALUE;

    locations.forEach(location => {
      // Koordinaten aus dem String parsen
      const [locLat, locLng] = location.coordinates.split(',').map(coord => parseFloat(coord.trim()));
      const distance = getDistance(lat, lng, locLat, locLng);

      if (distance < minDistance) {
        minDistance = distance;
        nearestLocation = location;
      }
    });

    return nearestLocation;
  }

  private deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

}
