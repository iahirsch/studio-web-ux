import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupRideRequestComponent } from './popup-ride-request.component';

describe('PopuRideRequestComponent', () => {
  let component: PopupRideRequestComponent;
  let fixture: ComponentFixture<PopupRideRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupRideRequestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(PopupRideRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
