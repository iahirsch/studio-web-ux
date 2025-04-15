import { Component, forwardRef, Input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-date-time-picker',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ],
  templateUrl: './date-time-picker.component.html',
  styleUrl: './date-time-picker.component.css'
})
export class DateTimePickerComponent implements ControlValueAccessor {
  @Input() dateForm?: FormGroup;

  // Output-Event zur Weitergabe des ausgewählten Datums/Zeit
  dateTimeSelected = output<Date>();

  // Default-Werte für Datum und Zeit
  selectedDate: string;
  selectedTime: string;

  constructor() {
    // Aktuelles Datum im Format YYYY-MM-DD
    const today = new Date();
    this.selectedDate = today.toISOString().split('T')[0];

    // Aktuelle Zeit im Format HH:MM
    const hours = String(today.getHours()).padStart(2, '0');
    const minutes = String(today.getMinutes()).padStart(2, '0');
    this.selectedTime = `${hours}:${minutes}`;

    // Initial einmal emitieren
    this.emitDateTime();
  }

  // Diese Methode wird bei Änderungen an Datum oder Zeit aufgerufen
  onDateTimeChange(): void {
    this.emitDateTime();
    this.updateValue();
  }

  // Kombiniert Datum und Zeit zu einem Date-Objekt und emitiert es
  private emitDateTime(): void {
    if (this.selectedDate && this.selectedTime) {
      const [hours, minutes] = this.selectedTime.split(':').map(Number);
      const dateTime = new Date(this.selectedDate);
      dateTime.setHours(hours, minutes, 0, 0);

      this.dateTimeSelected.emit(dateTime);
    }
  }

  private updateValue() {
    const value = {
      date: this.selectedDate,
      departure: this.selectedTime
    };
    this.onChange(value);

    if (this.dateForm?.get('carConnection')) {
      const carConnection = this.dateForm.get('carConnection');
      carConnection?.get('date')?.setValue(this.selectedDate);
      carConnection?.get('departure')?.setValue(this.selectedTime);
    }
  }

  //ControlValueAccessor

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_value: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch = () => {};

  writeValue(obj: any): void {
    if (obj) {
      if (obj.date !== undefined) {
        this.selectedDate = obj.date;
      }
      if (obj.departure !== undefined) {
        this.selectedTime = obj.departure;
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
