import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { LocationSelectorComponent } from './location-selector.component';


jest.mock('ojp-sdk', () => ({}));

describe('TravelSearchComponent', () => {
    let component: LocationSelectorComponent;
    let fixture: ComponentFixture<LocationSelectorComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [LocationSelectorComponent, OAuthModule.forRoot()],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(LocationSelectorComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
