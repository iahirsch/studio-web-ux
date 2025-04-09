import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationSelectorComponent } from '../../components/location-selector/location-selector.component';
import { DateTimePickerComponent } from '../../components/date-time-picker/date-time-picker.component';
import { CardCarComponent } from '../../components/card-car/card-car.component';
import { CardTrainComponent } from '../../components/card-train/card-train.component';

@Component({
  selector: 'app-search-ride',
  imports: [CommonModule, LocationSelectorComponent, DateTimePickerComponent, CardCarComponent, CardTrainComponent],
  templateUrl: './search-ride.component.html',
  styleUrl: './search-ride.component.css'
})
export class SearchRideComponent {
}
