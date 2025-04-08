import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarEventComponent } from './car-event.component';

describe('CarEventComponent', () => {
  let component: CarEventComponent;
  let fixture: ComponentFixture<CarEventComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarEventComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
