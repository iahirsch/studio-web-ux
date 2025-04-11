import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-rider-item',
  imports: [CommonModule],
  templateUrl: './rider-item.component.html',
  styleUrl: './rider-item.component.css',
})
export class RiderItemComponent {
  private oauthService = inject(OAuthService);

  name = input<string>();
  userPicture = signal(this.oauthService.getIdentityClaims()['picture']);
}
