import { Route } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { CounterComponentComponent } from './counter/counter.component';
import { MapViewComponent } from './components/map-view/map-view.component';
import { OjpSearchComponent } from './components/ojp-search/ojp-search.component';
import { OjpResultsComponent } from './components/ojp-results/ojp-results.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'counter', component: CounterComponentComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'map-view', component: MapViewComponent },
  { path: 'ojp-search', component: OjpSearchComponent },
  { path: 'ojp-results', component: OjpResultsComponent }
];
