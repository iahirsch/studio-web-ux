import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-card-members',
  imports: [CommonModule],
  templateUrl: './card-members.component.html',
  styleUrl: './card-members.component.css'
})
export class CardMembersComponent {
  members = input<any[]>([]);
}
