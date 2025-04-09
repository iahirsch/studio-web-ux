import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupRideRequestConfirmationComponent } from './popup-ride-request-confirmation.component';

describe('PopuRideRequestConfirmationComponent', () => {
  let component: PopupRideRequestConfirmationComponent;
  let fixture: ComponentFixture<PopupRideRequestConfirmationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupRideRequestConfirmationComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupRideRequestConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
