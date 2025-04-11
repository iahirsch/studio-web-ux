import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';

@Component({
  selector: 'app-card-train',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './card-train.component.html',
  styleUrl: './card-train.component.css',
})
export class CardTrainComponent {
  @Input() connection: any;
  @Input() index = 0;
  @Output() detailsRequested = new EventEmitter<any>();

  showDetails(): void {
    this.detailsRequested.emit(this.connection);
  }
}
