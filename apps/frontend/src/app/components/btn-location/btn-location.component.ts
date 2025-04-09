// btn-location.component.ts
import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-btn-location',
  imports: [CommonModule, RouterModule],
  templateUrl: './btn-location.component.html',
  styleUrl: './btn-location.component.css'
})
export class BtnLocationComponent {
  title = input<string>('');
  location = input<string>('');
  coordinates = input<string>('');
  btnClicked = output<string>();
}
