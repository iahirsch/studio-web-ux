import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InputTextareaComponent } from '../../components/input-textarea/input-textarea.component';

@Component({
  selector: 'app-create-ride',
  imports: [CommonModule, InputTextareaComponent],
  templateUrl: './create-ride.component.html',
  styleUrl: './create-ride.component.css'
})
export class CreateRideComponent {
}
