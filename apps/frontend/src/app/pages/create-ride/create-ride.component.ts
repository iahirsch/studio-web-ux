import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
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
  
  createdCarInfo: any;
  createdConnection: any;

  @ViewChild(LocationSelectorComponent) locationSelector!: LocationSelectorComponent;
  @ViewChild(MapPinLocationComponent) mapPinLocation!: MapPinLocationComponent;

  ngOnInit(): void {
    // Lifecycle-Methode wird derzeit nicht benötigt, kann aber später für die Initialisierung verwendet werden
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
        departure: [this.formatTime(new Date()), Validators.required]
      })
    });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatTime(date: Date): string {
    return date.toTimeString().slice(0, 5);
  }

  onSubmit() {
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
}
