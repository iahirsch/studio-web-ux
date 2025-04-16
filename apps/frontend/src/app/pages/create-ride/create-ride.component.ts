import { Component, inject, OnInit, signal, ViewChild } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { LocationSelectorComponent } from '../../components/location-selector/location-selector.component';
import { DateTimePickerComponent } from '../../components/date-time-picker/date-time-picker.component';
import { MapLocation, MapPinLocationComponent } from '../../components/map-pin-location/map-pin-location.component';
import { AvailableSeatsComponent } from '../../components/available-seats/available-seats.component';
import { PlateNumberComponent } from '../../components/plate-number/plate-number.component';
import { CarInfoComponent } from '../../components/car-info/car-info.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarInfoService } from '../../services/car-info/car-info.service';
import { PopupFeedbackCarRideComponent } from '../../components/popups/popup-feedback-car-ride/popup-feedback-car-ride.component';
import { Router } from '@angular/router';
import { CarConnectionService } from '../../services/car-connection/car-connection.service';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';

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
    BtnPrimaryComponent,
    FormsModule,
    ReactiveFormsModule,
    PopupFeedbackCarRideComponent
  ],
  templateUrl: './create-ride.component.html',
  styleUrl: './create-ride.component.css'
})
export class CreateRideComponent implements OnInit {
  form: FormGroup;
  submitted = false;
  formData: any;
  isLoading = false;
  fromLocation?: MapLocation;
  meetingPoint?: MapLocation;
  selectedDateTime = signal<Date>(new Date());
  dateTimeSelected = signal(false);

  private location = inject(Location);
  private ojpSdkService = inject(OjpSdkService);

  createdCarInfo: any;
  createdConnection: any;

  @ViewChild(LocationSelectorComponent) locationSelector!: LocationSelectorComponent;
  @ViewChild(MapPinLocationComponent) mapPinLocation!: MapPinLocationComponent;

  ngOnInit(): void {
    console.log('CreateRideComponent initialisiert');
  }

