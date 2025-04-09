import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-train-details',
  imports: [CommonModule],
  templateUrl: './card-train-details.component.html',
  styleUrl: './card-train-details.component.css'
})
export class CardTrainDetailsComponent {
  @Input() connection: any;
}
