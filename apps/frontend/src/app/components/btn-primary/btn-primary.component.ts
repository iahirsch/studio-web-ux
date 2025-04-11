import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-btn-primary',
  imports: [CommonModule],
  templateUrl: './btn-primary.component.html',
  styleUrl: './btn-primary.component.css',
})
export class BtnPrimaryComponent {
  text = input('');
}
