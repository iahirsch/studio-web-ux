import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapPinLocationComponent } from './map-pin-location.component';

describe('MapComponent', () => {
  let component: MapPinLocationComponent;
  let fixture: ComponentFixture<MapPinLocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MapPinLocationComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MapPinLocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
