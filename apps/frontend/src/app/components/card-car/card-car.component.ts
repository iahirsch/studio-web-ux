import { Component, input } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-car',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card-car.component.html',
  styleUrl: './card-car.component.css',
})
export class CardCarComponent {
  bgColor = input('bg-primary-200');
  txtColor = input('text-primary-950');
  lineColor = input('bg-primary-950');
}
