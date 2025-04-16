import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../env/env';
import { HttpClient } from '@angular/common/http';

export interface CarConnectionDto {
  from: object;
  to: object;
  date: Date;
  departure: Date;
}

@Injectable({
  providedIn: 'root'
})
export class CarConnectionService {
  private apiUrl = `${env.api}`;

  constructor(private http: HttpClient) {}

  createCarConnection(carConnection: CarConnectionDto): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/saveCarConnection`, carConnection);
  }

  updateCarConnection(id: string, carConnection: CarConnectionDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, carConnection);
  }

  deleteCarConnection(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/carConnections/${id}`);
  }

  getCarConnection(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/carConnections/${id}`);
  }

  getUserCarConnections() {
    return this.http.get<any[]>(`${this.apiUrl}/getUserCarConnections`);
  }
}
