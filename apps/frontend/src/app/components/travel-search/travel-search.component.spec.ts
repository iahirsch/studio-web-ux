import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TravelSearchComponent } from './travel-search.component';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { HttpClient } from '@angular/common/http';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { provideAnimations } from '@angular/platform-browser/animations';

describe('TravelSearchComponent', () => {
  let component: TravelSearchComponent;
  let fixture: ComponentFixture<TravelSearchComponent>;
  let httpClient: HttpClient;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TravelSearchComponent,
        ReactiveFormsModule,
        NoopAnimationsModule
      ],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        provideAnimations()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(TravelSearchComponent);
    component = fixture.componentInstance;
    httpClient = TestBed.inject(HttpClient);
    httpTestingController = TestBed.inject(HttpTestingController);
    fixture.detectChanges();
  });

  afterEach(() => {
    // Verify that no requests are outstanding
    httpTestingController.verify();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with required fields', () => {
    expect(component.travelForm).toBeDefined();
    expect(component.travelForm.get('from')).toBeDefined();
    expect(component.travelForm.get('to')).toBeDefined();
    expect(component.travelForm.get('mode')).toBeDefined();
    expect(component.travelForm.get('date')).toBeDefined();
    expect(component.travelForm.get('time')).toBeDefined();
  });

  it('should mark form as invalid when required fields are empty', () => {
    component.travelForm.setValue({
      from: '',
      to: '',
      mode: 'train',
      date: '2025-03-30',
      time: '09:30'
    });

    expect(component.travelForm.valid).toBeFalsy();
    expect(component.travelForm.get('from')?.valid).toBeFalsy();
    expect(component.travelForm.get('to')?.valid).toBeFalsy();
  });

  it('should mark form as valid when all required fields are filled', () => {
    component.travelForm.setValue({
      from: 'Bern',
      to: 'Zürich',
      mode: 'train',
      date: '2025-03-30',
      time: '09:30'
    });

    expect(component.travelForm.valid).toBeTruthy();
  });

  it('should send HTTP request when form is submitted with valid data', () => {
    // Fill the form with valid data
    component.travelForm.setValue({
      from: 'Bern',
      to: 'Zürich',
      mode: 'train',
      date: '2025-03-30',
      time: '09:30'
    });

    // Submit the form
    component.onSubmit();

    // Expect one request to the API endpoint
    const req = httpTestingController.expectOne(`${component.apiUrl}/trip`);

    // Check that the request is a POST
    expect(req.request.method).toEqual('POST');

    // Check request payload
    expect(req.request.body).toEqual({
      from: 'Bern',
      to: 'Zürich',
      mode: 'train',
      date: '2025-03-30',
      time: '09:30'
    });

    // Respond with mock data
    req.flush({
      trainConnections: [{
        departure: 'Sat, 30 Mar, 09:35',
        arrival: 'Sat, 30 Mar, 10:28',
        duration: '56min',
        transfers: 0,
        platforms: ['3']
      }]
    });

    // Verify results are stored
    expect(component.travelResults).toBeDefined();
    expect(component.loading).toBeFalsy();
  });

  it('should display loading state during API call', fakeAsync(() => {
    // Fill the form with valid data
    component.travelForm.setValue({
      from: 'Bern',
      to: 'Zürich',
      mode: 'train',
      date: '2025-03-30',
      time: '09:30'
    });

    // Submit the form
    component.onSubmit();

    // Check loading state
    expect(component.loading).toBeTruthy();

    // Manually trigger change detection
    fixture.detectChanges();

    // Check that the loading text is displayed
    const buttonText = fixture.debugElement.query(By.css('button[type="submit"]')).nativeElement.textContent;
    expect(buttonText.trim()).toBe('Searching...');

    // Simulate response
    const req = httpTestingController.expectOne(`${component.apiUrl}/trip`);
    req.flush({});

    // Ensure all pending asynchronous activities complete
    tick();
    fixture.detectChanges();

    // Check that loading state is cleared
    expect(component.loading).toBeFalsy();
  }));

  it('should handle API errors', () => {
    // Fill the form with valid data
    component.travelForm.setValue({
      from: 'Bern',
      to: 'Zürich',
      mode: 'train',
      date: '2025-03-30',
      time: '09:30'
    });

    // Submit the form
    component.onSubmit();

    // Simulate error response
    const req = httpTestingController.expectOne(`${component.apiUrl}/trip`);
    req.flush('Error', { status: 500, statusText: 'Server Error' });

    // Check error state
    expect(component.error).toBeTruthy();

    // Check that loading state is cleared
    expect(component.loading).toBeFalsy();

    // Check that error message is displayed
    fixture.detectChanges();
    const errorElement = fixture.debugElement.query(By.css('.error-message'));
    expect(errorElement).toBeTruthy();
    expect(errorElement.nativeElement.textContent).toContain('Failed to retrieve travel data');
  });

  it('should display results when API returns data', () => {
    const mockResponse = {
      trainConnections: [{
        departure: 'Sat, 30 Mar, 09:35',
        arrival: 'Sat, 30 Mar, 10:28',
        duration: '56min',
        transfers: 0,
        platforms: ['3']
      }]
    };

    // Fill the form with valid data
    component.travelForm.setValue({
      from: 'Bern',
      to: 'Zürich',
      mode: 'train',
      date: '2025-03-30',
      time: '09:30'
    });

    // Submit the form
    component.onSubmit();

    // Simulate successful response
    const req = httpTestingController.expectOne(`${component.apiUrl}/trip`);
    req.flush(mockResponse);

    // Check results
    expect(component.travelResults).toEqual(mockResponse);

    // Check that UI displays results
    fixture.detectChanges();
    const resultsElement = fixture.debugElement.query(By.css('.results'));
    expect(resultsElement).toBeTruthy();

    // Check specific result data is displayed
    const connectionElement = fixture.debugElement.query(By.css('.connection-details'));
    expect(connectionElement.nativeElement.textContent).toContain('Sat, 30 Mar, 09:35');
    expect(connectionElement.nativeElement.textContent).toContain('Sat, 30 Mar, 10:28');
  });
});