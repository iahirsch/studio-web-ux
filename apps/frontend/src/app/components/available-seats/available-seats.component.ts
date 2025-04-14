import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { InputTextareaComponent } from '../input-textarea/input-textarea.component';
import { ControlValueAccessor, FormGroup, FormsModule, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-available-seats',
  imports: [CommonModule, InputTextareaComponent, NgOptimizedImage, FormsModule],
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
export class AvailableSeatsComponent implements ControlValueAccessor {
  @Input() formGroup!: FormGroup;
  passengers = 1;

  increment() {
    if (this.passengers <= 8) {
      this.passengers++;
      this.onChange(this.passengers);
    }
  }

  decrement() {
    if (this.passengers >= 2) {
      this.passengers--;
      this.onChange(this.passengers);
    }
  }

  //ControlValueAccessor

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_value: number) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  writeValue(obj: number): void {
    this.passengers = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
