import { Component, forwardRef, Input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ControlValueAccessor, FormBuilder, FormGroup, FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-available-seats',
  imports: [CommonModule, NgOptimizedImage, FormsModule, ReactiveFormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => AvailableSeatsComponent),
      multi: true
    }
  ],
  templateUrl: './available-seats.component.html',
  styleUrl: './available-seats.component.css'
})
export class AvailableSeatsComponent implements ControlValueAccessor, OnInit {
  @Input() seatsForm?: FormGroup;

  passengers = 1;
  text = '';
  isInfoVisible = true;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    // If integrated with a parent form, update the parent form when values change
    if (this.seatsForm) {
      // Ensure the form structure exists
      if (!this.seatsForm.get('carInfo')) {
        this.seatsForm.addControl('carInfo', this.fb.group({
          availableSeats: [this.passengers],
          seatComment: [this.text]
        }));
      }

      // Update local values if parent form already has values
      const carInfo = this.seatsForm.get('carInfo');
      if (carInfo) {
        const seats = carInfo.get('availableSeats')?.value;
        const comment = carInfo.get('seatComment')?.value;

        if (seats !== undefined) this.passengers = seats;
        if (comment !== undefined) this.text = comment;
      }
    }
  }

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.text = textarea.value;
    this.isInfoVisible = textarea.value.trim() === '';
    this.updateValue();
  }

  increment() {
    if (this.passengers < 8) {
      this.passengers++;
      this.updateValue();

      // If integrated with a parent form, update the form value
      if (this.seatsForm?.get('carInfo')?.get('availableSeats')) {
        this.seatsForm.get('carInfo')?.get('availableSeats')?.setValue(this.passengers);
      }
    }
  }

  decrement() {
    if (this.passengers > 1) {
      this.passengers--;
      this.updateValue();

      // If integrated with a parent form, update the form value
      if (this.seatsForm?.get('carInfo')?.get('availableSeats')) {
        this.seatsForm.get('carInfo')?.get('availableSeats')?.setValue(this.passengers);
      }
    }
  }

  // Method to update the combined value
  private updateValue() {
    const value = {
      availableSeats: this.passengers,
      seatComment: this.text
    };
    this.onChange(value);

    // If integrated with a parent form, update the form values
    if (this.seatsForm?.get('carInfo')) {
      const carInfo = this.seatsForm.get('carInfo');
      carInfo?.get('availableSeats')?.setValue(this.passengers);
      carInfo?.get('seatComment')?.setValue(this.text);
    }
  }

  // ControlValueAccessor

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_value: any) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  writeValue(obj: any): void {
    if (obj) {
      if (obj.availableSeats !== undefined) {
        this.passengers = obj.availableSeats;
      }
      if (obj.seatComment !== undefined) {
        this.text = obj.seatComment;
        this.isInfoVisible = this.text.trim() === '';
      }
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
