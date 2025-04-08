import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CardGreetingComponent } from './card-greeting.component';
import { OAuthService } from 'angular-oauth2-oidc';

describe('CardGreetingComponent', () => {
  let component: CardGreetingComponent;
  let fixture: ComponentFixture<CardGreetingComponent>;
  let mockOAuthService: Partial<OAuthService>;

  beforeEach(async () => {
    mockOAuthService = {
      getIdentityClaims: jest.fn().mockReturnValue({ picture: 'mock-picture-url' })
    };

    await TestBed.configureTestingModule({
      imports: [CardGreetingComponent], // Use imports for standalone components
      providers: [{ provide: OAuthService, useValue: mockOAuthService }]
    }).compileComponents();

    fixture = TestBed.createComponent(CardGreetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set userPicture correctly', () => {
    expect(component.userPicture()).toBe('mock-picture-url');
  });
});
