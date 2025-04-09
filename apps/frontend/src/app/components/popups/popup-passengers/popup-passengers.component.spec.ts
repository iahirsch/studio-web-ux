import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PopupPassengersComponent } from './popup-passengers.component';

describe('PopupPassengersComponent', () => {
  let component: PopupPassengersComponent;
  let fixture: ComponentFixture<PopupPassengersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopupPassengersComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PopupPassengersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
