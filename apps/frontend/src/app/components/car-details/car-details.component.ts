import { Component, input, OnInit } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { PillItem, PillsComponent } from '../pills/pills.component';

@Component({
  selector: 'app-car-details',
  standalone: true,
  imports: [CommonModule, PillsComponent, NgOptimizedImage],
  templateUrl: './car-details.component.html',
  styleUrl: './car-details.component.css'
})
export class CarDetailsComponent implements OnInit {
  carNumber = input<string>('');
  carBrand = input<string>('');
  carColor = input<string>('');
  colorCode = input<string>('#000000'); // Standardwert Schwarz

  carDetailsPills: PillItem[] = [];

  ngOnInit(): void {
    // Pills für die Anzeige von Auto-Details erstellen
    this.carDetailsPills = [
      { id: 'number', label: `${this.carNumber()}` },
      { id: 'brand', label: `${this.carBrand()}` },
      { id: 'color', label: this.carColor(), color: this.colorCode() }
    ];
  }
}
