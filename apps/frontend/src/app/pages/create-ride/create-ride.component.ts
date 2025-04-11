import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationSelectorComponent } from '../../components/location-selector/location-selector.component';
import { DateTimePickerComponent } from '../../components/date-time-picker/date-time-picker.component';
import { MapLocation, MapPinLocationComponent } from '../../components/map-pin-location/map-pin-location.component';
import { AvailableSeatsComponent } from '../../components/available-seats/available-seats.component';
import { PlateNumberComponent } from '../../components/plate-number/plate-number.component';
import { CarInfoComponent } from '../../components/car-info/car-info.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';

@Component({
  selector: 'app-create-ride',
  imports: [
    CommonModule,
    LocationSelectorComponent,
    DateTimePickerComponent,
    MapPinLocationComponent,
    AvailableSeatsComponent,
    PlateNumberComponent,
    CarInfoComponent,
    BtnPrimaryComponent
  ],
  templateUrl: './create-ride.component.html',
  styleUrl: './create-ride.component.css'
})
export class CreateRideComponent implements OnInit {
  fromLocation?: MapLocation;
  meetingPoint?: MapLocation;

  constructor() {
  }

  ngOnInit(): void {
    // Lifecycle-Methode wird derzeit nicht benötigt, kann aber später für die Initialisierung verwendet werden
    console.log('CreateRideComponent initialisiert');
  }

  // Event-Handler für die LocationSelector-Komponente
  onFromLocationSelected(location: any) {
    // Konvertiere die Location aus dem LocationSelector in das MapLocation-Format
    if (location?.geoPosition) {
      this.fromLocation = {
        longitude: location.geoPosition.longitude,
        latitude: location.geoPosition.latitude
      };
    }
  }

  // Event-Handler für die MapPinLocation-Komponente
  onMeetingPointSelected(location: MapLocation) {
    this.meetingPoint = location;
    console.log('Treffpunkt ausgewählt:', location);
    // Hier kannst du den Treffpunkt speichern
  }


}
