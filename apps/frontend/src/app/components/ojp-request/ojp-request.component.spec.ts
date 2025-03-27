import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { OjpRequestComponent } from './ojp-request.component';  // or the correct component
describe('OjpRequestComponent', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, OjpRequestComponent],  // Import the standalone component
    }).compileComponents();
  });

  it('should create the component', () => {
    const fixture = TestBed.createComponent(OjpRequestComponent);
    const component = fixture.componentInstance;
    expect(component).toBeTruthy();
  });
});