  constructor(private fb: FormBuilder,
              private carInfoService: CarInfoService,
              private carConnectionService: CarConnectionService,
              private router: Router) {
    this.form = this.fb.group({
      carInfo: this.fb.group({
        availableSeats: [1, [Validators.required, Validators.min(1), Validators.max(9)]],
        seatComment: [''],
        numberPlate: ['', Validators.required],
        color: [''],
        description: ['']
      }),
      carConnection: this.fb.group({
        from: ['', Validators.required],
        to: ['', Validators.required],
        date: [this.formatDate(new Date()), Validators.required],
        departure: ['', Validators.required],
        arrival: ['', Validators.required],
        duration: ['', Validators.required]
      })
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  onDateTimeSelected(dateTime: Date): void {
    console.log('Datum/Zeit ausgewählt:', dateTime);
    this.selectedDateTime.set(dateTime);
    this.dateTimeSelected.set(true);
  }

  async onSubmit() {
    try {
      await this.searchConnections();
      this.formData = this.form.value;

      if (this.form.invalid) {
        console.log('Validation errors:');
        return;
      }

      console.log(this.formData);
      this.isLoading = true;

      // First create the car info
      this.carInfoService.createCarInfo(this.formData).subscribe({
        next: (response) => {
          console.log('Ride created successfully:', response);

          this.createdCarInfo = response.carData;
          this.formData.carConnection.carInfoId = response.carData.id;

          this.carConnectionService.createCarConnection(this.formData).subscribe({
            next: (connectionResponse) => {
              console.log('Connection created successfully:', connectionResponse);
              this.createdConnection = connectionResponse.connectionData;
              this.submitted = true;
              this.isLoading = false;
            },
            error: (error) => {
              console.error('Error creating connection:', error);
              this.isLoading = false;
            }
          });
        },
        error: (error) => {
          console.error('Error creating ride:', error);
          this.isLoading = false;
        }
      });
    } catch (error) {
      console.error('Error in submission process:', error);
      this.isLoading = false;
    }
  }

  closePopup() {
    this.submitted = false;
  }

  // Event-Handler für die LocationSelector-Komponente
  onFromLocationSelected(location: any) {
    console.log('Standort ausgewählt:', location);

    if (this.form?.get('carConnection')) {
      const carConnection = this.form.get('carConnection');
      carConnection?.get('from')?.setValue(location);
    }

    // Konvertiere die Location aus dem LocationSelector in das MapLocation-Format
    if (location?.geoPosition) {
      this.fromLocation = {
        longitude: location.geoPosition.longitude,
        latitude: location.geoPosition.latitude
      };
      console.log('Konvertierte MapLocation:', this.fromLocation); // Zum Debugging hinzufügen
    } else {
      console.error('Ungültiges Location-Format empfangen:', location);
    }
  }

  onToLocationSelected(location: any) {
    if (this.form?.get('carConnection')) {
      const carConnection = this.form.get('carConnection');
      carConnection?.get('to')?.setValue(location);
    }
  }

  // Event-Handler für die MapPinLocation-Komponente
  onMeetingPointSelected(location: MapLocation) {
    this.meetingPoint = location;
    console.log('Treffpunkt ausgewählt:', location);
    // Hier kannst du den Treffpunkt speichern
  }

  private searchConnections(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      let fromCoords = '';
      let toCoords = '';

      if (this.form?.get('carConnection')) {
        const carConnection = this.form.get('carConnection');
        const fromControl = carConnection?.get('from');
        const toControl = carConnection?.get('to');

        if (fromControl?.value) {
          if (typeof fromControl.value === 'string') {
            fromCoords = this.ensureCoordinateFormat(fromControl.value);
          } else if (fromControl.value.coordinates) {
            fromCoords = this.ensureCoordinateFormat(fromControl.value.coordinates);
          }
        }
        if (toControl?.value) {
          if (typeof toControl.value === 'string') {
            toCoords = this.ensureCoordinateFormat(toControl.value);
          } else if (toControl.value.coordinates) {
            toCoords = this.ensureCoordinateFormat(toControl.value.coordinates);
          }
        }
      }

      this.ojpSdkService.searchTrip(
        fromCoords,
        toCoords,
        this.selectedDateTime(),
        'car'
      ).then(result => {

        if (result.trips && result.trips.length > 0) {
          const limitedTrips = result.trips.slice(0, 1);
          limitedTrips.map(trip => {
            const tripInfo = this.ojpSdkService.formatTripForDisplay(trip);

            let departureTime = '';
            const departureTimeMatch = tripInfo.departure.match(/(\d{2}:\d{2})$/);
            if (departureTimeMatch && departureTimeMatch[1]) {
              departureTime = departureTimeMatch[1];
            } else {
              try {
                const dateObj = new Date(tripInfo.departure);
                departureTime = this.formatTime(dateObj);
              } catch (e) {
                console.error('Error parsing departure time:', e);
              }
            }
            let arrivalTime = '';
            const timeMatch = tripInfo.arrival.match(/(\d{2}:\d{2})$/);
            if (timeMatch && timeMatch[1]) {
              arrivalTime = timeMatch[1];
            } else {
              try {
                const dateObj = new Date(tripInfo.arrival);
                arrivalTime = this.formatTime(dateObj);
              } catch (e) {
                console.error('Error parsing arrival time:', e);
              }
            }

            const carConnection = this.form.get('carConnection');
            carConnection?.get('departure')?.setValue(departureTime);
            carConnection?.get('arrival')?.setValue(arrivalTime);
            carConnection?.get('duration')?.setValue(tripInfo.duration);

            resolve();
          });
        } else {
          console.log('Keine Verbindungen in der Antwort gefunden');
        }
      }).catch(error => {
        console.error('Error searching connections:', error);
        reject(error);
      });
    });
  }

  private ensureCoordinateFormat(coordinates: string): string {
    // Prüfe, ob die Koordinaten im Format "lat,lon" vorliegen
    if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(coordinates)) {
      return coordinates; // Format ist bereits korrekt
    }

    // Falls die Koordinaten im Format "lon,lat" vorliegen (GeoJSON)
    if (/^-?\d+(\.\d+)?,-?\d+(\.\d+)?$/.test(coordinates)) {
      const [lon, lat] = coordinates.split(',').map(c => parseFloat(c.trim()));
      if (!isNaN(lon) && !isNaN(lat)) {
        return `${lat},${lon}`; // Konvertiere zu "lat,lon"
      }
    }

    // Falls das Format nicht erkannt wird, gib das Original zurück
    console.warn('Unbekanntes Koordinatenformat:', coordinates);
    return coordinates;
  }

  goBack(): void {
    this.location.back();
  }
}
