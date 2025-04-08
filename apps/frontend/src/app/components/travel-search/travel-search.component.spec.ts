import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { TravelSearchComponent } from './travel-search.component';


jest.mock('ojp-sdk', () => ({}));

describe('TravelSearchComponent', () => {
    let component: TravelSearchComponent;
    let fixture: ComponentFixture<TravelSearchComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TravelSearchComponent, OAuthModule.forRoot()],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(TravelSearchComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
