import { TestBed } from '@angular/core/testing';

import { ReactiveFormsModule } from '@angular/forms';
import { DashboardComponent } from './dashboard.component';  // Make sure to import your component
import { AuthService } from '../../services/auth/auth.service';  // Ensure AuthService is imported if used in the component

describe('DashboardComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, DashboardComponent],  // Add DashboardComponent to imports
      providers: [AuthService],  // Provide AuthService if it is injected into the component
    }).compileComponents();
  });

  it('should create', () => {


    //expect().toBeTruthy();
  });
});
