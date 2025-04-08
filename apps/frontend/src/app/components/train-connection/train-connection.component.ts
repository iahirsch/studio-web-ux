import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-train-connection',
  imports: [CommonModule],
  templateUrl: './train-connection.component.html',
  styleUrl: './train-connection.component.css',
})
export class TrainConnectionComponent {
  @Input() connection: any;
  @Input() index = 0;

  showDetails = false;

  toggleDetails(): void {
    this.showDetails = !this.showDetails;
  }

}
