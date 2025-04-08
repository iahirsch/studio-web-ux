import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopFeedbackCarRideComponent } from './pop-feedback-car-ride.component';

describe('PopFeedbackCarRideComponent', () => {
  let component: PopFeedbackCarRideComponent;
  let fixture: ComponentFixture<PopFeedbackCarRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopFeedbackCarRideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopFeedbackCarRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
