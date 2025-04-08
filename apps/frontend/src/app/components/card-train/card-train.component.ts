import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-train',
  imports: [CommonModule],
  templateUrl: './card-train.component.html',
  styleUrl: './card-train.component.css',
})
export class CardTrainComponent {
  @Input() connection: any;
  @Input() index = 0;

  showDetails = false;

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

}
