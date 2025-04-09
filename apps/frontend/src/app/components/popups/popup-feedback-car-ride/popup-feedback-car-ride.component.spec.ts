import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupFeedbackCarRideComponent } from './popup-feedback-car-ride.component';

describe('PopFeedbackCarRideComponent', () => {
  let component: PopupFeedbackCarRideComponent;
  let fixture: ComponentFixture<PopupFeedbackCarRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupFeedbackCarRideComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupFeedbackCarRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
