import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-greeting',
  imports: [CommonModule],
  templateUrl: './card-greeting.component.html',
  styleUrl: './card-greeting.component.css'
})
export class CardGreetingComponent {
  name = input<string>();
}
