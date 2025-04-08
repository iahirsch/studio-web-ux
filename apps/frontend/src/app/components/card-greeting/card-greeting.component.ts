import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-card-greeting',
  imports: [CommonModule],
  templateUrl: './card-greeting.component.html',
  styleUrl: './card-greeting.component.css'
})
export class CardGreetingComponent {
  private oauthService = inject(OAuthService);

  name = input<string>();
  userPicture = signal(this.oauthService.getIdentityClaims()['picture']);
}
