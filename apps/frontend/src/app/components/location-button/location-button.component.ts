import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'location-button',
  imports: [CommonModule],
  templateUrl: './location-button.component.html',
  styleUrl: './location-button.component.css',
})
export class LocationButtonComponent {
  title = input<string>();
  location = input<string>();
  btnClicked = output();
}


