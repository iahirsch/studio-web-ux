import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PlateNumberComponent } from './plate-number.component';

describe('PlateNumberComponent', () => {
  let component: PlateNumberComponent;
  let fixture: ComponentFixture<PlateNumberComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlateNumberComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PlateNumberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
