import { Component, OnInit } from '@angular/core';
import * as L from 'leaflet'; // Importiere Leaflet

@Component({
    selector: 'app-map-view',
    templateUrl: './map-view.component.html',
    styleUrls: ['./map-view.component.css']
})
export class MapViewComponent implements OnInit {
    private map!: L.Map; // Definiere die Karte als private Variable

    constructor() { }

    ngOnInit(): void {
        this.initializeMap();
    }

    private initializeMap(): void {
        // Initialisiere die Karte
        this.map = L.map('map', {
            center: [47.3769, 8.5417], // Startkoordinaten für Zürich
            zoom: 12, // Startzoomlevel
        });

        // Füge eine OpenStreetMap-Schicht hinzu
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        // Optional: Setze einen Marker auf der Karte
        L.marker([47.3769, 8.5417]).addTo(this.map)
            .bindPopup('<b>Startpunkt</b><br>Dies ist der Startpunkt auf der Karte.')
            .openPopup();
    }
}
