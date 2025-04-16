import { Component, inject, input, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-member-item',
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './member-item.component.html',
  styleUrl: './member-item.component.css'
})
export class MemberItemComponent {
  private oauthService = inject(OAuthService);

  name = input<string>();
  userPicture = signal(this.oauthService.getIdentityClaims()['picture']);
}
