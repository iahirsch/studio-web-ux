import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { env } from '../../../env/env';

@Component({
  selector: 'app-travel-search',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './travel-search.component.html',
  styleUrl: './travel-search.component.css'
})
export class TravelSearchComponent {
  private httpClient = inject(HttpClient);
  private fb = inject(FormBuilder);

  travelForm: FormGroup;
  travelResults: any = null;
  loading = false;
  error: string | null = null;

  constructor() {
    this.travelForm = this.fb.group({
      from: ['', Validators.required],
      to: ['', Validators.required],
      mode: ['train', Validators.required], // Default to train
      date: [this.formatDate(new Date()), Validators.required],
      time: [this.formatTime(new Date()), Validators.required]
    });
  }

  onSubmit(): void {
    if (this.travelForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = null;
    this.travelResults = null;

    const formData = this.travelForm.value;

    this.httpClient.post<any>(`${env.api}/ojp-api/trip`, formData)
      .subscribe({
        next: (response) => {
          this.travelResults = response;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'Failed to retrieve travel data. Please try again.';
          console.error('Error fetching travel data:', err);
          this.loading = false;
        }
      });
  }

  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  private formatTime(date: Date): string {
    return date.toTimeString().substring(0, 5);
  }
}