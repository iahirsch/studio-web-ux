import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-input-textarea',
  imports: [CommonModule],
  templateUrl: './input-textarea.component.html',
  styleUrl: './input-textarea.component.css'
})
export class InputTextareaComponent {
  isInfoVisible = true;

  onInput(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    this.isInfoVisible = textarea.value.trim() === '';
  }
}
