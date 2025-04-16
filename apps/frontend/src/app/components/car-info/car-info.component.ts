import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillItem, PillsComponent } from '../pills/pills.component';
import { InputTextComponent } from '../input-text/input-text.component';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-car-info',
  standalone: true,
  imports: [CommonModule, PillsComponent, InputTextComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CarInfoComponent),
      multi: true
    }
  ],
  templateUrl: './car-info.component.html',
  styleUrl: './car-info.component.css'
})
export class CarInfoComponent implements ControlValueAccessor {
  @Input() seatsForm?: FormGroup;

  colorPills: PillItem[] = [
    { id: 'white', label: 'Weiss', color: '#FFFFFF' },
    { id: 'grau', label: 'Grau', color: '#C0C0C0' },
    { id: 'black', label: 'Schwarz', color: '#000000' },
    { id: 'red', label: 'Rot', color: '#FF0000' },
    { id: 'blue', label: 'Blau', color: '#0000FF' },
    { id: 'yellow', label: 'Gelb', color: '#E7BC46' },
    { id: 'other', label: 'andere' }
  ];

  selectedColor = 'black';
  description = '';

  constructor() {
    // Standard-Farbe setzen
    this.colorPills[0].isSelected = true;
  }

  onColorSelected(pillItem: PillItem): void {
    this.selectedColor = pillItem.id as string;
    this.updateValue();
    this.onTouch();
  }

  onDescriptionChange(value: string): void {
    this.description = value;
    this.updateValue();
    this.onTouch();
  }

  private updateValue() {
    const value = {
      color: this.selectedColor,
      description: this.description
    };
    this.onChange(value);

    if (this.seatsForm?.get('carInfo')) {
      const carInfo = this.seatsForm.get('carInfo');
      carInfo?.get('color')?.setValue(this.selectedColor);
      carInfo?.get('description')?.setValue(this.description);
    }
  }

  //ControlValueAccessor

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_value: any) => { };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouch = () => { };

  writeValue(obj: any): void {
    if (obj) {
      if (obj.color !== undefined) {
        this.selectedColor = obj.color;
      }
      if (obj.description !== undefined) {
        this.description = obj.description;
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
