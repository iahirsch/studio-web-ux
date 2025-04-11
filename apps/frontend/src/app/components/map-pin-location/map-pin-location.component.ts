import { AfterViewInit, Component, ElementRef, input, model, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import mapboxgl from 'mapbox-gl';
import { env } from '../../../env/env';

export interface MapLocation {
  longitude: number;
  latitude: number;
  label?: string;
}

@Component({
  selector: 'app-map-pin-location',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './map-pin-location.component.html',
  styleUrls: ['./map-pin-location.component.css']
})
export class MapPinLocationComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  // Neue Input/Output Schreibweise
  // Standort vom Location-Selector (ohne Markierung anzeigen)
  locationFromSelector = input<MapLocation | undefined>();

  // Input für den festgelegten Treffpunkt (mit Markierung)
  meetingPoint = model<MapLocation | undefined>();

  // Mode: 'select' für Auswahlmodus, 'display' für Anzeigemodus
  mode = input<'select' | 'display'>('select');

  // Icon-URL und Text für die Karte
  iconUrl = input<string>('/assets/icons/meeting_point.svg');
  title = input<string>('Treffpunkt wählen');

  private map!: mapboxgl.Map;
  private marker?: mapboxgl.Marker;

  constructor() {
    mapboxgl.accessToken = env.mapboxToken;
  }

  ngAfterViewInit() {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.map) return;

    // Wir nutzen weiterhin ngOnChanges für Reaktionen auf Änderungen
    // für die neue Inputs, da wir auf mehrere Änderungen gleichzeitig reagieren müssen

    if (changes['locationFromSelector'] && this.locationFromSelector() && !this.meetingPoint()) {
      // Wenn nur der Standort vom Selector geändert wurde und kein Treffpunkt gesetzt ist,
      // den Kartenausschnitt anpassen (ohne Marker)
      this.map.setCenter([this.locationFromSelector()!.longitude, this.locationFromSelector()!.latitude]);
      this.map.setZoom(15); // Nahe genug für Straßendetails
    }

    if (changes['meetingPoint'] && this.meetingPoint()) {
      // Wenn ein Treffpunkt gesetzt ist, Marker platzieren und Karte darauf zentrieren
      this.updateMarker(this.meetingPoint()!);
      this.map.setCenter([this.meetingPoint()!.longitude, this.meetingPoint()!.latitude]);
    }

    if (changes['mode']) {
      // Je nach Modus die Karten-Interaktivität einstellen
      this.configureMapForMode();
    }
  }

  private initializeMap() {
    // Nutze zuerst den Treffpunkt, dann den Standort vom Selector oder Default-Werte
    const initialCenter = this.meetingPoint() || this.locationFromSelector() || {
      longitude: 8.3,
      latitude: 47.0
    };

    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [initialCenter.longitude, initialCenter.latitude],
      zoom: 15,
      interactive: this.mode() === 'select'
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.configureMapForMode();

      // Nur für den Treffpunkt einen Marker setzen, nicht für den Standort vom Selector
      if (this.meetingPoint()) {
        this.updateMarker(this.meetingPoint()!);
      }
    });
  }

  private configureMapForMode() {
    if (!this.map) return;

    if (this.mode() === 'select') {
      // Im Auswahlmodus: Klick-Listener hinzufügen und Karte interaktiv machen
      this.map.getCanvas().style.cursor = 'crosshair';
      this.map._interactive = true;

      // Event-Listener für Klicks zur Auswahl des Treffpunkts
      this.map.on('click', this.handleMapClick);
    } else {
      // Im Anzeigemodus: Karte nicht interaktiv machen und Klick-Listener entfernen
      this.map.getCanvas().style.cursor = 'default';
      this.map._interactive = false;
      this.map.off('click', this.handleMapClick);
    }
  }

  // Event-Handler für Klicks auf die Karte
  private handleMapClick = (e: mapboxgl.MapMouseEvent) => {
    const { lng, lat } = e.lngLat;

    const newMeetingPoint: MapLocation = {
      longitude: lng,
      latitude: lat,
      label: 'Treffpunkt'
    };

    this.updateMarker(newMeetingPoint);
    this.meetingPoint.set(newMeetingPoint);
  };

  private updateMarker(location: MapLocation) {
    // Bestehenden Marker entfernen
    if (this.marker) {
      this.marker.remove();
    }

    // Neuen Marker erstellen mit dem angegebenen Icon
    this.marker = new mapboxgl.Marker({
      element: this.createCustomMarkerElement(this.iconUrl())
    })
      .setLngLat([location.longitude, location.latitude])
      .addTo(this.map);
  }

  private createCustomMarkerElement(iconUrl: string): HTMLElement {
    const element = document.createElement('div');
    element.className = 'custom-marker';
    element.style.backgroundImage = `url(${iconUrl})`;
    element.style.width = '32px';
    element.style.height = '32px';
    element.style.backgroundSize = 'cover';
    return element;
  }
}
