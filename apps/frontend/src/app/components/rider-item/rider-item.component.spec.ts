import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RiderItemComponent } from './rider-item.component';

describe('RiderItemComponent', () => {
  let component: RiderItemComponent;
  let fixture: ComponentFixture<RiderItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RiderItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RiderItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
