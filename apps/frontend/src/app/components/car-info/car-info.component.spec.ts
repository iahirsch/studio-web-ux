import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarInfoComponent } from './car-info.component';

describe('CarInfoComponent', () => {
  let component: CarInfoComponent;
  let fixture: ComponentFixture<CarInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarInfoComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CarInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
