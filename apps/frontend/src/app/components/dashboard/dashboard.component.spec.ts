import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { OAuthModule } from 'angular-oauth2-oidc';
import { DashboardComponent } from './dashboard.component';
import { OjpSdkService } from '../../services/ojp/ojp-sdk.service';
import { OjpApiService } from '../../services/ojp/ojp-api.service';

jest.mock('ojp-sdk', () => ({}));

describe('DashboardComponent', () => {
    let component: DashboardComponent;
    let fixture: ComponentFixture<DashboardComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [DashboardComponent, OAuthModule.forRoot()],
            providers: [provideHttpClient(), provideHttpClientTesting()]
        }).compileComponents();

        fixture = TestBed.createComponent(DashboardComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
