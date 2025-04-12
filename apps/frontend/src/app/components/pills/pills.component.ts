import { Component, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';

export type PillType = 'location' | 'color' | 'info';

export interface PillItem {
  id: string | number;
  label: string;
  color?: string; // Für Farbauswahl
  isSelected?: boolean;
}

@Component({
  selector: 'app-pills',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pills.component.html',
  styleUrl: './pills.component.css'
})
export class PillsComponent {
  pillType = input<string>('location'); // Standard-Typ ist 'location'
  pillItems = input<PillItem[]>();
  disabled = input<boolean>(false); // Für Car-Details nicht klickbar
  pillSelected = output<PillItem>();

  onPillClick(pillItem: PillItem): void {
    if (this.disabled()) return;

    // Wenn nicht deaktiviert, setze das ausgewählte Item und emittiere das Event
    this.pillItems()?.forEach(i => i.isSelected = i.id === pillItem.id);
    this.pillSelected.emit(pillItem);
  }
}
