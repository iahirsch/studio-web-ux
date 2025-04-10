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

  getLocationById(id: string): Location | undefined {
    return this.hsluLocations.find(location => location.id === id);
  }
}
