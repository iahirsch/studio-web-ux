import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn-secondary',
  imports: [CommonModule],
  templateUrl: './btn-secondary.component.html',
  styleUrl: './btn-secondary.component.css',
})
export class BtnSecondaryComponent {
  text = input('');
}
