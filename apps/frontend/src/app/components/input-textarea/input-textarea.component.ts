import { Component, forwardRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'app-input-textarea',
  imports: [CommonModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InputTextareaComponent),
      multi: true
    }
  ],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.css'
})
export class InputTextareaComponent implements ControlValueAccessor {
  @Input() commentForm!: FormGroup;

  text = '';
  isInfoVisible = true;

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.text = textarea.value;
    this.isInfoVisible = textarea.value.trim() === '';
    this.onChange(this.text);
  }

  //ControlValueAccessor

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onChange = (_value: string) => {};
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onTouched = () => {};

  writeValue(obj: any): void {
    this.text = obj;
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
