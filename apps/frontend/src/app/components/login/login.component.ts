import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';


@Component({
  selector: 'app-login',
  imports: [CommonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  private oauthService = inject(OAuthService);

  login = () => {
    console.log(this.oauthService);
    this.oauthService.initLoginFlow();
  };
}
