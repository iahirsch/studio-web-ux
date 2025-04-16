import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../../env/env';
import { HttpClient } from '@angular/common/http';

export interface CarInfoDto {
  availableSeats: number;
  seatComment: string;
  numberPlate: string;
  color: string;
  description: string;
}

@Injectable({
  providedIn: 'root'
})
export class CarInfoService {
  private apiUrl = `${env.api}/saveCarInfo`;

  constructor(private http: HttpClient) {}

  createCarInfo(carInfo: CarInfoDto): Observable<any> {
    return this.http.post<any>(this.apiUrl, carInfo);
  }

  updateCarInfo(id: string, carInfo: CarInfoDto): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, carInfo);
  }

  getCarInfo(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }
}
