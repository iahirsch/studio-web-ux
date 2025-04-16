import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSettingsComponent } from '../../components/profile-settings/profile-settings.component';
import { CardGreetingComponent } from '../../components/card-greeting/card-greeting.component';
import { BtnPrimaryComponent } from '../../components/btn-primary/btn-primary.component';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [
    CommonModule,
    ProfileSettingsComponent,
    CardGreetingComponent,
    BtnPrimaryComponent,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css',
})
export class ProfileComponent {
  private oauthService = inject(OAuthService);
  private router = inject(Router);

  logout(): void {
    this.oauthService.logOut();
    this.oauthService.revokeTokenAndLogout();
    localStorage.clear();
    sessionStorage.clear();
    this.router.navigate(['/login']);
  }
}
