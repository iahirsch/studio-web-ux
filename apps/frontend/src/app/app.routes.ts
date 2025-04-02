import { Route, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { AuthGuard } from './guards/auth/auth.guard';
import { NgModule } from '@angular/core';
import { TravelSearchComponent } from './components/travel-search/travel-search.component';
import { LocationButtonComponent } from './components/location-button/location-button.component';


export const appRoutes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
  { path: 'app-travel-search', component: TravelSearchComponent, canActivate: [AuthGuard] },
  { path: 'location-button', component: LocationButtonComponent, canActivate: [AuthGuard] },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
})
export class AppRoutingModule { }