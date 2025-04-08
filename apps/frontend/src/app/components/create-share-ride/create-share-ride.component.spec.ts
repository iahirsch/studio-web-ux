import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateShareRideComponent } from './create-share-ride.component';

describe('CreateShareRideComponent', () => {
  let component: CreateShareRideComponent;
  let fixture: ComponentFixture<CreateShareRideComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateShareRideComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateShareRideComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
