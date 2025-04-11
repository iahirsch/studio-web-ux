import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PillItem, PillsComponent } from '../pills/pills.component';
import { InputTextComponent } from '../input-text/input-text.component';

@Component({
  selector: 'app-car-info',
  standalone: true,
  imports: [CommonModule, PillsComponent, InputTextComponent],
  templateUrl: './car-info.component.html',
  styleUrl: './car-info.component.css'
})
export class CarInfoComponent {
  colorPills: PillItem[] = [
    { id: 'black', label: 'Schwarz', color: '#000000' },
    { id: 'white', label: 'Weiss', color: '#FFFFFF' },
    { id: 'silver', label: 'Silber', color: '#C0C0C0' },
    { id: 'red', label: 'Rot', color: '#FF0000' },
    { id: 'blue', label: 'Blau', color: '#0000FF' },
    { id: 'green', label: 'Grün', color: '#008000' }
  ];

  selectedColor = 'black';

  constructor() {
    // Standard-Farbe setzen
    this.colorPills[0].isSelected = true;
  }

  onColorSelected(pillItem: PillItem): void {
    this.selectedColor = pillItem.id as string;
    // Für andere Komponenten könnte hier ein Service oder Event-Bus zum Einsatz kommen
    console.log(`Farbe ausgewählt: ${this.selectedColor}`);
  }
}
