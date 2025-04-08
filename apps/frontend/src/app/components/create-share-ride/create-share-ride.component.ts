import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextareaComponent } from '../input-textarea/input-textarea.component';

@Component({
  selector: 'app-create-share-ride',
  imports: [CommonModule, InputTextareaComponent],
  templateUrl: './create-share-ride.component.html',
  styleUrl: './create-share-ride.component.css'
})
export class CreateShareRideComponent {
}
