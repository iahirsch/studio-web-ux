import { Component, computed, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-rider-item',
  imports: [CommonModule],
  templateUrl: './rider-item.component.html',
  styleUrl: './rider-item.component.css'
})
export class RiderItemComponent {
  private oauthService = inject(OAuthService);

  driver = input<any>();
  name = input<string>();
  seatComment = input<string>('');
  userPicture = signal(this.oauthService.getIdentityClaims()['picture']);

  userName = computed(() => {
    return this.driver()?.name || this.name() || 'Unknown Driver';
  });

  displayComment = computed(() => {
    return this.driver()?.carInfo?.seatComment || this.seatComment() || '';
  });
}
