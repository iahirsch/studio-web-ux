import { Component, Input, OnInit, OnChanges, SimpleChanges, ElementRef, ViewChild } from '@angular/core';
import mapboxgl from 'mapbox-gl';
import { env } from '../../../env/env';

interface MapLocation {
  longitude: number;
  latitude: number;
  label?: string;
}

@Component({
  selector: 'app-mapbox',
  template: `
    <div #mapContainer class="map-container"></div>
  `,
  styles: [`
    .map-container {
      width: 100%;
      height: 400px;
    }
  `]
})
export class MapboxComponent implements OnInit, OnChanges {
  @ViewChild('mapContainer') mapContainer: ElementRef;

  @Input() locations: MapLocation[] = [];
  @Input() center: MapLocation = {
    longitude: 8.3,
    latitude: 47.0
  };
  @Input() zoom: number = 8;

  private map: mapboxgl.Map;
  private markers: mapboxgl.Marker[] = [];

  constructor() {
    mapboxgl.accessToken = env.mapboxToken;
  }

  ngOnInit() {
    this.initializeMap();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['locations'] && !changes['locations'].firstChange) {
      this.updateMarkers();
    }

    if (changes['center'] && this.map) {
      this.map.setCenter([this.center.longitude, this.center.latitude]);
    }
  }

  private initializeMap() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer.nativeElement,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [this.center.longitude, this.center.latitude],
      zoom: this.zoom
    });

    this.map.addControl(new mapboxgl.NavigationControl());

    this.map.on('load', () => {
      this.updateMarkers();
    });
  }

  private updateMarkers() {
    // Remove existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Add new markers
    this.locations.forEach(location => {
      const marker = new mapboxgl.Marker()
        .setLngLat([location.longitude, location.latitude])
        .addTo(this.map);

      if (location.label) {
        new mapboxgl.Popup({ offset: 25 })
          .setLngLat([location.longitude, location.latitude])
          .setHTML(`<h3>${location.label}</h3>`)
          .addTo(this.map);
      }

      this.markers.push(marker);
    });

    // Fit map to markers if multiple locations
    if (this.locations.length > 1) {
      const bounds = new mapboxgl.LngLatBounds();
      this.locations.forEach(location => {
        bounds.extend([location.longitude, location.latitude]);
      });
      this.map.fitBounds(bounds, {
        padding: 50,
        maxZoom: this.zoom
      });
    }
  }
}