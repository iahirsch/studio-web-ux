import { Component, inject, input, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-profile-settings',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css',
})
export class ProfileSettingsComponent {
  private oauthService = inject(OAuthService);

  name = input<string>();
  userPicture = signal(this.oauthService.getIdentityClaims()['picture']);
}
