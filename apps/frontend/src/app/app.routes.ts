import { Route, RouterModule } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NgModule } from '@angular/core';
import { TravelSearchComponent } from './components/travel-search/travel-search.component';
import { LocationButtonComponent } from './components/location-button/location-button.component';
import { authGuard } from './guards/auth/auth.guard';
import { TrainConnectionComponent } from './components/train-connection/train-connection.component';

export const appRoutes: Route[] = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] },
  { path: 'app-travel-search', component: TravelSearchComponent },
  { path: 'app-location-button', component: LocationButtonComponent },
  { path: 'app-train-connection', component: TrainConnectionComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  providers: [],
})
export class AppRoutingModule { }
