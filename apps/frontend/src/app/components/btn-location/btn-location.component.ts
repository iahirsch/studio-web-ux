import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn-location',
  imports: [CommonModule],
  templateUrl: './btn-location.component.html',
  styleUrl: './btn-location.component.css'
})
export class BtnLocationComponent {
  title = input<string>();
  location = input<string>();
  btnClicked = output();
}


