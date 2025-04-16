import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-plate-number',
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PlateNumberComponent),
      multi: true
    }
  ],
  templateUrl: './plate-number.component.html',
  styleUrl: './plate-number.component.css'
})
export class PlateNumberComponent implements ControlValueAccessor {
  numberPlate = '';

  //ControlValueAccessor

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_value: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch = () => {};

  onInputChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.numberPlate = value;
    this.onChange(value);
    this.onTouch();
  }

  writeValue(obj: any): void {
    this.numberPlate = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }
}
