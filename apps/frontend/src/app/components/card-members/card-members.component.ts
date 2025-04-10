import { Component, inject, input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-card-members',
  imports: [CommonModule],
  templateUrl: './card-members.component.html',
  styleUrl: './card-members.component.css',
})
export class CardMembersComponent {}
