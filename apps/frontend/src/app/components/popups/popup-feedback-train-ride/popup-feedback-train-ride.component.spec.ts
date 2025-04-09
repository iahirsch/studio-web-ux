import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupFeedbackTrainRideComponent } from './popup-feedback-train-ride.component';

describe('PopupFeedbackTrainRideComponent', () => {
  let component: PopupFeedbackTrainRideComponent;
  let fixture: ComponentFixture<PopupFeedbackTrainRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupFeedbackTrainRideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupFeedbackTrainRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
