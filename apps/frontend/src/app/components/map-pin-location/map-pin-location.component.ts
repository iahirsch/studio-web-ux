import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ElementRef,
  ViewChild,
  AfterViewInit
} from '@angular/core';
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
    <div #mapContainer style="width: 100%; height: 400px;"></div>
  `,
  styles: [`
    .mapboxgl-popup {
      z-index: 10;
    }
  `]
})
export class MapPinLocationComponent implements AfterViewInit, OnChanges {
  @ViewChild('mapContainer', { static: false }) mapContainer!: ElementRef<HTMLDivElement>;

  @Input() locations: MapLocation[] = [];
  @Input() geometry: GeoJSON.Feature[] = [];
  @Input() center: MapLocation = {
    longitude: 8.3,
    latitude: 47.0
  };
  @Input() zoom = 8;

  private map!: mapboxgl.Map;
  private markers: mapboxgl.Marker[] = [];

  constructor() {
    mapboxgl.accessToken = env.mapboxToken;
  }


  ngAfterViewInit() {
    if (this.mapContainer) {
      this.initializeMap();
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.map) {
      if (changes['locations']) {
        this.updateMarkers();
      }

      if (changes['geometry']) {
        this.updateGeometry();
      }

      if (changes['center']) {
        this.map.setCenter([this.center.longitude, this.center.latitude]);
      }
    }
  }

  private initializeMap() {
    try {
      this.map = new mapboxgl.Map({
        container: this.mapContainer.nativeElement,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [this.center.longitude, this.center.latitude],
        zoom: this.zoom
      });

      // Handle missing images
      this.map.on('styleimagemissing', (e) => {
        const id = e.id;
        // Fallback for missing images
        const missingImageWidth = 20;
        const missingImageHeight = 20;
        const missingImage = new ImageData(missingImageWidth, missingImageHeight);

        // Fill the image with a visible color
        for (let i = 0; i < missingImage.data.length; i += 4) {
          missingImage.data[i] = 200;     // Red
          missingImage.data[i + 1] = 200; // Green
          missingImage.data[i + 2] = 200; // Blue
          missingImage.data[i + 3] = 255; // Alpha
        }

        this.map.addImage(id, missingImage);
      });

      this.map.addControl(new mapboxgl.NavigationControl());

      this.map.on('load', () => {
        this.updateMarkers();
        this.updateGeometry();
      });
    } catch (error) {
      console.error('Error initializing map-pin-location:', error);
    }
  }

  private updateMarkers() {
    // Remove existing markers
    this.markers.forEach(marker => marker.remove());
    this.markers = [];

    // Add new markers
    this.locations.forEach(location => {
      const marker = new mapboxgl.Marker({
        color: location.label === 'Current Location' ? 'blue' : 'red'
      })
        .setLngLat([location.longitude, location.latitude])
        .addTo(this.map);

      if (location.label) {
        new mapboxgl.Popup({
          offset: 25,
          closeButton: false,
          maxWidth: '300px'
        })
          .setLngLat([location.longitude, location.latitude])
          .setHTML(`<h3>${location.label}</h3>`)
          .addTo(this.map);
      }

      this.markers.push(marker);
    });

    // Fit map-pin-location to markers if multiple locations
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

  private updateGeometry() {
    // Remove previous geometries
    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    // No geometry available
    if (!this.geometry || this.geometry.length === 0) return;

    // Combine all geometries
    const combinedGeometry: GeoJSON.FeatureCollection = {
      type: 'FeatureCollection',
      features: this.geometry
    };

    // Add geometry to map-pin-location
    this.map.addSource('route', {
      type: 'geojson',
      data: combinedGeometry
    });

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: 'route',
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75
      }
    });

    // Adjust map-pin-location view to geometry
    if (this.geometry.length > 0) {
      const bounds = new mapboxgl.LngLatBounds();
      this.geometry.forEach(feature => {
        if (feature.geometry.type === 'LineString') {
          feature.geometry.coordinates.forEach(coord => {
            bounds.extend(coord as [number, number]);
          });
        }
      });

      if (!bounds.isEmpty()) {
        this.map.fitBounds(bounds, {
          padding: 50,
          maxZoom: this.zoom
        });
      }
    }
  }
}
