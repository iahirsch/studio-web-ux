import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-date-time-picker',
  imports: [CommonModule, FormsModule],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.css',
})
export class DateTimePickerComponent {
  selectedDate = '';
  selectedTime = '';

  @Output() dateTimeSelected = new EventEmitter<{
    date: string;
    time: string;
  }>();

  onDateTimeSelected(): void {
    if (this.selectedDate && this.selectedTime) {
      this.dateTimeSelected.emit({
        date: this.selectedDate,
        time: this.selectedTime,
      });
    }
  }
}
