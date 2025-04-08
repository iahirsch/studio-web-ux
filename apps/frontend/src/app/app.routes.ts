import { Route, RouterModule } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { LocationSelectorComponent } from './components/location-selector/location-selector.component';
import { authGuard } from './guards/auth/auth.guard';
import { CreateRideComponent } from './pages/create-ride/create-ride.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  { path: 'app-location-selector', component: LocationSelectorComponent },
  { path: 'create-ride', component: CreateRideComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
})
export class AppRoutingModule { }
