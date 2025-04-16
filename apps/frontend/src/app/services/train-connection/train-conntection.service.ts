// train-connection.service.ts - Interface hinzufügen
import { BehaviorSubject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Trip, TripTimedLeg } from 'ojp-sdk';

export interface TrainConnection {
  departure: string;
  arrival: string;
  duration: string;
  transfers: number;
  platforms: string[];
  serviceName: string;
  destinationName: string;
  legs?: TripTimedLeg[];
  tripDetails?: Trip;

}

@Injectable({
  providedIn: 'root'
})
export class TrainConnectionService {
  private selectedConnectionSubject = new BehaviorSubject<TrainConnection | null>(null);
  selectedConnection$ = this.selectedConnectionSubject.asObservable();

  setSelectedConnection(connection: TrainConnection): void {
    this.selectedConnectionSubject.next(connection);
  }

  getSelectedConnection(): TrainConnection | null {
    return this.selectedConnectionSubject.value;
  }
}
