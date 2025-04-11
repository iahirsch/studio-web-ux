// services/geolocation/geolocation.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  getCurrentPosition(): Observable<GeolocationPosition> {
    return new Observable<GeolocationPosition>(observer => {
      if (!navigator.geolocation) {
        observer.error('Geolocation wird von diesem Browser nicht unterstützt');
      } else {
        navigator.geolocation.getCurrentPosition(
          position => {
            observer.next(position);
            observer.complete();
          },
          error => {
            observer.error(error);
          },
          { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
        );
      }
    });
  }
}
