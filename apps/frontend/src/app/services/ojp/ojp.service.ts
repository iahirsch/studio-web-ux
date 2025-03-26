import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class OjpService {
    private baseUrl = 'http://localhost:3000/api/ojp'; // Dein Backend-Endpunkt

    constructor(private http: HttpClient) { }

    searchConnections(from: string, to: string): Observable<any> {
        return this.http.get(`${this.baseUrl}?from=${from}&to=${to}`);
    }
}
