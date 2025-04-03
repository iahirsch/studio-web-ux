import { ComponentFixture, TestBed } from '@angular/core/testing';
import { JourneySelectionComponent } from './journey-selection.component';

describe('JourneySelectionComponent', () => {
  let component: JourneySelectionComponent;
  let fixture: ComponentFixture<JourneySelectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JourneySelectionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(JourneySelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
