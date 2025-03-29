import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth/auth.service';
import { TravelSearchComponent } from '../travel-search/travel-search.component';

@Component({
  selector: 'app-login',
  imports: [CommonModule, TravelSearchComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent {
  private authService = inject(AuthService);

  login = () => this.authService.login();
}
