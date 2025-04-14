import {
  AfterViewInit,
  Component,
  effect,
  ElementRef,
  Inject,
  input,
  LOCALE_ID,
  model,
  ViewChild
} from '@angular/core';
import { CommonModule, formatDate } from '@angular/common';
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
export class MapPinLocationComponent implements AfterViewInit {
  @ViewChild('mapContainer') mapContainer!: ElementRef<HTMLDivElement>;

  // Standort vom Location-Selector (ohne Markierung anzeigen)
  locationFromSelector = input<MapLocation | undefined>();

  // Input für den festgelegten Treffpunkt (mit Markierung)
  meetingPoint = model<MapLocation | undefined>();

  // Mode: 'select' für Auswahlmodus, 'display' für Anzeigemodus
  mode = input<'select' | 'display'>('select');
  // Datum und Uhrzeit des Treffpunkts
  meetingDateTime = input<Date | undefined>();


  private map!: mapboxgl.Map;
  private marker?: mapboxgl.Marker;
  private mapInitialized = false;

  constructor(@Inject(LOCALE_ID) private locale: string) {
    mapboxgl.accessToken = env.mapboxToken;

    // Effect-Hook für Änderungen der Location vom Selector
    effect(() => {
      const location = this.locationFromSelector();
      if (location && this.mapInitialized) {
        // Karte auf den Standort zentrieren (ohne Marker)
        this.map.setCenter([location.longitude, location.latitude]);
        this.map.setZoom(15);
      }
    });

    // Effect-Hook für Änderungen des Treffpunkts
    effect(() => {
      const meeting = this.meetingPoint();
      if (meeting && this.mapInitialized) {
        this.updateMarker(meeting);
        this.map.setCenter([meeting.longitude, meeting.latitude]);
      }
    });

    // Effect-Hook für Änderungen des Modus
    effect(() => {
      if (this.mapInitialized) {
        this.configureMapForMode();
      }
    });
  }

  // Formatiert das Datum und die Uhrzeit für die Anzeige
  formatDateOnly(date: Date | null | undefined): string {
    if (!date) return '';
    return formatDate(date, 'dd.MM.yyyy', this.locale);
  }

  formatTimeOnly(date: Date | null | undefined): string {
    if (!date) return '';
    return formatDate(date, 'HH:mm', this.locale);
  }


  ngAfterViewInit() {
    this.initializeMap();
  }

  private initializeMap() {
    // Sicherstellen, dass das Mapbox-Token gesetzt ist
    if (!mapboxgl.accessToken) {
      console.error('Mapbox-Token ist nicht gesetzt');
      return;
    }

    // Nutze zuerst den Treffpunkt, dann den Standort vom Selector oder Default-Werte
    const initialCenter = this.meetingPoint() || this.locationFromSelector() || {
      longitude: 8.3,
      latitude: 47.0
    };

    try {
      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [initialCenter.longitude, initialCenter.latitude],
        zoom: 15
      });

      this.map.addControl(new mapboxgl.NavigationControl());

      this.map.on('load', () => {
        console.log('Karte wurde geladen');
        this.mapInitialized = true;
        this.configureMapForMode();

        // Nur für den Treffpunkt einen Marker setzen, nicht für den Standort vom Selector
        if (this.meetingPoint()) {
          this.updateMarker(this.meetingPoint()!);
        }
      });

      // Fehlerbehandlung
      this.map.on('error', (error) => {
        console.error('Mapbox-Fehler:', error);
      });
    } catch (error) {
      console.error('Fehler beim Initialisieren der Karte:', error);
    }
  }

  private configureMapForMode() {
    if (!this.map) return;

    if (this.mode() === 'select') {
      // Im Auswahlmodus: Klick-Listener hinzufügen und Karte interaktiv machen
      this.map.getCanvas().style.cursor = 'crosshair';

      // In neueren Mapbox-Versionen ist diese Eigenschaft privat - wir gehen anders vor
      this.map.dragPan.enable();
      this.map.scrollZoom.enable();
      this.map.boxZoom.enable();
      this.map.dragRotate.enable();
      this.map.keyboard.enable();
      this.map.doubleClickZoom.enable();
      this.map.touchZoomRotate.enable();

      // Event-Listener für Klicks zur Auswahl des Treffpunkts
      // Zuerst entfernen, um Doppelregistrierung zu vermeiden
      this.map.off('click', this.handleMapClick);
      this.map.on('click', (e) => {
        const clickedPoint: MapLocation = {
          longitude: e.lngLat.lng,
          latitude: e.lngLat.lat
        };
        this.meetingPoint.set(clickedPoint);
        this.updateMarker(clickedPoint);
      });

      console.log('Karte ist im Auswahlmodus - Klicken Sie, um einen Punkt zu setzen');
    } else {
      // Im Anzeigemodus: Karte nicht interaktiv machen und Klick-Listener entfernen
      this.map.getCanvas().style.cursor = 'default';

      // Deaktivieren der Interaktivität
      this.map.dragPan.enable();
      this.map.scrollZoom.enable();
      this.map.boxZoom.enable();
      this.map.dragRotate.enable();
      this.map.keyboard.disable();
      this.map.doubleClickZoom.enable();
      this.map.touchZoomRotate.enable();

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

    // Marker aktualisieren und meetingPoint-Signal aktualisieren
    this.updateMarker(newMeetingPoint);
    this.meetingPoint.set(newMeetingPoint);
  };

  private updateMarker(location: MapLocation) {
    // Wenn bereits ein Marker existiert, entferne ihn
    if (this.marker) {
      this.marker.remove();
    }

// Erstelle einen neuen Marker mit blauem Punkt
    this.marker = new mapboxgl.Marker({
      color: '#B3A1FF', // Blauer Punkt
      draggable: this.mode() === 'select' // Nur im Auswahlmodus ziehbar
    })
      .setLngLat([location.longitude, location.latitude])
      .addTo(this.map);

// Optional: Wenn der Marker ziehbar ist, Event für das Ende des Ziehens hinzufügen
    if (this.mode() === 'select') {
      this.marker.on('dragend', () => {
        const lngLat = this.marker!.getLngLat();
        const newLocation: MapLocation = {
          longitude: lngLat.lng,
          latitude: lngLat.lat
        };
        this.meetingPoint.set(newLocation);
      });
    }
  }


// ZWEITE FUNKTION: KARTE MIT PUNKT ANZEIGEN
  public showMapWithPoint(location?: MapLocation) {
    if (!location && !this.meetingPoint()) {
      console.warn('Kein Punkt zum Anzeigen vorhanden');
      return;
    }

    const pointToShow = location || this.meetingPoint()!;

    if (!this.mapInitialized) {
      // Falls die Karte noch nicht initialisiert ist, werden wir warten
      const checkInterval = setInterval(() => {
        if (this.mapInitialized) {
          clearInterval(checkInterval);
          this.map.setCenter([pointToShow.longitude, pointToShow.latitude]);
          this.updateMarker(pointToShow);
          // Modus auf "display" setzen, um die interaktive Auswahl zu deaktivieren
          this.mode.apply('display');
        }
      }, 100);
      return;
    }

    // Karte auf den Punkt zentrieren
    this.map.setCenter([pointToShow.longitude, pointToShow.latitude]);
    this.updateMarker(pointToShow);
    // Modus auf "display" setzen, um die interaktive Auswahl zu deaktivieren
    this.mode.apply('display');
  }

  protected readonly Date = Date;
}
